import ShanNetworkClient from "./Shan.NetworkClient";
import Card from "./common/Shan.Card";
import cmd from "./Shan.Cmd";
import GameController from "./Shan.GameController";

const { ccclass, property } = cc._decorator;
var TW = cc.tween

@ccclass
export class NodeNanBai extends cc.Component {
    @property(cc.Node)
    masks: cc.Node[]=[];
    @property(Card)
    cards: Card[]=[]
    @property(cc.Node)
    btns: cc.Node[] = [];
    @property(cc.Node)
    btnOpen: cc.Node = null;
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Node)
    hands: cc.Node[] = [];
    @property(cc.AudioClip)
    openCard: cc.AudioClip = null;
    private _canNan: boolean;
    private _selectedMask: cc.Node;
    private _belowCard: Card;
    private _touchBeganPos: cc.Vec2;
    private _deltaPos: any;
    private _hasBeenShowCard: boolean;
    private _closeCB: any;
    private _countDownEndAt: number;
    private _cardIds: number[];
    private _isClosing: boolean;
    private _isBanker: boolean;
    private _isInstantWin: boolean;
    private _gameLayer: GameController;
    private _ws: ShanNetworkClient;
    constructor() {
        super();
        this._countDownEndAt = 0;
        this._hasBeenShowCard = false;
        this._isClosing = true;
        this._canNan = false;
    }
    setWs(ws) {
        this._ws = ws;
    }
    setGameLayer (game) {
        this._gameLayer = game;
    }
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.maskTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.maskTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.maskTouchEnd, this);
        // this.cards.forEach(function(c) { c.setMode(2)});
        this.cards[0].setMode(2);
        this.cards[1].setMode(2);
        this.cards[2].setMode(2);
        // cc.log('this.cards[0]._mode========= ', this.cards[2]._mode)
    }

    update (dt) {
        if (this.node.active) {
            if (cc.sys.now() < this._countDownEndAt) {
                this.lbTime.string = Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000) + "";
            } else {
                // cc.log('closeDialog update', cc.sys.now(), this._countDownEndAt);
                this.closeDialog();
            }

            if (!this._hasBeenShowCard && Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000) < 7) {
                if (!this.masks[2].active) {
                    this._selectedMask = this.masks[1];
                    this._belowCard = this.cards[1];
                    // cc.log('showButtons got here!!!', Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000))
                    this._onNanFinish();
                }
            }
        }
    }

    startCount (seconds) {
        this._countDownEndAt = seconds * 1000 + cc.sys.now();
    }

    init (seconds, isBanker, isInstantWin, cardIds, closeCb) {
        // cc.log('showButtons got here INITTTT!!!')

        this._hasBeenShowCard = false;
        this._selectedMask = null;
        this._belowCard = null;
        this._isClosing = false;
        this.enableBtns(false);
        this.btnOpen.active = false;

        this._isBanker = isBanker;
        this._isInstantWin = isInstantWin;

        this._cardIds = cardIds;
        this._closeCB = closeCb;

        this.startCount(seconds);
        this.node.active = true;

        this.hands[1].active = true;
        this.hands[2].active = true;

        this._canNan = false;

        for (let i = 0; i < this.masks.length; i++) {
            this.masks[i].stopAllActions();
            this.masks[i].opacity = 255;
            this.masks[i].active = true;
        }

        for (let i = 0; i < cardIds.length; i++) {
            let c = this.cards[i];
            c.node.stopAllActions();
            c.setId(cardIds[i]);
            c.show();
            c.node.x = (i - (cardIds.length - 1) / 2) * 400;

            this.masks[i].setPosition(c.node.getPosition());
        }

        for (let i = cardIds.length; i < 3; i++) {
            this.cards[i].node.active = false;
            this.masks[i].active = false;
        }

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(0.15),
            cc.callFunc(function () {
                for (let i = 0; i < this._cardIds.length - 1; i++) {
                    this.masks[i].stopAllActions();
                    this.masks[i].runAction(cc.sequence(this._maskAction(cc.v2(15, 50).normalize(), i)))
                }
            }.bind(this)),
            cc.delayTime(0.1),
            cc.callFunc(function () {
                this.btnOpen.active = true;
                this._canNan = true;
            }.bind(this))
        ))
    }
    
    maskTouchBegan (event) {
        let touches = event.getTouches();
        if (touches.length > 1 || !this._canNan) return;

        let pos = this.node.convertToNodeSpaceAR(touches[0].getLocation());

        for (let i = 0; i < this.masks.length; i++) {
            if (this.masks[i].active && this.masks[i].getBoundingBox().contains(pos)) {
                this._selectedMask = this.masks[i];
                this._belowCard = this.cards[i];

                this._touchBeganPos = pos;
                this._deltaPos = this._touchBeganPos.sub(this._selectedMask.getPosition());

                this.hands[i].active = false;
                break;
            }
        }
        return;
    }

    maskTouchMove (event) {
        let touches = event.getTouches();
        let pos = this.node.convertToNodeSpaceAR(touches[0].getLocation());

        if (this._selectedMask) {
            this._selectedMask.setPosition(pos.sub(this._deltaPos));

            let originPos = this._selectedMask == this.masks[1] ? this.cards[1].node.getPosition() : this.cards[2].node.getPosition();
            if ((this._selectedMask.x - originPos.x) > this.cards[0].node.getContentSize().width * 0.25
                || (this._selectedMask.y - originPos.y) > this.cards[0].node.getContentSize().height * 0.65
                || -(this._selectedMask.x - originPos.x) > this.cards[0].node.getContentSize().width * 0.45
                || -(this._selectedMask.y - originPos.y) > this.cards[0].node.getContentSize().height * 0.25
            ) {
                this._gameLayer._userAction = true;
                this._onNanFinish();
            }
        }
    }

    maskTouchEnd (event) {
        // cc.log('maskTouchEnd');

        if (this._selectedMask) {
            // this._selectedMask.setPosition(pos.sub(this._deltaPos));

            let originPos = this._selectedMask == this.masks[1] ? this.cards[1].node.getPosition() : this.cards[2].node.getPosition();
            cc.tween(this._selectedMask)
                .to(0.1, { x: originPos.x, y: originPos.y })
                .start();
        }
    }

    _onNanFinish () {
        // cc.log('showButtons On nan finish==')
        this._hasBeenShowCard = true;
        let vector = cc.v2();
        if (this._selectedMask) {
            vector = this._selectedMask.getPosition().sub(this._belowCard.node.getPosition()).normalize();
            if (this._selectedMask.active && this._selectedMask.opacity > 0) {
                // Global.audioManager.play(this.openCard);
            }
        }

        let actions = this._maskAction(vector, 0);

        if (this._isBanker || this._selectedMask == this.masks[2]) {
            actions.push(
                cc.delayTime(0.5),
                cc.callFunc(function () {
                    // cc.log('closeDialog _onNanFinish');
                    this.closeDialog()
                }.bind(this))
            )
        } else {
            actions.push(
                cc.delayTime(0.1),
                cc.callFunc(function () {
                    this.showButtons();
                }.bind(this))
            )
        }

        this._selectedMask.stopAllActions();
        this._selectedMask.runAction(cc.sequence(actions))

        this._belowCard = null;
        this._selectedMask = null;


    }

    showButtons () {
        // cc.log('showButtons');
        if (this._isInstantWin) {
            // cc.log('closeDialog showButtons');
            this.enableBtns(false);
            this.btnOpen.active = false;
            this.closeDialog();
        } else {
            this.enableBtns(true);
            this.btnOpen.active = false;
        }
    }

    closeDialog () {
        if (!this._isClosing) {
            this._isClosing = true;
            this.node.active = false;
            this._onClose();
        }
    }

    _maskAction (dir, i) {
        return [
            cc.delayTime(0.15 * i),
            cc.spawn(
                cc.moveBy(0.3, dir.mul(50)),
                cc.fadeOut(0.15),
                cc.callFunc(() => {
                    if (this._selectedMask)
                        this._selectedMask.active = false
                })
            )
        ]
    }

    _onClose () {
        this._closeCB && this._closeCB();
    }

    onBtnDrawClicked () {
        this._gameLayer._userAction = true;
        // ShanController.instance._userAction;

        this.enableBtns(false);
        this.btnOpen.active = false;

        this._ws.draw();
    }

    onBtnNoDrawClicked () {
        this._gameLayer._userAction = true;

        this.enableBtns(false);
        this.btnOpen.active = false;

        // cc.log('closeDialog onBtnNoDrawClicked');
        this.closeDialog();
    }

    onBtnOpenClicked () {
        this._gameLayer._userAction = true;

        if (!this.masks[2].active) {
            this._selectedMask = this.masks[1];
            this._belowCard = this.cards[1];
            // cc.log('showButtons got here!!!', Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000))
            this._onNanFinish();
        }
    }

    enableBtns (value) {
        for (let i = 0; i < this.btns.length; i++)
            this.btns[i].active = value;
    }

    drawCard (cardId) {
        // cc.log("drawCard", cardId);

        for (let i = 0; i < 2; i++) {
            this.cards[i].node.stopAllActions();
            this.cards[i].node.runAction(cc.moveTo(0.3, cc.v2((i - 1) * 400, 70)));
        }

        this.masks[1].active = false;

        this._cardIds.push(cardId);
        let card = this.cards[2];
        let mask = this.masks[2];

        card.setId(cardId, true);
        card.show();

        mask.opacity = 255;
        mask.active = true;
        card.node.active = true;

        card.node.y = this.node.height;
        mask.setPosition(card.node.getPosition());

        card.node.stopAllActions();
        mask.stopAllActions();

        card.node.runAction(cc.moveTo(0.5, cc.v2(card.node.x, 70)));
        mask.runAction(cc.moveTo(0.5, cc.v2(card.node.x, 70)));
    }
}