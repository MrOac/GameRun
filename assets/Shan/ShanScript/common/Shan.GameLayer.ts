import Configs from "../../../Loading/src/Configs";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import cmd from "../Shan.Cmd";
import { DealerAction } from "../Shan.Contants";
import GameController from "../Shan.GameController";
import ShanNetworkClient from "../Shan.NetworkClient";
import TimeCountDown from "./Sham.TimeCountDown";
import PlayerNode from "./Shan.PlayerNode";
import ShanUtils, { format, NumberUtils } from "./Shan.Utils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameLayer extends cc.Component { 
    @property(cc.Node)
    lbID: cc.Node = null;
    @property(cc.Node)
    lbBet: cc.Node = null;
    @property(cc.Label)
    lbRoomInfo: cc.Label = null;
    @property(cc.Label)
    lbBetInfo: cc.Label = null;
    @property(cc.Node)
    btnLeave: cc.Node = null;
    @property(cc.Label)
    lbJackPot: cc.Label = null;
    @property(cc.Node)
    icChipJackpot: cc.Node = null;
    @property(cc.Node)
    playerPos: cc.Node[] = [];
    @property(cc.Prefab)
    playerPrefab: cc.Prefab[] = [];
    @property(TimeCountDown)
    timeCountDown: TimeCountDown = null;

    @property(cc.Prefab)
    prefabCard: cc.Prefab = null;
    @property(cc.Prefab)
    prefabItemAnim: cc.Prefab = null;
    @property(cc.Prefab)
    prefabEmoAnim: cc.Prefab = null;
    @property(cc.Prefab)
    prefabPopupMessage: cc.Prefab = null;
    @property(cc.Node)
    dealerNode: cc.Node = null;
    @property(sp.Skeleton)
    dealerAnim: sp.Skeleton = null;
    @property(cc.Prefab)
    prefabChip: cc.Prefab = null;

    @property(cc.Prefab)
    prefabSetting: cc.Prefab = null;
    @property(cc.Prefab)
    prefabInteractDealer: cc.Prefab = null
    @property(cc.Prefab)
    chatNodePrefab: cc.Prefab = null
    @property(cc.Prefab)
    prefabGetChip: cc.Prefab = null
    @property(cc.Prefab)
    prefabInvite: cc.Prefab = null
    // cheatNode: CheatNode,
    @property(cc.AudioClip)
    audio: cc.AudioClip = null;

    
    _userIdToChairMapping:any = {};
    MAX_PLAYER: number;
    _roomData: any;
    _ownChair: number;
    playerNodes: any[];
    _chatNode: any;
    uiNode: any;
    basePopUpActive: any;
    _userAction: boolean;
    _jackpotValue: number;
    _isDealerAction: boolean;
    _ws: ShanNetworkClient;
    _eventTarget: any;
    _user: typeof Configs.Login;
    _inviteLayer: any;
    _gameName: any;

    constructor() {
        super();
        this._userIdToChairMapping = {};
        this.MAX_PLAYER = 4;
        this._roomData = null;
        this._ownChair = 0;
        this.playerNodes = [];
        this._chatNode = null;
        this.uiNode = null;
        this.basePopUpActive = null;
        this._userAction = false;

        this._jackpotValue = 0;

        this._isDealerAction = false;
       
    }

    onLoad () {
        // cc.log("GameLayer onLoad");
        this.initNodeWithPrefab();
        this.timeCountDown && (this.timeCountDown.node.zIndex = 999);

        this.uiNode = new cc.Node();
        this.node.addChild(this.uiNode);
        this.uiNode.zIndex = 2;

        // Global.SystemNotify.setPositionState('ingame');
    }

    start () {
        let self = this;
        setTimeout(function () {
            for (var i = 0; i < self.playerPos.length; i++) {
                self.playerNodes[i].node.setPosition(self.playerPos[i].getPosition());
                self.playerNodes[i].node.opacity = 255;
                self.playerPos[i].destroy();
            }
            self.playerPos = [];
        }, 50);

        this.schedule(() => {
            if (!this._isDealerAction) {
                this.dealerAction("Idle")
            }
        }, 8);
    }

    initNodeWithPrefab () {
        this.playerNodes = [];
        // cc.log("initNodeWithPrefab", this.playerPos.length);
        for (var i = 0; i < this.playerPos.length; i++) {
            var node = this._createNodeFromPrefab(this.playerPrefab[i]);
            node.setPosition(this.playerPos[i].getPosition());
            node.scale = this.playerPos[i].scale;
            node.angle = this.playerPos[i].angle;
            node.opacity = 0;
            node.zIndex = 2;
            var player = node.getComponent(PlayerNode);
            player.localChair = i;
            player.setGameLayer(this);
            this.playerNodes.push(player);
            // this.playerPos[i].destroy();
            this.playerPos[i].opacity = 0;
        }
        // this.playerPos = [];
    }

    init (ws, target) {
        this._ws = ws;
        this._eventTarget = target;
        this._user = Configs.Login;

        // this.cheatNode && (this.cheatNode.node.active = CURRENT_GAME_MODE != GAME_MODE.PROD) && this.cheatNode.init(this.playerNodes, ws);
    }

    _createNodeFromPrefab (prefab: cc.Prefab, zIndex?: number) {
        var node = cc.instantiate(prefab);
        this.node.addChild(node);
        zIndex && (node.zIndex = zIndex);
        return node;
    }

    _updateRoomOwner () {
    }

    _getLocalChair (chair) {
        return (chair - this._ownChair + this.MAX_PLAYER) % this.MAX_PLAYER
    }

    _onRoomInvite () {
        // this._inviteLayer = new InviteLayer(this, this.getContentSize(), this._ws);
        // this.addChild(this._inviteLayer, 100);
    }

    _onShowUserInfo (userId) {
        // for (var i = 0; i < this.getChildrenCount(); i++)
        //     if (this.getChildren()[i] instanceof UserInfoLayer)
        //         return;

        // var couldKickOther = this._roomData.roomOwnerId == this._user.getId() && userId != this._user.getId();
        // this.addChild(new UserInfoLayer(this.getContentSize(), this._ws, couldKickOther, userId));
    }
    getChildrenCount() {
        return 0;
    }


    onInviteLayerClosed () {
        this._inviteLayer = null;
    }

    onBtnSettingClicked () {

    }

    showChatLayer (tabIdx) {
        // cc.log("showChatLayer");
        // ChatLayer.show(this, this._ws, tabIdx)
    }

    showShop() {
        // var popupGetChip = cc.instantiate(this.prefabGetChip);
        // this.node.addChild(popupGetChip);
        // popupGetChip.zIndex = 9999;
        // popupGetChip.getComponent('GetChips').show();
        // popupGetChip.getComponent('GetChips').initWs(Global.socketManager.getLobbyWS());
    }

    _updatePlayerNodes () {
        for (var i = 0; i < this._roomData.playerList.length; i++) {
            var d = this._roomData.playerList[i];
            var localChair = this._getLocalChair(d.chair);
            this._userIdToChairMapping[d.userId] = localChair;
            this.playerNodes[localChair].updateInfo(d);
        }
    }

    _updateRoomData () {
        // find own chair
        this._ownChair = this._roomData.playerList.filter(function (p) { return p.userId == this._user.UserId }.bind(this))[0].chair;

        this._updatePlayerNodes();
        this._updateRoomOwner();

        var strRoomInfo = this._roomData.roomId;
        this.lbRoomInfo.string = strRoomInfo;
        var strBetInfo = NumberUtils.format(this._roomData.moneyBet);
        this.lbBetInfo.string = strBetInfo;

        // var x = Math.max(this.lbID.x + this.lbID.getBoundingBox().width, this.lbBet.x + this.lbBet.getBoundingBox().width);
        // this.lbRoomInfo.node.x = x;
        // this.lbBetInfo.node.x = x;
    }

    _removePlayer (data, playerList) {
        var localChair = this._userIdToChairMapping[data.userId];
        var playerList = this._roomData.playerList;
        var player = playerList.filter(function (p) { return p.userId == data.userId })[0];

        if (!player) {
            return cc.log("WARNING: Player Not Found - " + data.userId, playerList);
        }

        var chair = player.chair;

        var d = {
            chair: chair,
            stateId: cmd.Code.PLAYER_STATUS_OUT_GAME,
        };

        playerList[chair] = d;
        this._roomData.playerList = playerList;
        this._roomData.numPlayer -= 1;

        if (this.playerNodes[localChair]) {
            let success = this.playerNodes[localChair].updateInfo(d);
        }

        delete this._userIdToChairMapping[data.userId];

        this._updateRoomOwner();
    }

    _userCouldLeaveRoom (data) {
        var localChair = this._userIdToChairMapping[data.userId];
        if (isNaN(localChair))
            return;

        return true
    }

    _showMsgIngame (msg) {
        // Global.SystemNotify.showMsgDropDown(msg);
    }

    onBtnBackClicked () {
        this._ws.leaveRoom();
    }

    onWsRoomStartCountdown (seconds) {
        // cc.log("start count down", seconds);
        this.timeCountDown && this.timeCountDown.show('start_countdown', seconds);
    }

    onWsRoomInfo (data) {
        // cc.log(data)

        this._roomData = data;
        // if (this._gameName == 'tienlen') {
        //     this.MAX_PLAYER = data.maxPlayer;
        // }

        this._updateRoomData();
        App.instance.showLoading(false);
    }

    onWsLeaveRoom (data) {
        // cc.log('onWsLeaveRoom', data);

        //TODO//
        if (data.userId == this._user.Nickname) {
            // Global.audioManager.replayMusic();
            this._eventTarget._onGameLeave.call(this._eventTarget);
            this.node.removeFromParent();
        } else {
            if (!this._userCouldLeaveRoom(data)) {
                return
            }

            // Other player left
            if (this._roomData.roomOwnerId != data.roomOwnerId) {
                // Room Owner left
                this._roomData.roomOwnerId = data.roomOwnerId;
            }

            var playerList = this._roomData.playerList;
            var player = playerList.filter(function (p) { return p.userId == data.userId })[0];

            if (player) {
                this._removePlayer(data, playerList)
            }
        }
    }

    onReMatchClick() {
        this.onBtnBackClicked();

        this._eventTarget._registerRematch ? this._eventTarget._registerRematch = false : this._eventTarget._registerRematch = true;
        // cc.log('onReMatchClick', this._eventTarget._registerRematch)
    }

    onWsRegisterLeaveRoom (data) {
        //TODO: add icon leaveRoom
        // onWsRegisterLeaveRoom {userId: 100003, isRegister: false}

        // cc.log('onWsRegisterLeaveRoom', data);
        // TODO: 
        if (data.userId == this._user.Nickname) {
            App.instance.showLoading(false)
            this.btnLeave.color = data.isRegister ? cc.Color.GRAY : cc.Color.WHITE;

            if (data.isRegister) {
                this._showMsgIngame("Register back");
            }
            else {
                this._showMsgIngame("Unrigister back");
            }
        }

        var localChair = this._userIdToChairMapping[data.userId];
        if (localChair >= 0 && localChair < this.playerNodes.length) {
            this.playerNodes[localChair].showRegisterBack(data.isRegister);
        }
    }

    onWsJoinRoomOther (data) {
        // cc.log('onWsJoinRoomOther', JSON.stringify(data));
        // cc.log('onWsJoinRoomOther', JSON.stringify(this._roomData));

        var playerList = this._roomData.playerList;

        var idx = -1;
        for (var i = 0; i < playerList.length; i++)
            if (playerList[i].chair == data.chair) {
                idx = i;
                break;
            }

        idx = idx >= 0 ? idx : playerList.length;
        playerList[idx] = data;
        this._roomData.playerList = playerList;

        var localChair = this._getLocalChair(data.chair);

        this.playerNodes[localChair].updateInfo(data);
        this._userIdToChairMapping[data.userId] = localChair;
    }

    onWsGetInviteeList (list) {
        // cc.log("onWsGetInviteeList:", list);
        let node = cc.instantiate(this.prefabInvite);
        this.node.addChild(node);
        node.zIndex = 9998;
        this._inviteLayer = node.getComponent('InviteList');
        this._inviteLayer.init(this._ws);
        this._inviteLayer.show();
        this._inviteLayer.onWsGetInviteeList(list);
    }

    onWsGetJackpot (data) {
        // cc.log('onWsGetJackpot', data);
        let oldValue = this._jackpotValue;
        this._jackpotValue = data.chip;

        if (this.lbJackPot) {
            let count = 0;
            this.schedule(function () {
                // cc.log('onWsGetJackpot', count, this._jackpotValue, oldValue, Math.floor(oldValue + count * (this._jackpotValue - oldValue) / 100))
                this.lbJackPot.string = NumberUtils.format(Math.floor(oldValue + count++ * (this._jackpotValue - oldValue) / 100));
                if (this.icChipJackpot) this.icChipJackpot.x = this.lbJackPot.node.x - this.lbJackPot.node.width / 2 - 15;
            }, 0.01, 100, 0.0001);
        }
    }

    onWsBoomJackpot (data) {
        // cc.log('onWsBoomJackpot ', data)
        // this.addChild(new BoomJackpotLayer(this.getContentSize(), data.amount), ZORDER_BOOM_JACKPOT);
        // this._user = data.balance;
    }

    onWsChat (data) {
        // cc.log('onWsChat', data);

        var localChair = this._userIdToChairMapping[data.userId];

        if (cc.js.isNumber(localChair)) {
            var userName = this.playerNodes[localChair]._data.userName;
            // this.playerNodes[localChair].showSpeechBubble(data.content);
            // cc.log(this.playerNodes[localChair]._data)
            data.username = userName;

            if (this._chatNode) {
                let dataChat = JSON.parse(data.content);
                if (dataChat.type == 'quick') {
                    this._chatNode.onNewQuickChat(userName, dataChat.content)
                    this._showUserMessage(localChair, `chat.quick_chat.${this._gameName}.${dataChat.content}`)
                }
                else if (dataChat.type == 'text') {
                    this._chatNode.onNewTextChat(userName, dataChat.content)
                    this._showUserMessage(localChair, dataChat.content)
                }
                else if (dataChat.type == 'emo') {
                    this._showUserEmoMessage(localChair, dataChat.content)
                }
            }
        }
    }

    _showUserMessage(localChair, msStr) {
        var popupMessage = cc.instantiate(this.prefabPopupMessage);
        this.node.addChild(popupMessage);
        popupMessage.zIndex = 9999;

        popupMessage.getComponent('PopupMessage').show(msStr);
        // popupMessage.setAnchorPoint(cc.v2(0.3, 0))
        popupMessage.setPosition(this.playerNodes[localChair].node.getPosition().add(cc.v2(0, 100)));

        if (popupMessage.y + popupMessage.height / 2 > this.node.height / 2) {
            popupMessage.y = this.node.height / 2 - popupMessage.height / 2 - 10;
        }

        if (popupMessage.x + popupMessage.width / 2 > this.node.width / 2) {
            popupMessage.x = this.node.width / 2 - popupMessage.width / 2 - 10;
        }

        if (popupMessage.x - popupMessage.width / 2 < -this.node.width / 2) {
            popupMessage.x = -this.node.width / 2 + popupMessage.width / 2 + 10;
        }
    }

    _showUserEmoMessage(localChair, msStr) {
        let emoAnim = cc.instantiate(this.prefabEmoAnim);
        this.playerNodes[localChair].node.addChild(emoAnim);
        emoAnim.getComponent('EmotionAnim').show(msStr, 2);
    }

    onWsEmoChat (data) {
        var localChair = this._userIdToChairMapping[data.userId];
        // this.playerNodes[localChair].showEmo(data.emoId);
    }

    onWsRoomStopCountDown () {
        this.timeCountDown && (this.timeCountDown.node.active = false);
    }

    onWsgameInteract (data) {
        // cc.log('onWsgameInteract', data);

        var itemConfig = this.getItem(data.itemId);

        if (data.targetChair == -1 || data.targetChair == 255) {
            for (var i = 0; i < this.playerNodes.length; i++) {
                this.throwItemTo(this._getLocalChair(data.fromChair), i, itemConfig);
            }
        } else if (data.targetChair == -2 || data.targetChair == 254) {
            this.throwItemTo(this._getLocalChair(data.fromChair), -2, itemConfig);

            if ([2, 4, 5].includes(data.itemId)) {
                this.dealerAction('Fun', 1);
            }
            else {
                this.dealerAction('Angry', 1);
            }
        } else {
            this.throwItemTo(this._getLocalChair(data.fromChair), this._getLocalChair(data.targetChair), itemConfig);
        }
    }

    onWsReceiveJackpotWinners (data) {
        // cc.log('onWsReceiveJackpotWinners', data);
    }

    throwItemTo (fromLocalChair, localChair, itemConfig) {
        if (localChair == -2 || localChair == 254) {
            this.throwItem(this.playerNodes[fromLocalChair].node.getPosition(), this.dealerNode.getPosition().add(cc.v2(0, 80)), itemConfig);
        } else if (this.playerNodes[localChair].getState() === cmd.Code.PLAYER_STATUS_OUT_GAME || fromLocalChair == localChair) {
            return;
        }
        else {
            this.throwItem(this.playerNodes[fromLocalChair].node.getPosition(), this.playerNodes[localChair].node.getPosition(), itemConfig);
        }
    }

    throwItem (start, des, itemConfig) {
        var node = cc.instantiate(this.prefabItemAnim);
        this.node.addChild(node);
        node.setPosition(start);
        node.zIndex = 30;
        // cc.log("Throw Item")
        // var item = node.getComponent(InteractItemAnim);
        // item.setSprite(itemConfig.imgPath);
        // item.runAnim(itemConfig, start, des);
    }

    getItem (id) {
        let items = []
        for (var i = 0; i < 7; i++) {
            items.push({
                id: i + 1,
                imgPath: "interact/expression_icon-" + (i + 1),
            })
        }

        for (var i = 0, size = items.length; i < size; i++) {
            if (items[i].id == id) {
                return items[i];
            }
        }
        return null;
    }

    onWsgameTip (data) {
        // cc.log('onWsgameTip', data);

        if (data.amount > 0) {
            let chipNode = cc.instantiate(this.prefabChip);
            this.node.addChild(chipNode);
            chipNode.scale = 0.8;
            chipNode.getComponent("Chip").setValue(null, NumberUtils.format(data.amount));
            chipNode.setPosition(this.playerNodes[this._getLocalChair(data.chair)].node.getPosition());
            chipNode.getComponent("Chip").updateChipTexture(data.amount);
            let tmpPos = this.dealerNode.getPosition().add(cc.v2(0, 50))
            cc.tween(chipNode)
                .to(0.5, { x: tmpPos.x, y: tmpPos.y, rotation: 360 }, { easing: 'quintOut' })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    this.dealerAction('Heart', 0.1)
                    let arr = [2, 4, 5]; // item fun
                    let itemConfig = this.getItem(arr[Math.floor(Math.random() * 3)]); // item hon gio
                    this.throwItem(this.dealerNode.getPosition().add(cc.v2(0, 80)), this.playerNodes[this._getLocalChair(data.chair)].node.getPosition(), itemConfig);
                })
                .removeSelf()
                .start();

            if (this._chatNode) {
                this._chatNode.notifyTipDealer(this.playerNodes[this._getLocalChair(data.chair)].getUserName(), NumberUtils.format(data.amount))
            }

            var localChair = this._userIdToChairMapping[data.userId];
            this.playerNodes[localChair].updateMoney(data.balance);
            // Global.user.setChip(data.balance);
        }
    }

    onWsSetCheat (data) {
        // this.cheatNode.setCheat(data.isCheat);
    }

    clean () {
        this.node.stopAllActions();
        this.playerNodes.forEach(function (p) { p.clean() });
        this.uiNode.removeAllChildren();
        this._userAction = false;
    }

    onTipDealerClick() {
        // cc.log('onTipDealerClick');
        this._userAction = true;

        if (ShanUtils.getChip() > 2 * this._roomData.moneyBet) {
            // this._ws.tip();
        }
    }

    onDealerClick () {
        var node = cc.instantiate(this.prefabInteractDealer);
        node.zIndex = 999;
        this.node.addChild(node);
        var interactDealer = node.getComponent('InteractDealer');

        interactDealer.setData(this);
        this.basePopUpActive = interactDealer;
    }

    dealerAction(key, delay?: number) {
        delay = delay || 0;
        return false;
        this._isDealerAction = true;
        if (this.dealerNode && this.dealerAnim) {
            cc.tween(this.dealerNode)
                .delay(delay)
                .call(() => {
                    switch (key) {
                        case 'Idle':
                            this.dealerAnim.animation = 'Idle';
                            break;
                        case 'Heart':
                            this.dealerAnim.animation = 'thatim';
                            break;
                        case 'Deal':
                            this.dealerAnim.animation = 'Chiabai';
                            break;
                        case 'Fun':
                            this.dealerAnim.animation = `vui` + (Math.floor(Math.random() * 3) + 1);
                            break;
                        case 'Angry':
                            this.dealerAnim.animation = `tucgian` + (Math.floor(Math.random() * 3) + 1);
                            break;
                        default:
                            break;
                    }
                })
                .delay(3)
                .call(() => { this._isDealerAction = false; })
                .start();
        }
    }

    onBtnShowEmoClick() {
        this._chatNode.showEmoNode();
    }

    onBtnShowQuickChatClick() {
        this._chatNode.showQuickChatNode();
        // this._chatNode.onShowFullNode();
    }
}