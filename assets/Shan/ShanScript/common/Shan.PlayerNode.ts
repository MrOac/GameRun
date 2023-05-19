import App from "../../../Lobby/LobbyScript/Script/common/App";
import cmd from "../Shan.Cmd";
import Card from "./Shan.Card";
import ProgressBar from "./Shan.ProgressBar";
import ShanUtils, { getAvatarPath, NumberUtils, setTextureFromRes, StringUtils } from "./Shan.Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerNode extends cc.Component {
    showComputerPlay() {
        // throw new Error("Method not implemented.");
    }
    showWaitingNewMatch(arg0: boolean) {
        // throw new Error("Method not implemented.");
    }
    showViewBet(betAmount: any, moneyBet: any, arg2?: boolean) {
        // throw new Error("Method not implemented.");
    }
    bet(betAmount: any, money: any) {
        // throw new Error("Method not implemented.");
    }
    instantlyAddCard(cards: any, arg1: boolean, uiNode: any) {
        // throw new Error("Method not implemented.");
    }
    @property
    localChair: number = -1;
    @property(cc.Label)
    lbMoney: cc.Label = null;
    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.Node)
    waitingNode: cc.Node = null;
    @property(cc.Node)
    userNode: cc.Node = null;
    @property(ProgressBar)
    timer: ProgressBar = null;
    @property(cc.Node)
    timerBar: cc.Node = null;

    @property(cc.Prefab)
    prefabPlayerInfo: cc.Prefab = null;
    @property(cc.Prefab)
    prefabCard: cc.Prefab = null;
    @property(cc.Prefab)
    prefabWinLabel: cc.Prefab = null;
    @property(cc.Prefab)
    prefabLoseLabel: cc.Prefab = null;
    @property(cc.Node)
    progressParticle: cc.Node = null;

    @property(sp.Skeleton)
    winEffect: sp.Skeleton = null;
    @property(sp.Skeleton)
    winEffectAvatar: sp.Skeleton = null;
    @property(cc.Node)
    lostEffect: cc.Node = null;
    @property(cc.Node)
    sp_icChip: cc.Node = null;
    @property(cc.Node)
    sp_register_back: cc.Node = null;
    _data: any;
    _cards: Card[];
    _cardData: any[];
    _gameLayer: any;
    _isTriggered: any;
    constructor() {
        super();
        this._data = null;

        this._cards = [];
        this._cardData = [];
    }

    setGameLayer(gameLayer) {
        this._gameLayer = gameLayer;
    }

    clean() {
        this.node.stopAllActions();

        this._cards.forEach(function (c) {
            c.stopAllActions()
            c.node.removeFromParent();
            c.setDarkMode(false);
        })
        this._cards = [];
        this._cardData = [];

        this.winEffect && (this.winEffect.node.active = false);
        this.winEffectAvatar && (this.winEffectAvatar.node.active = false);
        this.lostEffect && (this.lostEffect.active = false);
        if (this.setDarkMode) this.setDarkMode(false);
        // this.setVisibleInviteBtn(false);
    }
    setDarkMode(value: boolean) {

    }

    onLoad() {
        this.timer && (this.timer.node.active = false);

        this.winEffect && (this.winEffect.node.active = false);
        this.winEffectAvatar && (this.winEffectAvatar.node.active = false);
        this.lostEffect && (this.lostEffect.active = false);

        this.setVisibleInviteBtn(false);
    }

    updateInfo(data) {
        // cc.log('updateUserInfo', data);


        this._data = data;
        if (this._data && this._data.stateId == cmd.Code.PLAYER_STATUS_OUT_GAME) {
            // this.waitingNode.active = true;
            this.userNode.active = false;
            if (this._gameLayer.lstBgUser && this._gameLayer.lstBgUser.length > this.localChair) {
                this._gameLayer.lstBgUser[this.localChair].active = false;
            }
            return false;
        }

        // this.waitingNode.active = false;
        if (this.userNode) this.userNode.active = true;
        if (this._gameLayer.lstBgUser && this._gameLayer.lstBgUser.length > this.localChair) {
            this._gameLayer.lstBgUser[this.localChair].active = true;
        }
        if (this.lbName) {
            this.lbName.string = StringUtils.shorten(this._data.userName,12);
        }

        if (this._data.avatar)
            this.updateAvatar();

        if (this.sp_register_back) {
            this.sp_register_back.active = false;
        }
        return true
    }

    update(dt) {
        if (this.getState() == cmd.Code.PLAYER_STATUS_OUT_GAME)
            return;

        if (this.lbMoney) {
            this.lbMoney.string = NumberUtils.format(this._data.money);
            if (this.sp_icChip) {
                this.sp_icChip.x = this.lbMoney.node.x - this.lbMoney.node.width / 2 - 20;
            }
        }

        if (this.timer && this.timer.node.active) {
            var userData = this.timer.userData;
            var now = cc.sys.now();
            var delta = now - userData.startTime;
            var deltaPercent = delta / (userData.duration * 1000);
            var percentage = userData.startPercentage + (0 - userData.startPercentage) * deltaPercent;

            this.timer.progress = percentage;
            if (!this._isTriggered && percentage < 0.25)
                this._triggleAlert();

            if (this.progressParticle && percentage > 0) {
                const radius = (this.timer.node.width / 2);
                const angle = percentage * 2 * Math.PI;
                const x = -radius * Math.sin(angle);
                const y = radius * Math.cos(angle);
                this.progressParticle.setPosition(cc.v2(x, y));
                this.progressParticle.active = true;
            }
            else {
                if (this.progressParticle)
                    this.progressParticle.active = false;
            }

            if (this.timerBar && percentage < 0.25) {
                this.timerBar.color = cc.Color.RED;;
            } else if (this.timerBar && percentage < 0.5) {
                this.timerBar.color = cc.Color.YELLOW;;
            }
        }
    }

    _triggleAlert() {
    }

    updateAvatar() {
        this.avatar.spriteFrame = App.instance.getAvatarSpriteFrame(this._data.avatar)
        // setTextureFromRes(this.avatar, getAvatarPath(this._data.avatar));
    }

    getUserName() {
        return this._data.userName || ""
    }

    getState() {
        return this._data ? this._data.stateId : cmd.Code.PLAYER_STATUS_OUT_GAME;
    }

    getUserId() {
        return this._data ? this._data.userId : null;
    }

    startPlaying() {
        if (this.getState() == cmd.Code.PLAYER_STATUS_SITTING)
            this._setState(cmd.Code.PLAYER_STATUS_PLAYING);
    }

    startCountDown(time, startPercentage) {
        // cc.log('startCountDown', time, startPercentage);

        var percentage = (startPercentage || 100) / 100;
        var startColor = cc.Color.GREEN;

        this.timer.userData = {
            startTime: cc.sys.now(),
            startPercentage: percentage,
            startColor: startColor,
            duration: time * percentage
        }

        this.timer.node.active = true;
        if (this.timerBar) this.timerBar.color = startColor;
        this.timer.progress = percentage / 100;
    }

    stopCountDown() {
        this.timer.node.stopAllActions();
        this.timer.node.active = false;
        this._isTriggered = false;
    }

    updateMoney(money) {
        this._data.money = money;
    }

    getMoney() {
        return this._data.money;
    }

    getChair() {
        return this._data.chair;
    }

    _setState(value) {
        this._data.stateId = value;
    }

    setCardData(cardData) {
        this._cardData = cardData;
    }

    addCardData(card) {
        this._cardData.push(card);
    }
    removeCardData(card) {
        if (this._cardData.indexOf(card) !== -1)
            this._cardData.splice(this._cardData.indexOf(card), 1);
    }

    getCardData() {
        return this._cardData;
    }

    _addCard(card) {
        // cc.log("_addCard", card instanceof Card);
        if (!(card instanceof Card))
            return false;

        this._cards.push(card);
        return true;
    }

    addCard(card) {
        if (this._addCard(card)) {
            var newPos = this.node.getPosition().add(this._getCardPos());

            card.node.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.2, newPos),
                    cc.rotateBy(0.2, 180)
                ),
                cc.callFunc((obj, pos) => {
                    card.setPosition(newPos)
                    card.setRotation(0)
                }))
            )
        }
    }
    _getCardPos() {
        return cc.v2(0, 0)
    }

    removeCard(card) {
        var idx = this._cards.map(function (c) { return c.getId() }).indexOf(card.getId());
        // cc.log('removeCard', card, idx);
        if (idx < 0)
            return;

        var removed = this._cards.splice(idx, 1);
        return removed[0];
    }

    removeAllCards() {
        this._cards.forEach(function (c) {
            c.node.removeFromParent();
        });

        this._cards = [];
    }

    updateNumberCardLeft() {
        if (this.localChair !== 0 && this._cards.length > 0) {
            this.showCardLeft(this._cards.length);
        } else {
            this.hideCardLeft();
        }
    }
    showCardLeft(value: number) {
        
    }
    hideCardLeft() {
        
    }
    moneyChange(moneyChange, targetMoney, isSpawn = true) {
        if (this.lbMoney) {
            var str = (moneyChange > 0 ? ("+" + NumberUtils.format(moneyChange)) : NumberUtils.format(moneyChange)).toString();
            var node = cc.instantiate(moneyChange >= 0 ? this.prefabWinLabel : this.prefabLoseLabel);

            // if (this.winEffect) {
            //     (moneyChange > 0) ? (this.winEffect.node.active = true) : (this.lostEffect.active = true);
            // }
            node.zIndex = 100;
            node.setPosition(this.node.getPosition());
            this.node.parent.addChild(node);
            // this.node.addChild(node);
            var lb = node.getComponent(cc.Label);
            lb.string = str;
            node.scale = 0.45;

            let act = null;
            if (isSpawn) {
                // cc.log("Co Spawn")
                act = cc.sequence(cc.spawn(cc.moveBy(1.2, cc.v2(0, 100)), cc.fadeOut(1.4)), cc.removeSelf());
            } else {
                // cc.log("k Co Spawn")
                act = cc.sequence(cc.sequence(cc.moveBy(1.2, cc.v2(0, 100)), cc.fadeOut(1.4)), cc.removeSelf());
            }

            node.runAction(act);
        }

        if (typeof targetMoney != 'undefined') {
            this._data.money = targetMoney;
            // if (this.getUserId() == Global.user.getId())
                // Global.user.setChip(targetMoney)
        }
    }

    onAvatarClicked() {
        // return;
        // if (this._gameLayer._gameName != 'shankoemee')
        // {
            // Global.audioManager.play(this._gameLayer.audio);
        // }
        // var node = cc.instantiate(this.prefabPlayerInfo);
        // node.zIndex = 1000;
        // node.getComponent("PopupPlayerInfo").show();
        // this.node.parent.addChild(node);
        // var playerInfo = node.getComponent(PopupPlayerInfo);
        // // cc.log('onAvatarClicked', this._gameLayer);
        // playerInfo.setData(this._gameLayer, this.localChair, this.getChair(), this._data);
        // this._gameLayer.basePopUpActive = playerInfo;
        // this.avatar.getComponent(cc.Button).interactable = false;
        // this.avatar.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
        //     this.avatar.getComponent(cc.Button).interactable = true;
        // })))
    }

    setVisibleInviteBtn(visible) {
        if (this.waitingNode) {
            this.waitingNode.active = visible;
        }
    }

    vibrateAvatar() {
        let pos = this.waitingNode.getPosition();

        cc.tween(this.userNode)
            .to(0.1, { y: pos.y + 10 })
            .to(0.1, { y: pos.y })
            .start();
    }

    showRegisterBack(boolean) {
        if (this.sp_register_back) {
            this.sp_register_back.active = boolean;
        }
    }
    onInviteClicked() {
        this._gameLayer._ws.getInviteeList();
    }
}