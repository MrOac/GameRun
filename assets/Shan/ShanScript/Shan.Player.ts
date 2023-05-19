import Card from "./common/Shan.Card";
import Chip from "./common/Shan.Chip";
import ChipGroup from "./common/Shan.ChipGroup";
import PlayerNode from "./common/Shan.PlayerNode";
import ShanUtils, { getArrChipFromMoney, setTextureFromRes } from "./common/Shan.Utils";
import CardGroup from "./Model/ShanCardGroup";
import GROUP_CARD_NAME from "./Model/ShanCardGroupName";
import cmd from "./Shan.Cmd";
import { Constant } from "./Shan.Contants";
import GameController from "./Shan.GameController";

var TW = cc.tween
const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends PlayerNode {
    @property(cc.Node)
    bgBet: cc.Node = null;
    @property(cc.Label)
    lbBetAmount: cc.Label = null;

    @property(cc.Sprite)
    status: cc.Sprite = null;
    @property(cc.Prefab)
    prefabChip: cc.Prefab = null;
    @property(cc.Node)
    bankerEffect: cc.Node = null;
    @property(cc.SpriteFrame)
    multipleFrame: cc.SpriteFrame[] = []

    @property(sp.Skeleton)
    animAllIn: sp.Skeleton = null;
    @property(sp.Skeleton)
    animMaxBet: sp.Skeleton = null;

    @property(cc.Label)
    lbWaiting: cc.Label = null;
    @property(cc.Node)
    drawEfected: cc.Node = null;
    bgPoint: any;
    bgPointLose: any;
    bgShan8: any;
    bgShanSap: any;
    lbPoint: any;
    multiple: any;
    waitingOpen: any;
    _isBanker: boolean;
    _target: GameController;
    private _baseBetAmount: number;
    bgShan9: any;
    _isShow: boolean;

    constructor() {
        super();
        this.bgPoint = null;
        this.bgPointLose = null;
        this.bgShan8 = null;
        this.bgShan9 = null;
        this.bgShanSap = null;
        this.lbPoint = null;
        this.multiple = null;
        this.waitingOpen = null;
        this._isBanker = false;
    }

    onLoad() {
        // this._super();
        super.onLoad();
        this._target = GameController.instance;
        this.lbBetAmount && (this.lbBetAmount.node.parent.active = false);
        // this.bgPoint.active = false;
        // this.bgShan8.node.active = false;
        // this.bgShan9.node.active = false;
        // this.bgShanSap.node.active = false;
        // this.bgPoint.scale = Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
        // this.bgShan8.node.scale = Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
        // this.bgShan9.node.scale = Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
        // this.bgShanSap.node.scale = Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
        // // this.status.node.active = false;

        // this.bankerEffect.active = false;
        // this.multiple.node.active = false;
        // this.waitingOpen.active = false;
        // this.multiple.node.zIndex = 100;
        // this.waitingOpen.zIndex = 100;

        // this.startCountDown(10,100);

        // cc.log('Global.user', Global.user)
    }

    showComputerPlay() {
        this._data.userName = "compute playing";
        this.lbName.string = this._data.userName;
    }

    setBaseBetAmount(value: number) {
        this._baseBetAmount = value;
    }

    updateBetAmount(value) {
        this._data.betAmount = value;
    }

    getBetAmount() {
        return this._data.betAmount || 0
    }

    bet(betAmount, remainMoney) {
        this._data.betAmount = betAmount;
        this._data.money = remainMoney;

        this.vibrateAvatar();
    }

    setBanker(boolean) {
        this._isBanker = boolean;
        if (this.bankerEffect) {
            this.bankerEffect.active = boolean;
            this.bankerEffect.setScale(0)
            cc.tween(this.bankerEffect)
                .to(0.2, { scale: 1 })
                .start();
        }
    }

    clean() {
        super.clean();
        this.bgBet && (this.bgBet.active = false);
        this.multiple.node.active = false;
        this.bgPoint.active = false;
        this.bgShan8.node.active = false;
        this.bgShan9.node.active = false;
        this.bgShanSap.node.active = false;
        this._data.betAmount = 0;
        this._isShow = false;
        if (this.drawEfected) this.drawEfected.active = false;

        this.setDarkMode(false);
        this.showAllInAnim(false);
        this.showAMaxBetAnim(false);
        this.showWaitingNewMatch(false);
    }

    setShow(isShow) {
        this._isShow = isShow;
    }

    showAllCards() {
        this.setVisibleWatingOpenCards(false);
        if (this._cards.length == 0 || this._cardData.length == 0 || this._isShow)
            return;

        this._isShow = true;
        if (this.localChair == 0) {
            // cc.log("showAllCards", this._cards.length);
        }

        for (let i = 0; i < this._cards.length; i++) {
            let c = this._cards[i];
            c.setId(this._cardData[i]);
            c.node.stopAllActions();
        }

        if (this._isSpecicalGroup()) {
            this._showSpecicalHand();
        }
        else {
            this._showNomalHand();
            this._gameLayer.shanKoeMeeSound.playShowAllCards();
        }
    }

    _showCardGroup() {
        var group = new CardGroup();
        group.setCards(this._cards);
        let scale = this._cards[0].getTargetScale() || this._cards[0].scale;

        let animScale = scale;

        if (this.localChair != 0) {
            animScale *= 1.2;
        }
        let animKey = "animation"
        if (group.getGroupName().valueOf() == GROUP_CARD_NAME.NONE.valueOf()) {
            this.bgPoint.active = true;
            if (group.getPoint() == 10) {
                this.lbPoint.string = "បីអោន";// card group head
                this.lbPoint.node.y = 4;
            } else {
                this.lbPoint.string = group.getPoint() + " " + " ពិន្ទុ";// point
                this.lbPoint.node.y = 4;
            }

            this.bgPoint.scaleX = 0;
            this.bgPoint.scaleY = scale;
            cc.tween(this.bgPoint)
                .to(0.15, { opacity: 255, scaleX: scale }, { easing: 'backIn' })
                .start();

            return this.bgPoint;
        }
        else if (group.getGroupName().valueOf() == GROUP_CARD_NAME.SHAN.valueOf()) {
            this.bgPoint.active = false;
            this.lbPoint.string = "";
            
            if (group.getPoint() == 8) {
                this.bgShan8.node.active = true;
                this.bgShan8.node.scale = animScale;
                this.bgShan8.animation =animKey;

                if (this.localChair === 0) {
                    this._gameLayer.shanKoeMeeSound.playShan8();
                }
                return this.bgShan8.node;
            }
            else if (group.getPoint() == 9) {
                this.bgShan9.node.active = true;
                this.bgShan9.node.scale = animScale;
                this.bgShan9.animation = animKey;
                if (this.localChair === 0) {
                    this._gameLayer.shanKoeMeeSound.playShan9();
                }

                return this.bgShan9.node;
            }
        } else {
            this.bgPoint.active = false;
            this.bgShanSap.node.active = true;
            this.bgShanSap.node.scale = animScale;
            this.bgShanSap.animation = animKey;
            this._gameLayer.shanKoeMeeSound.playThreeOfAKind();
            return this.bgShanSap.node;
        }
    }

    showGroupName(scale?: number, isSpecial?: boolean) {
        // cc.log("showGroupName", this._cards);
        scale = scale || 1
        if (this._cards[0]) {
            var leftPos = this._cards[0].node.getPosition();
            var rightPos = this._cards[this._cards.length - 1].node.getPosition();
            var pos = cc.v2((leftPos.x + rightPos.x) / 2, leftPos.y - (this._cards[0].node.height / 2 - 5) * this._cards[0].node.scale);
            var cardGroupNode = this._showCardGroup();
            let newPos = cardGroupNode.parent.convertToNodeSpaceAR(this._cards[0].node.parent.convertToWorldSpaceAR(pos))
            cardGroupNode.x = newPos.x;

            // cardGroupNode.opacity = 0;
            // cardGroupNode.scale = scale;

            // if (isSpecial) {
            //     cc.tween(cardGroupNode)
            //         .to(0.15, { opacity: 255, skewX: 0, skewY: 0, scaleX: scale * 1.8, scaleY: scale * 1.8 } { easing: 'backOut' })
            //         .delay(0.02)
            //         .to(0.15, { scale: scale } { easing: 'backIn' })
            //         .start();
            // }
            // else {
            //     cardGroupNode.scaleX = 0;
            //     cc.tween(cardGroupNode)
            //         .to(0.15, { opacity: 255, scaleX: scale } { easing: 'backIn' })
            //         .start();
            // }
        }
    }

    _isSpecicalGroup() {
        var group = new CardGroup();
        group.setCards(this._cards);

        if (group.getGroupName().valueOf() == GROUP_CARD_NAME.NONE.valueOf()) {
            return false
        } else {
            return true;
        }
    }

    showMultiple() {
        var group = new CardGroup();
        group.setCards(this._cards);
        let _num = group.getMultiple();
        this.multiple.node.active = false;
        // cc.log('showMultiple: ' + _num);
        switch (_num) {
            case 1:
                this.multiple.node.active = false;
                break;
            case 2:
                {
                    this.multiple.node.active = true;
                    this.multiple.spriteFrame = this.multipleFrame[0]
                    break;
                }
            case 3:
                {
                    this.multiple.node.active = true;
                    this.multiple.spriteFrame = this.multipleFrame[1]
                    break;
                }

            case 5:
                {
                    this.multiple.node.active = true;
                    this.multiple.spriteFrame = this.multipleFrame[2]
                    break;
                }
            default:
                break;
        }

        var scale = this._cards[0] ? this._cards[0].node.scale : 1;
        let cardLast = this._cards[this._cards.length - 1];
        let position = cc.v2(cardLast.node.x + cardLast.node.getContentSize().width * 0.45 * scale, cardLast.node.y + cardLast.node.getContentSize().height * 0.4);
        // position = position.sub(this.node.getPosition());
        this.multiple.node.setPosition(position);
    }

    hideGroupName() {
        this.multiple.node.active = false;
        this.bgPoint.active = false;
        this.bgShan8.node.active = false;
        this.bgShan9.node.active = false;
        this.bgShanSap.node.active = false;
    }

    instantlyAddCard(data, isShow, nodeHasCard) {
        // cc.log("instantlyAddCard", data, isShow);
        if (this._data.stateId == cmd.Code.PLAYER_STATUS_OUT_GAME || !data)
            return;

        var numberOfCard = isShow ? data.length : data;
        if (isShow) {
            this._cardData = data;
        }

        var newPos = this._getCardPos();
        var offsetX = Constant.SHANKOEMEE_CARD_ON_HAND_GAP * Constant.SHANKOEMEE_CARD_DEALING_SCALE;

        for (var i = 0; i < numberOfCard; i++) {
            var c = cc.instantiate(this.prefabCard);
            c.setPosition(cc.v2(newPos.x + (offsetX * i), newPos.y));
            c.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE;
            nodeHasCard.addChild(c);

            var card = c.getComponent(Card);
            if (isShow) {
                card.setId(data[i]);
                card.show();
            }

            this._addCard(card);
        }
        cc.tween(nodeHasCard)
            .delay(0.1)
            .call(() => {
                this._updateCardRotation();
            })
            .start();

        if (isShow) {
            this.showGroupName();
            this.showMultiple();
        }

        // cc.log("checker", this._cards.length, this._cardData.length, data, isShow);
        return this._cards;
    }

    addCard(card) {
        if (this._addCard(card)) {
            var cardStartPosX = this._getCardStartPosX();
            var offsetX = Constant.SHANKOEMEE_CARD_ON_HAND_GAP * Constant.SHANKOEMEE_CARD_DEALING_SCALE;

            var newPos = cc.v2(cardStartPosX + (offsetX * (this._cards.length - 1)), this._getCardPos().y)
            card.setTargetPos(newPos);
            card.setTargetScale(Constant.SHANKOEMEE_CARD_DEALING_SCALE);

            card.node.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.2, newPos),
                    cc.rotateBy(0.2, 180),
                    cc.scaleTo(0.2, Constant.SHANKOEMEE_CARD_DEALING_SCALE)
                ),
                cc.callFunc(function () {
                    this._updateCardRotation();
                }.bind(this)))
            )
        }
    }

    _updateCardRotation() {
        if (this._cards.length > 1) {
            for (var i = 0; i < this._cards.length; i++) {
                this._cards[i].node.angle = Constant.SHANKOEMEE_ROTATION_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][i];
                // this._cards[i].node.x = Constant.SHANKOEMEE_POS_X_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][i];
                this._cards[i].node.y = this._getCardPos().y + Constant.SHANKOEMEE_POS_Y_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][i];
            }
        }
    }

    _getCardStartPosX() {
        var newPos = cc.v2(0, 0);
        if (this.localChair == 4 || this.localChair == 5 || this.localChair == 6)     // Left
            newPos = cc.v2(-125, 0);
        else if (this.localChair == 1 || this.localChair == 2 || this.localChair == 3) // Right
            newPos = cc.v2(100, 0);
        else                            // Top
            newPos = cc.v2(100, 0);

        return this.node.getPosition().x + newPos.x;
    }

    _getCardPos() {
        var newPos = cc.v2();
        if (this.localChair == 4 || this.localChair == 5 || this.localChair == 6)     // Left
            newPos = cc.v2(-125, 0);
        else if (this.localChair == 1 || this.localChair == 2 || this.localChair == 3) // Right
            newPos = cc.v2(100, 0);
        else if (this.localChair == 7) // banker
            newPos = cc.v2(115, 0);
        else                            // Top
            newPos = cc.v2(100, 0);

        return this.node.getPosition().add(newPos);
    }

    hideBet() {
        if (this.bgBet) {
            this.bgBet.active = false;
        }
    }

    showWinEffect() {
        this.winEffect.node.active = true;
        this.winEffect.animation = 'win_text';

        this.winEffectAvatar.node.active = true;
        this.winEffectAvatar.animation = 'animation';

        if (this.localChair === 0) {
            this._gameLayer.shanKoeMeeSound.playWin();
            // this._gameLayer.shanKoeMeeSound.playCompareWin();
        }
    }

    showLoseEffect() {
        let pos = this.lostEffect.getPosition();
        this.lostEffect.active = true;
        this.lostEffect.setPosition(pos.add(cc.v2(0, 60)));
        cc.tween(this.lostEffect)
            .to(0.3, { y: pos.y }, { easing: 'sineInOut' })
            // .delay(5)
            // .call(function () {
            //     this.lostEffect.active = false;
            // }.bind(this))
            .start();

        if (this.localChair === 0) {
            this._gameLayer.shanKoeMeeSound.playLose();
            // this._gameLayer.shanKoeMeeSound.playCompareLose();
        }

        this._cards.forEach(function (c) {
            c.setDarkMode(true);
        })

        this.setDarkMode(true);
        // this.color = new cc.Color(0, 0, 0, 255);
    }

    showDrawEffect() {
        let pos = this.drawEfected.getPosition();
        this.drawEfected.active = true;
        this.drawEfected.setPosition(pos.add(cc.v2(0, 60)));
        cc.tween(this.drawEfected)
            .to(0.3, { y: pos.y }, { easing: 'sineInOut' })
            .start();

        if (this.localChair === 0) {
            this._gameLayer.shanKoeMeeSound.playTie();
        }
    }

    showViewBet(bet, roomBet, disableEffect?) {
        if (disableEffect) {
            this.bgBet.active = true;
            this.lbBetAmount.string = ShanUtils.shorten(this.getBetAmount(),2);
        } else {
            let arrC = getArrChipFromMoney(bet);

            for (let i = 0; i < arrC.length; i++) {
                var chip = cc.instantiate(this.prefabChip).getComponent(Chip);
                chip.setValues(arrC[i]);
                chip.node.scale = 0.5;
                chip.node.active = true;
                chip.node.opacity = 0;
                chip.node.setPosition(this.lbMoney.node.getPosition());
                this.node.addChild(chip.node);

                var pos = this.localChair > 3 ?
                    this.bgBet.getPosition().sub(cc.v2(this.bgBet.width / 2 - 15, 0)) :
                    this.bgBet.getPosition().add(cc.v2(this.bgBet.width / 2 - 15, 0));

                chip.node.runAction(cc.sequence(
                    cc.spawn(
                        cc.moveTo(ChipGroup.TIME_FADE_CHIP, pos).easing(cc.easeOut(1)),
                        cc.fadeIn(ChipGroup.TIME_FADE_CHIP),
                    ),
                    cc.removeSelf(),
                    cc.callFunc(function () {
                        this.lbBetAmount.string = ShanUtils.shorten(this.getBetAmount(),2);
                    }.bind(this))
                ));
            }

            if (!this.bgBet.active) {
                this.bgBet.active = true;
                this.bgBet.opacity = 0;
                this.bgBet.runAction(cc.fadeIn(ChipGroup.TIME_FADE_CHIP));
            }
        }
    }

    setVisibleWatingOpenCards(boolean) {
        this.waitingOpen.active = boolean;
        this.waitingOpen.x = this._getCardStartPosX()
    }

    _showNomalHand() {
        for (let i = 0; i < this._cards.length; i++) {
            let c = this._cards[i];
            c.node.zIndex = Constant.SHANKOEMEE_CARD_BASE_Z_ORDER + i;
            var scale = c.getTargetScale() || c.scale;

            var cardStartPosX = this._getCardStartPosX();
            var offsetX = Constant.SHANKOEMEE_CARD_ON_HAND_GAP * Constant.SHANKOEMEE_CARD_DEALING_SCALE;

            if (this.localChair === 0) {
                offsetX = Constant.SHANKOEMEE_CARD_ON_HAND_GAP * Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
            }

            var newPos = cc.v2(cardStartPosX + (offsetX * i), this._getCardPos().y + Constant.SHANKOEMEE_POS_Y_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][i])

            if (c.node) {
                let toPositon = cc.v2(cardStartPosX, this._getCardPos().y)
                cc.tween(c.node)
                    .to(0.1, { angle: Constant.SHANKOEMEE_ROTATION_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][0], x: toPositon.x, y: toPositon.y })
                    .to(0.05, { scaleX: 0, scaleY: scale }, { easing: 'backOut' })
                    .call(function () {
                        c.show();
                    })
                    .to(0.05, { scale: scale }, { easing: 'backIn' })
                    .delay(0.02)
                    .to(0.1, { angle: Constant.SHANKOEMEE_ROTATION_CARD[this._cards.length - Constant.SHANKOEMEE_MIN_NUM_CARD][i], x: newPos.x, y: newPos.y })
                    .call(function () {
                        if (i == this._cards.length - 1) {
                            this.showGroupName(scale, false);
                            this.showMultiple();
                        }
                        this._updateCardRotation();
                    }.bind(this))
                    .start();
            }
        }
    }

    _showSpecicalHand() {
        for (let i = 0; i < this._cards.length; i++) {
            let c = this._cards[i];
            c.node.zIndex = Constant.SHANKOEMEE_CARD_BASE_Z_ORDER + i;
            var scale = c.getTargetScale() || c.scale;

            if (c.node) {
                cc.tween(c.node)
                    // .to(0.05, { skewX: 0, skewY: 5, scaleX: 0, scaleY: scale * 1.8 } { easing: 'backOut' })
                    .call(function () {
                        c.show();
                    })
                    .to(0.15, { skewX: 0, skewY: 0, scaleX: scale * 1.8, scaleY: scale * 1.8 }, { easing: 'backOut' })
                    .delay(0.02)
                    .to(0.15, { scale: scale }, { easing: 'backIn' })
                    .call(function () {
                        c.setTargetScale(0)
                        c.node.skewX = c.node.skewY = 0;
                        if (i == this._cards.length - 1) {
                            // this._updateCardRotation();
                            this.showGroupName(scale, true);
                            this.showMultiple();
                        }
                    }.bind(this))
                    .start();
            }
        }
    }

    setDarkMode(boolean) {
        if (boolean) {
            this.bgPointLose.active = true;
            this.lbPoint.node.color = new cc.Color(159, 159, 159, 255);
            this.avatar && (this.avatar.node.color = new cc.Color(80, 80, 80, 255));
        }
        else {
            this.bgPointLose.active = false;
            this.lbPoint.node.color = new cc.Color(139, 65, 21, 255);
            this.avatar && (this.avatar.node.color = new cc.Color(250, 212, 83, 255));
        }
    }

    showBurnBorderAnim() {
        var node = new cc.Node("New Sprite");
        var sprite = node.addComponent(cc.Sprite);
        setTextureFromRes(sprite, 'res/textures/in_light_1');
        // node.parent = this.node;

        for (let i = 0; i < 6; i++) {
            let nodeClone = cc.instantiate(node)
            this.node.addChild(nodeClone);
            cc.tween(nodeClone)
                .delay(0.1 * i)
                .to(0.3, { opacity: 0, scale: 1.5 })
                .delay(0.9)
                .to(0.3, { opacity: 255, scale: 1 })
                .removeSelf()
                .start();
        }
    }

    showAllInAnim(boolean) {
        if (this.animAllIn) {
            this.animAllIn.node.active = boolean;
            this.animAllIn.animation = 'Allin'
        }
    }

    showAMaxBetAnim(boolean) {
        if (this.animMaxBet) {
            this.animMaxBet.node.active = boolean;
            this.animMaxBet.animation = 'animation'
        }
    }

    showWaitingNewMatch(boolean) {
        this.setDarkMode(boolean);
        this.lbWaiting && (this.lbWaiting.node.active = boolean);
    }
}
