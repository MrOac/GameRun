import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import SettingInGame from "./common/Shan.SettingInGame";
import Card from "./common/Shan.Card";
import Chip from "./common/Shan.Chip";
import ChipGroup from "./common/Shan.ChipGroup";
import GameLayer from "./common/Shan.GameLayer";
import Pot from "./common/Shan.Pot";
import ShanUtils from "./common/Shan.Utils";
import Alert from "./Model/Shan.Alert";
import Jackpot from "./Model/Shan.Jackpot";
import BankerPlayingNode from "./Shan.BankerPlayingNode";
import cmd from "./Shan.Cmd";
import { ConnectionState, Constant } from "./Shan.Contants";
import { NodeNanBai } from "./Shan.NanBai";
import PlayingNode from "./Shan.PlayingNode";
import Sound from "./Shan.Sound";
import ShanNetworkClient from "./Shan.NetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import App from "../../Lobby/LobbyScript/Script/common/App";
import ShanRoom from "./Shan.Room";
import Player from "./Shan.Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends GameLayer {
    static instance: GameController = null;
    @property(cc.Prefab)
    playingNodePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bankerPlayingNodePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    ShanKoeMeeJackpotPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    nanBaiLayerPrefab: cc.Prefab = null;
    @property(Pot)
    pot: Pot = null;
    @property(ChipGroup)
    chipGroup: ChipGroup = null;
    @property(cc.Prefab)
    bankerWin: cc.Prefab = null;
    @property(cc.Node)
    bgWarningCount: cc.Node = null;
    @property(cc.Label)
    lbWarningCount: cc.Label = null;
    @property(Sound)
    shanKoeMeeSound: Sound = null;

    @property(cc.Prefab)
    prefabJackPotBig: cc.Prefab = null;
    @property(cc.Prefab)
    prefabJackPotSmall: cc.Prefab = null;
    @property(cc.Prefab)
    prefabShanAlert: cc.Prefab = null;

    @property(cc.Node)
    lstBgUser: cc.Node[] = [];
    @property(cc.Sprite)
    lstSpMutil: cc.Sprite[] = [];
    @property(cc.Node)
    lstWaitingOpen: cc.Node[] = [];
    @property(cc.Node)
    lstPointNode: cc.Node[] = [];

    @property(cc.Node)
    lstBgPoint: cc.Node[] = [];
    @property(cc.Node)
    lstBgPointLose: cc.Node[] = [];
    @property(sp.Skeleton)
    lstBgShan8: sp.Skeleton[] = [];
    @property(sp.Skeleton)
    lstBgShan9: sp.Skeleton[] = [];
    @property(sp.Skeleton)
    lstBgShanSap: sp.Skeleton[] = [];
    @property(cc.Label)
    lstBbPoint: cc.Label[] = [];

    MAX_PLAYER: number;
    _chips: any[];
    playingNode: PlayingNode;
    shanKoeMeeJackpot: Jackpot;
    bankerPlayingNode: BankerPlayingNode;
    nanBaiLayer: NodeNanBai;
    private _sound: any;
    private _delayForJackPotWin: number;
    _chipNode: cc.Node;
    _settingNode: SettingInGame;
    bankerChair: any;
    bankerPot: any;
    isBanker: any;
    _dontHandleDisconnected: boolean;


    constructor() {
        super();
        this.MAX_PLAYER = Constant.SHANKOEMEE_MAX_PLAYER;
        this._chips = [];
        this.playingNode = null;
        this.shanKoeMeeJackpot = null;
        this.bankerPlayingNode = null;
        this.nanBaiLayer = null;

        this._sound = null;
        this._delayForJackPotWin = 0;
        
    }

    onLoad() {
        super.onLoad();
        GameController.instance = this;
        // this.initNodeWithPrefab();
        // this.timeCountDown && (this.timeCountDown.node.zIndex = 999);

        // this.uiNode = new cc.Node();
        // this.node.addChild(this.uiNode);
        // this.uiNode.zIndex = 2;

        // Global.SystemNotify.setPositionState('ingame');
        // this._super();
        this._gameName = 'shankoemee';

        this.pot.setValue(0);
        this.playingNode.node.active = false;
        // this.playingNode.setActive(false);
        this.bankerPlayingNode.node.active = false;
        // this.bankerPlayingNode.setActive(false);
        this.nanBaiLayer.node.active = false;
        this.bgWarningCount.active = false;
        this.bgWarningCount.zIndex = Constant.SHANKOEMEE_ALERT_Z_INDEX;
        this.timeCountDown.node.zIndex = Constant.SHANKOEMEE_ALERT_Z_INDEX;
        this.chipGroup.node.zIndex = Constant.SHANKOEMEE_CHIPNODE_Z_INDEX;

        this._chipNode = new cc.Node();
        this.node.addChild(this._chipNode);

        // if (CURRENT_GAME_MODE != GAME_MODE.PROD) {
        //     cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // }
    }

    initPlayerNodeWithPrefab() {
        // cc.log("initPlayerNodeWithPrefab", this.playerNodes.length);
        for (var i = 0; i < this.playerNodes.length; i++) {
            var player = this.playerNodes[i];

            if (this.lstBgUser.length > i) {
                this.lstBgUser[i].setPosition(this.playerPos[i].getPosition())
            }

            if (this.lstSpMutil.length > i) {
                player.multiple = this.lstSpMutil[i];
                this.lstSpMutil[i].node.zIndex = Constant.SHANKOEMEE_MUTILPLE_Z_INDEX
            }
            if (this.lstWaitingOpen.length > i) {
                player.waitingOpen = this.lstWaitingOpen[i]
                this.lstWaitingOpen[i].zIndex = Constant.SHANKOEMEE_WAITOPEN_Z_INDEX
            }
            if (this.lstPointNode.length > i) {
                this.lstPointNode[i].zIndex = Constant.SHANKOEMEE_POINTNODE_Z_INDEX;
            }
            if (this.lstBgPoint.length > i) {
                player.bgPoint = this.lstBgPoint[i]
            }
            if (this.lstBgPointLose.length > i) {
                player.bgPointLose = this.lstBgPointLose[i]
            }
            if (this.lstBgShan8.length > i) {
                player.bgShan8 = this.lstBgShan8[i]
            }
            if (this.lstBgShan9.length > i) {
                player.bgShan9 = this.lstBgShan9[i]
            }
            if (this.lstBgShanSap.length > i) {
                player.bgShanSap = this.lstBgShanSap[i]
            }
            if (this.lstBbPoint.length > i) {
                player.lbPoint = this.lstBbPoint[i]
            }
        }

        // cc.log(this.playerNodes);
    }

    initNodeWithPrefab() {
        super.initNodeWithPrefab();
        this._settingNode = this._createNodeFromPrefab(this.prefabSetting, 1000).getComponent(SettingInGame);
        // this._chatNode = this._createNodeFromPrefab(this.chatNodePrefab, 1000).getComponent(ChatInGame);
        this.playingNode = this._createNodeFromPrefab(this.playingNodePrefab, 1000).getComponent(PlayingNode);
        this.shanKoeMeeJackpot = this._createNodeFromPrefab(this.ShanKoeMeeJackpotPrefab, 1000).getComponent(Jackpot);
        this.nanBaiLayer = this._createNodeFromPrefab(this.nanBaiLayerPrefab, 1000).getComponent(NodeNanBai);
        this.bankerPlayingNode = this._createNodeFromPrefab(this.bankerPlayingNodePrefab, 1000).getComponent(BankerPlayingNode);
        this.initPlayerNodeWithPrefab();
    }

    init(ws, target) {
        super.init(ws, target);
        this.bankerPlayingNode.init(ws);
        this.nanBaiLayer.setWs(ws);
        this.shanKoeMeeJackpot.initWs(ws);
        this.nanBaiLayer.setGameLayer(this);
        this._settingNode.init(ws, this);
        // this._chatNode.init(ws, this, 'shankoemee', Constant.SHANKOEMEE_QUICK_CHAT_SIZE)

        // this._ws.getJackPot();
        // this.schedule(() => {
        //     this._ws.getJackPot();
        // }, 5)

        // this._chatNode.init(ws);
        this.initListener();
    }
    initListener() {
        ShanNetworkClient.getInstance().addListener((data) => {
            if (this._ws.getState() != ConnectionState.CONNECTED) {
                return true;
            }
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    {
                        // cc.log("<<<< Login <<<<")
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedLogin(data);
                        let failError = res.getError();
                        if (failError == 0) {
                            this.onWsLoggedIn(true)
                        } else {
                            // cc.log("login fail");
                        }
                    }

                    break;

                case cmd.Code.START_GAME:
                    {
                        App.instance.showLoading(false);
                        // cc.log("<<<< Start Game <<<<")
                        let res = new cmd.ReceivedMatchStart(data);
                        this.onWsMatchStart(res.data);
                    }
                    break;
                case cmd.Code.START_PHASE_ONE:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedStartPhaseOne(data);
                        // cc.log("Receive phase one ")
                        this.onWsStartPhaseOne(res.data);

                    }
                    break;
                case cmd.Code.START_PHASE_TWO:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedStartPhaseTwo(data)
                        this.onWsStartPhaseTwo(res.data);
                    }

                    break;
                case cmd.Code.SEEN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedSeen(data);
                        this.onWsSeen(res.data);
                    }
                    break;
                case cmd.Code.BETTING:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedBet(data);
                        this.onWsBet(res.getError(), res.data);
                    }
                    break;
                case cmd.Code.DRAW:
                    {

                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedDrawCard(data)
                        this.onWsDrawCard(res.getError(), res.data);;

                    }
                    break;
                case cmd.Code.COMPARE:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedCompare(data);
                        this.onWsCompare(res.data);
                    }
                    break;
                case cmd.Code.BANKER_WIN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedBankerWin(data);
                        this.onWsBankerWin(res.data);
                    }
                    break;
                case cmd.Code.MATCH_INFO:
                    {
                        // App.instance.showLoading(false);
                        // let res = new cmd.ReceivedMatchInfo(data);
                        // cc.log("Match info ", JSON.stringify(res.data));
                    }
                    break;
                case cmd.Code.END_GAME:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedMatchEnd(data)
                        this.onWsMatchEnd(res.data);
                    }
                    break;
                case cmd.Code.FINISH:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedMatchFinish(data);
                        this.onWsMatchFinish(res.data);

                    }
                    break;
                case cmd.Code.ROOM_START_COUNTDOWN:
                    {
                        // cc.log("Start count down ");
                        let res = new cmd.ReceivedRoomStartCountDown(data);
                        this.onWsRoomStartCountdown(res.data.seconds);
                    }
                    break;
                case cmd.Code.ROOM_STOP_COUNTDOWN:
                    {
                        // cc.log("Stop Count down")
                        this.onWsRoomStopCountDown();
                    }
                    break;
                case cmd.Code.ROOM_REGISTER_LEAVE:
                    {
                        let res = new cmd.CmdReceivedRegisterLeave(data)
                        this.onWsRegisterLeaveRoom(res.data);
                    }
                    break;
                case cmd.Code.CHEAT_CARDS:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.DANG_KY_CHOI_TIEP:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.UPDATE_OWNER_ROOM:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.LEAVE_GAME:
                    {
                        // cc.log("Leave Game")
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedRoomLeaving(data);
                        this.onWsLeaveRoom(res.data)
                        // if (this._getLocalChair(res.chair) == 0) {
                        //     // Global.audioManager.replayMusic();
                        //     ShanUtils.setChip(this.playerNodes[0]._data.money);
                        //     this._eventTarget._onGameLeave.call(this._eventTarget);
                        //     this.node.removeFromParent();
                        //     ShanRoom.instance.node.active = true;
                        // } else {
                        //     // if (!this._userCouldLeaveRoom(data)) {
                        //     //     return
                        //     // }
                
                        //     var localChair = this._getLocalChair[res.chair];
                        //     if (localChair == this._getLocalChair(this.bankerChair)) {
                        //         if (this.playerNodes[localChair].getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
                        //             this._showComputerPlayForBanker();
                        //             return;
                        //         }
                        //         else {
                        //             this.chipGroup.reset();
                        //             this.pot.setValue(0);
                        //         }
                        //     }
                
                        //     // // Other player left
                        //     // if (this._roomData.roomOwnerId != data.roomOwnerId) {
                        //     //     // Room Owner left
                        //     //     this._roomData.roomOwnerId = data.roomOwnerId;
                        //     // }
                
                        //     var playerList = this._roomData.playerList;
                        //     var player = playerList.filter(function (p) { return p.chair == res.chair })[0];
                
                        //     if (player) {
                        //         let tmpData = {
                        //             userName: this.playerNodes[localChair]._data.userName,
                        //         }
                        //         this._removePlayer(tmpData, playerList)
                        //         // this._chatNode.notifyUserExit(player.userName);
                        //     }
                        // }
                       
                    }
                    break;
                case cmd.Code.NOTIFY_KICK_FROM_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedKickOff(data);
                    }
                    break;
                case cmd.Code.NEW_USER_JOIN:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceivedUserJoinRoom(data);
                        // cc.log("<<<< New user join <<<< ", JSON.stringify(res))
                        // let info = res["info"];
                        // let uChair = res["uChair"];
                        // let uStatus = res["uStatus"];

                        // // set State of Seat : Yes | No exist Player
                        // for (let index = 0; index < configPlayer.length; index++) {
                        //     var seatId = configPlayer[index].seatId;
                        //     let player = this.getPlayerHouse(seatId);
                        //     if (configPlayer[index].playerPos == uChair) {
                        //         // Exist player -> Set Player Info

                        //         player.resetPlayerInfo();
                        //         var customPlayerInfo = {
                        //             "avatar": info["avatar"],
                        //             "nickName": info["nickName"],
                        //             "money": info["money"],
                        //         }

                        //         this.setupSeatPlayer(seatId, customPlayerInfo);

                        //         if (uStatus == cmd.Code.PLAYER_STATUS_VIEWER) {
                        //             configPlayer[seatId].isViewer = true;
                        //             player.setIsViewer(true);
                        //             player.playFxViewer();
                        //         } else {
                        //             configPlayer[seatId].isViewer = false;
                        //             player.setIsViewer(false);
                        //         }
                        //     }
                        // }
                    }
                    break;
                case cmd.Code.NOTIFY_USER_GET_JACKPOT:
                    {
                        App.instance.showLoading(false);
                    }
                    break;
                default:
                    //           cc.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);
    }
    refeshListRoom() {
        // this.contentListRooms.removeAllChildren(true);
        ShanNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }
    onWsLoggedIn(succeed: boolean, msg?: any) {
        if (!succeed) {
            this._dontHandleDisconnected = true;
            this._ws.disconnect();
            // this._showDisconnectDialog(msg || i18n.t("connect_not_succeed"));
        }
        else {
            // Global.socketManager.gameWsSendPing(this._name);

            // this._ws.sendGetRoomConfig();
            this.refeshListRoom();
            ShanNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
        }
    }
    _updateRoomData() {
        super._updateRoomData();

        this.playerNodes.forEach(function (playerNode) {
            playerNode.setBaseBetAmount(this._roomData.moneyBet)
        }.bind(this));

        this.chipGroup.initChip(this, this._roomData.moneyBet);
    }

    _showComputerPlayForBanker() {
        this.playerNodes[this._getLocalChair(this.bankerChair)].showComputerPlay();
    }

    onWsRoomStartCountdown(seconds) {
        // cc.log("start count down", seconds);
        this.timeCountDown && this.timeCountDown.show('start_countdown', seconds);

        this.shanKoeMeeSound.playStart();
    }

    onGameBet(countDownTime, bankerChair, bankerPot, moneyAddToPot, warningCount) {
        // cc.log('onGameBet', countDownTime, bankerChair, bankerPot, moneyAddToPot, warningCount);

        let self = this;
        this.changeBankerChair(bankerChair);
        let timeW = this.updateWarningCount(warningCount);
        this.bankerPot = bankerPot;

        cc.tween(this.bgWarningCount)
            .delay(timeW)
            .call(() => {
                self.timeCountDown.show("bet_time", countDownTime - timeW);
            })
            .start();

        if (moneyAddToPot > 0) {
            this.chipGroup.playerBet(this.playerNodes[this._getLocalChair(bankerChair)], moneyAddToPot, true);
        } else {
            this.chipGroup.fixChipGroup(bankerPot);
        }
        this.pot.setValue(bankerPot);
        // this.playingNode.node.active = this._getLocalChair(bankerChair) != 0;
        this.playingNode.setActive(this._getLocalChair(bankerChair) != 0 && this.playerNodes[0].getState() == cmd.Code.PLAYER_STATUS_PLAYING);
        if (this.playingNode.node.active) {
            this.playingNode.setData(this._ws, this.bankerPot, this._roomData.moneyBet);
        }

        // this._chatNode.onShowMiniNode();
        if (this.basePopUpActive && this.bankerChair != 0) {
            this.basePopUpActive.onClose();
        }

        this.shanKoeMeeSound.playBetTime();
    }

    onGamePhaseOne(data) {
        // cc.log('onGamePhaseOne ', data);
        // this._chatNode.onShowMiniNode();

        // this.playingNode.node.active = false;
        this.playingNode.setActive(false);
        this.playerNodes[0].setCardData(data.cards);

        for (var i = 0; i < data.playerList.length; i++) {
            var playerData = data.playerList[i];
            var player = this.playerNodes[this._getLocalChair(playerData.chair)];
            if (player.getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
                if (!player.bgBet.active && playerData.bet > 0) {
                    player.bet(playerData.bet, playerData.remain);
                    if (this._getLocalChair(playerData.chair) == 0) {
                        this.playingNode.setLastBet(playerData.bet);
                    }
                    player.showViewBet(playerData.bet, this._roomData.moneyBet);
                } else {
                    player.lbBetAmount.string =ShanUtils.shorten(playerData.bet, 2);
                }
            }
        }

        // Show deck
        // var deck = new cc.Node();
        // deck.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE;
        // this.uiNode.addChild(deck);

        // let card52 = cc.instantiate(this.prefabCard);
        // card52.getComponent(Card).hide();
        // card52.setPosition(cc.v2(0, 0));

        // deck.addChild(card52);

        // Get Number of Player
        var players = this.playerNodes.filter(function (p) { return p.getState() == cmd.Code.PLAYER_STATUS_PLAYING })
        var actions = [];

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < players.length; j++) {
                actions.push(
                    cc.delayTime(0.1),
                    cc.callFunc(function (target, data) {
                        this.dealerAction('Deal');
                        var cardNode = cc.instantiate(this.prefabCard);
                        cardNode.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE * 0.6;
                        // cardNode.setPosition(players[data.j].node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(deck.getPosition())));
                        cardNode.angle = 180;
                        cardNode.zIndex = Constant.SHANKOEMEE_CARD_Z_INDEX;
                        cardNode.setPosition(cc.v2(0, 0));
                        this.uiNode.addChild(cardNode);

                        players[data.j].addCard(cardNode.getComponent(Card));

                        this.shanKoeMeeSound.playDealCard();

                    }, this, { i: i, j: j })
                )
            }
        }

        // actions.push(cc.callFunc(function () {
        //     deck.removeFromParent();
        // }))

        var isInstantEndGame = false; //data.isInstantEndGame;
        for (var i = 0; i < data.dataList.length; i++) {
            if (this._getLocalChair(data.dataList[i].chair) == 0) {
                isInstantEndGame = true;
            }
            else {
                let tempPlayer = this.playerNodes[this._getLocalChair(data.dataList[i].chair)]
                let tempDataCard = data.dataList[i].cards;
                actions.push(
                    cc.delayTime(0.5),
                    cc.callFunc(function () {
                        tempPlayer.setCardData(tempDataCard);
                        // tempPlayer.showAllCards();
                    })
                )
            }
        }

        actions.push(
            cc.delayTime(0.5),
            cc.callFunc(function () {
                this.onGamePlay(data.countDownTime, isInstantEndGame);
                for (var j = 0; j < players.length; j++) {
                    players[j].setVisibleWatingOpenCards(true);
                }
            }.bind(this))
        )

        this.node.runAction(cc.sequence(actions));
    }

    onGamePlay(seconds, isInstantEndGame) {
        this.timeCountDown.show("player_time", seconds, this._getLocalChair(this.bankerChair) == 0);
        // cc.log("gamePlay", this.playerNodes[0].getState(), seconds, isInstantEndGame)
        if (this.playerNodes[0].getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
            if (seconds <= 5) {
                this.playerNodes[0].showCards();
            } else {
                this.nanBaiLayer.init(seconds, this._getLocalChair(this.bankerChair) == 0, isInstantEndGame, this.playerNodes[0].getCardData(), function () {
                    this._onNanBaiLayerClosed();
                }.bind(this))
            }
        }

        if (this.basePopUpActive) {
            this.basePopUpActive.onClose();
        }
    }

    onGamePhaseTwo(countDownTime) {
        var isBanker = this._getLocalChair(this.bankerChair) == 0;
        // this.bankerPlayingNode.node.active = isBanker;
        cc.tween(this.node)
            .delay(0.5)
            .call(() => {
                this.bankerPlayingNode.setActive(isBanker);
                this.shouldShowBtnCompare();
            })
            .start()

        this.playerNodes[this._getLocalChair(this.bankerChair)].showBurnBorderAnim();

        if (!this.isBanker)
            this.nanBaiLayer.closeDialog();
        this.timeCountDown.show("banker_time", countDownTime, this._getLocalChair(this.bankerChair) == 0);

        // this._chatNode.onShowMiniNode();
        if (this.basePopUpActive && this.bankerChair == 0) {
            this.basePopUpActive.onClose();
        }
    }

    onGameEndMatch(data) {
        // cc.log('onendMatch', JSON.stringify(data))
        // truong hop so bai hon hop
        if (Math.floor(data.bankerCards[0] / 4) == Math.floor(data.bankerCards[1] / 4) && Math.floor(data.bankerCards[1] / 4) == Math.floor(data.bankerCards[2] / 4)) {
            this._delayForJackPotWin = 2;
        }

        if (data.endType == 0) {
            this.compareFinish(data);
        }
        else {
            this.manualFinish(data);
        }
    }

    compareFinish(data) {
        this.timeCountDown.showText('compare_3');
        this.playingNode.setActive(false);
        this.bankerPlayingNode.setActive(false);
        this.bankerPot = data.bankerPot;

        var banker = this.playerNodes[this._getLocalChair(this.bankerChair)];
        var listThree = data.playerList.filter(function (p) { return p.cards.length == 3 })
        var listTwo = data.playerList.filter(function (p) { return p.cards.length == 2 })

        var actions = [];

        //mo bai player 3 la
        actions.push(cc.delayTime(1.5));
        actions.push(cc.callFunc(() => {
            this.timeCountDown.node.active = false;

            for (var i = 0; i < listThree.length; i++) {
                var localChair = this._getLocalChair(listThree[i].chair);
                var player = this.playerNodes[localChair];

                if (localChair != 0) {
                    player.setCardData(listThree[i].cards);
                    player.showAllCards();
                }
            }
        }));

        //mo bai banker, hien thang thua player 3la
        actions.push(cc.delayTime(2));
        actions.push(cc.callFunc(() => {
            banker.setCardData(data.bankerCards.slice(0, 2));
            banker.setShow(false);
            banker.showAllCards();

            for (var i = 0; i < listThree.length; i++) {
                var localChair = this._getLocalChair(listThree[i].chair);
                var player = this.playerNodes[localChair];

                if (listThree[i].isWin) {
                    player.showWinEffect();
                } else {
                    player.showLoseEffect();
                }
            }
        }));

        //thu tien player 3 la thua
        actions.push(cc.callFunc(function () {
            for (var i = 0; i < listThree.length; i++) {
                var pData = listThree[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                let moneyChangeBeforTax = pData.moneyChangeBeforTax == 0 ? pData.moneyChange : pData.moneyChangeBeforTax;
                if (!pData.isWin) {
                    player.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function (sender, data) {
                        this.chipGroup.playerBet(data.player, -moneyChangeBeforTax, false);
                        data.player.hideBet();
                        data.player.moneyChange(data.pData.moneyChange, data.pData.money, false);
                    }, this, { player: player, pData: pData })))

                    if (localChair === 0 && this._getLocalChair(this.bankerChair) !== localChair) {
                        // this._chatNode.notifyWinLost(pData.isWin, pData.moneyChange, pData.cards, data.bankerCards);
                    }
                }
            }
        }.bind(this)));

        //banker boc them bai
        actions.push(cc.delayTime(2));
        actions.push(cc.callFunc(() => {
            var cardNode = cc.instantiate(this.prefabCard);
            cardNode.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE;
            cardNode.angle = 180;
            cardNode.zIndex = Constant.SHANKOEMEE_CARD_BASE_Z_ORDER;

            this.uiNode.addChild(cardNode);
            banker.addCard(cardNode.getComponent(Card));
            this.shanKoeMeeSound.playDealOneCard();

            if (this._getLocalChair(this.bankerChair) == 0) {
                // banker.setShow(false);
                // banker.setCardData(data.bankerCards);
                cardNode.getComponent(Card).setId(data.bankerCards[2]);
                cc.tween(banker.node)
                    .delay(0.5)
                    .call(() => {
                        cardNode.getComponent(Card).flipAndShow();
                        banker.showGroupName(cardNode.scale, false);
                        banker.showMultiple();
                    })
                    .start();
            }
        }));

        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(() => {
            this.timeCountDown.showText('compare_2');
        }));

        //mo bai player 2la 
        actions.push(cc.delayTime(1.5));
        actions.push(cc.callFunc(() => {
            this.timeCountDown.node.active = false;
            for (var i = 0; i < listTwo.length; i++) {
                var localChair = this._getLocalChair(listTwo[i].chair);
                var player = this.playerNodes[localChair];

                if (localChair != 0) {
                    player.setCardData(listTwo[i].cards);
                    player.showAllCards();
                }
            }
        }));

        //mo bai banker lan 2, show thang thua player 2 la
        actions.push(cc.delayTime(2));
        actions.push(cc.callFunc(() => {
            banker.setCardData(data.bankerCards);
            banker.setShow(false);
            banker.showAllCards();

            for (var i = 0; i < listTwo.length; i++) {
                var localChair = this._getLocalChair(listTwo[i].chair);
                var player = this.playerNodes[localChair];

                if (listTwo[i].isWin) {
                    player.showWinEffect();
                } else {
                    player.showLoseEffect();
                }
            }
        }));

        // thu tien player 2la thua
        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(function () {
            for (var i = 0; i < listTwo.length; i++) {
                var pData = listTwo[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                let moneyChangeBeforTax = pData.moneyChangeBeforTax == 0 ? pData.moneyChange : pData.moneyChangeBeforTax;
                if (!pData.isWin) {
                    player.node.runAction(cc.callFunc(function (sender, data) {
                        this.chipGroup.playerBet(data.player, -moneyChangeBeforTax, false);
                        data.player.hideBet();
                        data.player.moneyChange(data.pData.moneyChange, data.pData.money, false);
                    }, this, { player: player, pData: pData }))

                    if (localChair === 0 && this._getLocalChair(this.bankerChair) !== localChair) {
                        // this._chatNode.notifyWinLost(pData.isWin, pData.moneyChange, pData.cards, data.bankerCards);
                    }
                }
            }
        }.bind(this)));

        //tra tien cho player thang
        actions.push(cc.delayTime(1));
        actions.push(cc.callFunc(function () {
            var dataPay: any = [{
                goldOut: data.bankerPot,
                goldOutRaw: data.bankerPot,
                goldChange: data.bankerPot,
                player: banker,
                isBanker: true,
                arrC: [],
            }];

            var delayBetweenPlayer = data.isShowUserByUser ? 1 : 0;
            for (var i = 0; i < data.playerList.length; i++) {
                var pData = data.playerList[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                if (pData.isWin) {
                    dataPay.push({
                        goldOut: pData.moneyChangeBeforTax,
                        goldOutRaw: pData.moneyChangeBeforTax,
                        goldChange: pData.moneyChange,
                        goldFinal: pData.money,
                        player: player,
                        arrC: [],
                        delay: delayBetweenPlayer * i
                    })
                    if (localChair === 0 && this._getLocalChair(this.bankerChair) !== localChair) {
                        // this._chatNode.notifyWinLost(pData.isWin, pData.moneyChange, pData.cards, data.bankerCards);
                    }
                }
            }

            if (this._getLocalChair(this.bankerChair) === 0) {
                // this._chatNode.notifyPotChange(data.bankerPot > this.pot.getValue(), data.bankerPot - this.pot.getValue(), data.bankerCards);
            }
            this.chipGroup.node.runAction(cc.callFunc(function () {
                this.chipGroup.distributeMoney(dataPay);
                this.shanKoeMeeSound.playBet();
            }.bind(this)));
        }.bind(this)));

        this.node.runAction(cc.sequence(actions));
    }

    manualFinish(data) {
        this.timeCountDown.node.active = false;
        this.playingNode.setActive(false);
        this.bankerPlayingNode.setActive(false);
        this.bankerPot = data.bankerPot;

        var banker = this.playerNodes[this._getLocalChair(this.bankerChair)];

        var actions = [];
        // boc them la bai nua
        if (data.endType == 0 || data.endType == 1) {
            actions.push(cc.callFunc(function () {
                var cardNode = cc.instantiate(this.prefabCard);
                cardNode.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE;
                cardNode.angle = 180;
                cardNode.zIndex = Constant.SHANKOEMEE_CARD_BASE_Z_ORDER;

                this.uiNode.addChild(cardNode);
                banker.addCard(cardNode.getComponent(Card));
                this.shanKoeMeeSound.playDealOneCard();

                if (this._getLocalChair(this.bankerChair) == 0) {
                    banker.setShow(false);
                    banker.setCardData(data.bankerCards);
                    cc.tween(banker.node)
                        .delay(0.5)
                        .call(() => { banker.showAllCards(); })
                        .start();
                }
            }.bind(this)));
        }

        // show bai nguoi choi
        actions.push(cc.delayTime(1));
        actions.push(cc.callFunc(function () {
            for (var i = 0; i < data.playerList.length; i++) {
                var pData = data.playerList[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                if (localChair != 0) {
                    player.setCardData(pData.cards);
                    player.showAllCards();
                }
            }
        }.bind(this)));

        // show bai banker
        if (this._getLocalChair(this.bankerChair) != 0) {
            actions.push(cc.delayTime(0.5));
            actions.push(cc.callFunc(function () {
                banker.setShow(false);
                banker.setCardData(data.bankerCards);
                banker.showAllCards();
            }.bind(this)));
        }

        // hien hieu ung thang thua cua nguoi choi
        actions.push(cc.delayTime(0.5));
        actions.push(cc.callFunc(function () {
            for (var i = 0; i < data.playerList.length; i++) {
                var pData = data.playerList[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                if (pData.isWin) {
                    player.showWinEffect();
                } else {
                    player.showLoseEffect();
                }
            }
        }.bind(this)));

        // thu tien thang thua
        actions.push(cc.delayTime(1));
        actions.push(cc.callFunc(function () {
            var hasPlayerLose = false;
            var dataPay: any = [{
                goldOut: data.bankerPot,
                goldOutRaw: data.bankerPot,
                goldChange: data.bankerPot,
                player: banker,
                isBanker: true,
                arrC: []
            }];

            var delayBetweenPlayer = data.isShowUserByUser ? 1 : 0;
            for (var i = 0; i < data.playerList.length; i++) {
                var pData = data.playerList[i];
                var localChair = this._getLocalChair(pData.chair);
                var player = this.playerNodes[localChair];

                let moneyChangeBeforTax = pData.moneyChangeBeforTax == 0 ? pData.moneyChange : pData.moneyChangeBeforTax;
                if (pData.isWin) {

                    dataPay.push({
                        goldOut: pData.moneyChangeBeforTax,
                        goldOutRaw: pData.moneyChangeBeforTax,
                        goldChange: pData.moneyChange,
                        goldFinal: pData.money,
                        player: player,
                        arrC: [],
                        delay: delayBetweenPlayer * i
                    })
                } else {
                    hasPlayerLose = true;
                    player.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function (sender, data) {
                        this.chipGroup.playerBet(data.player, -moneyChangeBeforTax, false);
                        data.player.hideBet();
                        data.player.moneyChange(data.pData.moneyChange, data.pData.money, false);
                    }, this, { player: player, pData: pData })))
                }

                if (localChair === 0 && this._getLocalChair(this.bankerChair) !== localChair) {
                    // this._chatNode.notifyWinLost(pData.isWin, pData.moneyChange, pData.cards, data.bankerCards);
                }
            }

            if (this._getLocalChair(this.bankerChair) === 0) {
                // this._chatNode.notifyPotChange(data.bankerPot > this.pot.getValue(), data.bankerPot - this.pot.getValue(), data.bankerCards);
            }
            this.chipGroup.node.runAction(cc.sequence(cc.delayTime(hasPlayerLose ? 2 : 0), cc.callFunc(function () {
                this.chipGroup.distributeMoney(dataPay);
                this.shanKoeMeeSound.playBet();
            }.bind(this))));
        }.bind(this)));

        this.node.runAction(cc.sequence(actions));
    }

    onGameFinishMatch(data) {
        this.clean();
        this._delayForJackPotWin = 0;
        this._userAction = false;

        this.changeBankerChair(data.bankerChair);
        this.pot.setValue(data.bankerPot);
        if (data.bankerPot == 0) {
            this.chipGroup.reset();
        }
        this._roomData.playerList = data.playerList;

        for (var i = 0; i < this.playerNodes.length; i++) {
            var p = this.playerNodes[i];
            p.updateInfo(this._roomData.playerList[i])

            if (p._data.userName == this._user.Nickname) {
                ShanUtils.setChip(p._data.money)
            }
        }

        this.onGameNewMatch();
    }

    onGameNewMatch() {
        this._updateRoomData();

        // this._chips.forEach(function(c) { c.node.removeFromParent() });
        // this._chips = [];

        // this.playingNode.active = false;
        this.playingNode.setActive(false);
        this.playingNode.setLastBet(-1);
    }

    showBankerWin(value, name) {
        var c = cc.instantiate(this.bankerWin);
        this.node.addChild(c);
        c.getComponent('Shan.BankerWin').onShow(value, name);
        this.shanKoeMeeSound.playBankerWin();

        this.timeCountDown.node.opacity = 0;
        cc.tween(this.timeCountDown.node)
            .delay(2)
            .to(0, { opacity: 255 })
            .start()
    }

    restoreGame(data) {
        // cc.log("restoreGame", data);

        var ownCardList = data.cardList;
        var countDownTime = data.countDownTime;
        var bankerChair = data.bankerChair;
        var bankerPot = data.bankerPot;
        var isInstantEndGame = data.isInstantEndGame;

        // delete data.cardList;
        // delete data.countDownTime;
        // delete data.bankerPot;
        // delete data.isInstantEndGame;
        // delete data.bankerChair;

        var playerList = data.playerList.filter(function (p) {
            return p.stateId == cmd.Code.PLAYER_STATUS_PLAYING;
        })

        this.onWsRoomInfo(data);

        // cc.log(playerList);

        for (var i = 0; i < playerList.length; i++) {
            var localChair = this._getLocalChair(playerList[i].chair);
            if (localChair != 0) {
                if (playerList[i].isShow) {
                    this.playerNodes[localChair].instantlyAddCard(playerList[i].cards, true, this.uiNode)
                } else {
                    this.playerNodes[localChair].instantlyAddCard(playerList[i].cardSize, false, this.uiNode)
                }
            } else {
                this.playerNodes[0].instantlyAddCard(ownCardList, false, this.uiNode)
            }
            if (playerList[i].betAmount > 0) {
                this.playerNodes[localChair].bet(playerList[i].betAmount, playerList[i].money);
                this.playerNodes[localChair].showViewBet(playerList[i].betAmount, this._roomData.moneyBet, true);
            }
        }
        for (let i = 0; i < this.playerNodes.length; i++) {
            let player = this.playerNodes[i];
            if (player._data.stateId == cmd.Code.PLAYER_STATUS_VIEWER) {
                this.playerNodes[i].showWaitingNewMatch(true);
            }
        }

        this.changeBankerChair(bankerChair);
        this.chipGroup.fixChipGroup(bankerPot);

        switch (data.gameState) {
            case 1: {
                // Betting
                this.onGameBet(countDownTime, bankerChair, bankerPot, 0, data.warningCount);
                break;
            }
            case 2: {
                // Phase One
                this.pot.setValue(bankerPot);
                this.onGamePlay(countDownTime, isInstantEndGame);
                break;
            }
            case 3: {
                // Phase Two
                this.pot.setValue(bankerPot);
                this.playerNodes[0].showCards();
                this.onGamePhaseTwo(countDownTime);
                break;
            }
            case 4: {
                this.pot.setValue(bankerPot);
                break;
            }
        }

        if (this.playerNodes[0].getState() !== cmd.Code.PLAYER_STATUS_PLAYING) {
            this.shanKoeMeeSound.playWaiting();
        }
    }

    getChipThrowingLocation() {
        return cc.v2(0, 0)
    }

    addChip(c) {
        this._chips.push(c.getComponent(Chip));
        this._chipNode.addChild(c)
    }

    getChips() {
        return this._chips
    }

    removeChip(c) {
        var idx = this._chips.indexOf(c);
        if (idx >= 0)
            this._chips.splice(idx, 1)
    }

    clearChips() {
        this._chipNode.removeAllChildren();
        this._chips = [];
    }

    _onNanBaiLayerClosed() {
        this.playerNodes[0].showCards();
        this._ws.seen();
    }

    onWsLeaveRoom(data) {
        // cc.log('onWsLeaveRoom', data);

        if (data.userId == this._user.UserId) {
            // Global.audioManager.replayMusic();
            ShanUtils.setChip(this.playerNodes[0]._data.money);
            ShanRoom.instance._onGameLeave();
            this.node.destroy();
            ShanRoom.instance.UI_Playing = null;
        } else {
            if (!this._userCouldLeaveRoom(data)) {
                return
            }

            var localChair = this._userIdToChairMapping[data.userId];
            if (localChair == this._getLocalChair(this.bankerChair)) {
                if (this.playerNodes[localChair].getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
                    this._showComputerPlayForBanker();
                    return;
                }
                else {
                    this.chipGroup.reset();
                    this.pot.setValue(0);
                }
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
                // this._chatNode.notifyUserExit(player.userName);
            }
        }
    }

    onWsJoinRoomOther(data) {
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

        if (data.stateId == cmd.Code.PLAYER_STATUS_VIEWER) {
            this.playerNodes[localChair].showWaitingNewMatch(true);
        }

        // this._chatNode.notifyUserJoin(data.userName);
    }

    onWsMatchStart(data) {
        // cc.log('onWsMatchStart ', data);

        for (var i = 0; i < this._roomData.playerList.length; i++) {
            for (var j = 0; j < data.playerList.length; j++) {
                if (this._roomData.playerList[i].chair == data.playerList[j].chair) {
                    this._roomData.playerList[i].avatar = data.playerList[j].avatar;
                    this._roomData.playerList[i].money = data.playerList[j].money;
                    this._roomData.playerList[i].userId = data.playerList[j].userId;
                    this._roomData.playerList[i].userName = data.playerList[j].userName;
                    this._roomData.playerList[i].stateId = cmd.Code.PLAYER_STATUS_PLAYING;
                    this._roomData.playerList[i].betAmount = data.playerList[j].betAmount
                }
            }
        }

        this._roomData.matchId = data.matchId;
        this._updateRoomData();

        this.onGameBet(data.countDownTime, data.bankerChair, data.bankerPot, data.moneyAddToPot, data.warningCount);

        // this.playerNodes.forEach(function (e) {
        //     e.setVisibleInviteBtn(false);
        // })
    }

    onWsMatchEnd(data) {
        // cc.log("on match end");
        for (var i = 0; i < this.playerNodes.length; i++) {
            this.playerNodes[this._getLocalChair(i)].setVisibleWatingOpenCards(false);
        }
        this.nanBaiLayer.closeDialog();

        this.onGameEndMatch(data);

        if (this.playerNodes[0].getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
            this._ws.sendUserAction(this._userAction);
        }

        // if (this.playerNodes[0].getState() == cmd.Code.PLAYER_STATUS_PLAYING) {
        //     AnalyticManager.getInstance().logEvent("UserActive", {});
        //     AnalyticManager.getInstance().logEvent("UserActive_shankoemee", {});
        // }
    }

    onWsMatchFinish(data) {
        // cc.log('onGameFinishMatch');

        this.onGameFinishMatch(data);
    }

    onWsBet(errorCode, data) {
        // cc.log('onWsBet', data)
        if (errorCode)
            return;
        cc.log(data.totalBet, this.pot.getValue());
        if ((data.totalBet == this.pot.getValue() || data.remainGold == 0) && this._getLocalChair(data.chair) == 0) {
            this.playingNode.setActive(false);
        }

        if (data.remainGold == 0) {
            this.playerNodes[this._getLocalChair(data.chair)].showAllInAnim(true);
            this.playerNodes[this._getLocalChair(data.chair)].showAMaxBetAnim(true);
        }

        if (data.totalBet == this.pot.getValue()) {
            this.playerNodes[this._getLocalChair(data.chair)].showAMaxBetAnim(true);
        }

        this.playerNodes[this._getLocalChair(data.chair)].bet(data.totalBet, data.remainGold);
        this.playerNodes[this._getLocalChair(data.chair)].showViewBet(data.bet, this._roomData.moneyBet);

        if (this._getLocalChair(data.chair) == 0) {
            this.playingNode.setLastBet(data.totalBet);
        }

        this.shanKoeMeeSound.playBet();
    }

    onWsStartPhaseOne(data) {
        this.onGamePhaseOne(data);
    }

    onWsStartPhaseTwo(data) {
        // cc.log('on ws phase two ', data)
        this.onGamePhaseTwo(data.countDownTime);
    }

    onWsSeen(data) {
        // cc.log('onWsSeen', data);
        this.playerNodes[this._getLocalChair(data.chair)].setVisibleWatingOpenCards(false);
        if (this._getLocalChair(data.chair) == 0) {
            this.nanBaiLayer.closeDialog();
        }
        else {
            if (this.playerNodes[this._getLocalChair(data.chair)].getCardData().length > 0) {
                this.playerNodes[this._getLocalChair(data.chair)].showAllCards();
                this.shanKoeMeeSound.playOtherShan();
            }
        }
    }

    onWsDrawCard(errorCode, data) {
        if (errorCode) {
            return;
        }
        var chair = this._getLocalChair(data.chair);

        // cc.log('data.cardId', data.cardId, chair)

        var cardNode = cc.instantiate(this.prefabCard);
        cardNode.scale = Constant.SHANKOEMEE_CARD_DEALING_SCALE;
        cardNode.angle = 180;
        cardNode.zIndex = Constant.SHANKOEMEE_CARD_BASE_Z_ORDER;
        cardNode.setPosition(cc.v2(0, 0));

        this.uiNode.addChild(cardNode);
        this.playerNodes[chair].addCard(cardNode.getComponent(Card));
        this.dealerAction('Deal');

        if (this._getLocalChair(data.chair) == 0) {
            this.playerNodes[0].hideGroupName();
            this.playerNodes[0].addCardData(data.cardId);

            if (data.chair == this.bankerChair) {
                let bankPlayer = this.playerNodes[chair];
                cardNode.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
                    this.setId(data.cardId, true);
                    bankPlayer.setShow(false);
                    bankPlayer.showAllCards();
                    // this.flipUp();
                }.bind(cardNode.getComponent(Card)))))
            }

            if (this.nanBaiLayer.node.active) {
                this.nanBaiLayer.drawCard(data.cardId);
            }
        }

        this.shanKoeMeeSound.playDealOneCard();
    }

    onWsCompare(data) {

    }

    onWsBankerWin(data) {
        this.changeBankerChair(-1);
        var player = this.playerNodes[this._getLocalChair(data.chair)];
        this.chipGroup.collectGold(player);
        player.moneyChange(data.moneyWin, data.balance, false);
        this.pot.setValue(0);

        this.showBankerWin(data.moneyWin, this.playerNodes[this._getLocalChair(data.chair)].getUserName());
        // this._chatNode.notifyBankerWin(this.playerNodes[this._getLocalChair(data.chair)].getUserName(), data.moneyWin)

    }

    onKeyDown(event) {
        // cc.log("onKeyDown", event);
        // switch (event.keyCode) {
        //     case cc.macro.KEY.c:
        //         this.chipGroup.reset();
        //         break;
        //     case cc.macro.KEY.b:
        //         this.chipGroup.playerBet(this.playerNodes[0], 10000);
        //         break;
        //     case cc.macro.KEY.v:
        //         this.chipGroup.getTotalValueChips();
        //         break;
        //     case cc.macro.KEY.a:
        //         this.playerNodes[0].showViewBet(10000, this._roomData.moneyBet);
        //         break;
        //     case cc.macro.KEY.s:
        //         this.chipGroup.collectGold(this.playerNodes[0]);
        //         break;
        //     case cc.macro.KEY.q:
        //         this.showBankerWin(2000, 'Brian');
        //         break;

        //     case cc.macro.KEY.w:
        //         this.dealerAction('Deal');
        //         break;
        //     case cc.macro.KEY.e:
        //         this.dealerAction('Fun');
        //         break;
        //     case cc.macro.KEY.r:
        //         this.dealerAction('Angry');
        //         break;

        //     case cc.macro.KEY.d:
        //         this.chipGroup.distributeMoney({
        //             board: this,
        //             arr: [
        //                 {
        //                     goldOut: 150000,
        //                     goldOutRaw: 150000,
        //                     player: this.playerNodes[0],
        //                     arrC: [],
        //                 }, {
        //                     goldOut: 1000000,
        //                     goldOutRaw: 1000000,
        //                     player: this.playerNodes[0],
        //                     arrC: [],
        //                     isBanker: true
        //                 }
        //             ]
        //         });
        //         break;
        //     case cc.macro.KEY.f:
        //         this.chipGroup.fixChipGroup(500000);
        //         break;
        // }
    }

    changeBankerChair(chair) {
        if (this.bankerChair != chair) {
            this.bankerChair = chair;
            this.playingNode.setLastBet(0);
            this.playerNodes.forEach(pn => {
                pn.setBanker(false);
            })
            if (chair >= 0 && chair < this.playerNodes.length) {
                this.playerNodes[this._getLocalChair(chair)].setBanker(true);
                this.playerNodes[this._getLocalChair(chair)].showBurnBorderAnim();
                // if (this._roomData)
                    // this._chatNode.notifyChangeBanker(this.playerNodes[this._getLocalChair(chair)].getUserName());
            }
        }
    }

    updateWarningCount(count) {
        if (count <= 0) {
            this.bgWarningCount.active = false;
            return 0;
        }

        else if (count == 3) {
            this.bgWarningCount.setScale(0);
            this.bgWarningCount.active = true;
            this.lbWarningCount.string = '' + count;
            this.bgWarningCount.angle = 0;
            cc.tween(this.bgWarningCount)
                .to(0.5, { scale: 2, angle: -360 }, { easing: 'sineOutIn' })
                .to(0.5, { scale: 1, angle: -720 }, { easing: 'sineOutIn' })
                .start();
            this.shanKoeMeeSound.playLast3game();
        }
        else {
            // this.bgWarningCount.setScale(0);
            this.bgWarningCount.active = true;
            this.lbWarningCount.string = '' + count;
            this.bgWarningCount.angle = 0;
            cc.tween(this.bgWarningCount)
                .to(0.5, { scale: 2, angle: -360 }, { easing: 'sineInOut' })
                .to(0.5, { scale: 1, angle: -720 }, { easing: 'sineInOut' })
                .start();

            this.shanKoeMeeSound.playLast3game();
        }

        let alertCount = cc.instantiate(this.prefabShanAlert);
        this.node.addChild(alertCount);
        alertCount.zIndex = Constant.SHANKOEMEE_ALERT_Z_INDEX;
        alertCount.getComponent('Shan.Alert').show(count);

        return 2;
    }

    shouldShowBtnCompare() {
        var isBanker = this._getLocalChair(this.bankerChair) == 0;
        if (isBanker) {
            let countShan = 0;
            let countTwoCard = 0;
            let countThreeCard = 0;
            let countEmptyCard = 0;


            for (let i = 1; i < this.playerNodes.length; i++) {
                let p = this.playerNodes[i];
                // cc.log('this.playerNodes: ', p._cards);
                if (p.bgShan9.node.active || p.bgShan8.node.active || p.bgShanSap.node.active) {
                    countShan++;
                }
                else if (p._cards.length == 2) {
                    countTwoCard++;
                }
                else if (p._cards.length == 3) {
                    countThreeCard++;
                }
                else if (p._cards.length == 3) {
                    countThreeCard++;
                }
                else {
                    countEmptyCard++;
                }
            }

            this.bankerPlayingNode.setActiveBtnCompare(countTwoCard > 0 && countThreeCard > 0)
        }
    }

    onShowJackPot() {
        // cc.log('onShowJackPot');
        this.shanKoeMeeJackpot.showAnđUpateData();
    }

    onBtnShowEmoClick() {
        // this._chatNode.showEmoNode();
    }

    onWsBoomJackpot(data) {
        // cc.log('onWsBoomJackpot ', data)

        let player = this.playerNodes[this._getLocalChair(data.chair)];

        if (this._getLocalChair(data.chair) == 0) {
            cc.tween(this.node)
                .delay(this._delayForJackPotWin)
                .call(() => {
                    let jpNode = cc.instantiate(this.prefabJackPotBig);
                    jpNode.zIndex = 99999;
                    this.node.addChild(jpNode);
                    player.moneyChange(data.amount, data.balance, false);
                    jpNode.getComponent('ShanKoeMeeJackPotBig').showWinJackpot(data.amount);
                })
                .start();
        }
        else {
            cc.tween(this.node)
                .delay(this._delayForJackPotWin)
                .call(() => {
                    let jpNode = cc.instantiate(this.prefabJackPotSmall);
                    // jpNode.zIndex = 0;
                    this.node.addChild(jpNode);
                    jpNode.setPosition(player.node.getPosition().add(cc.v2(0, 100)));
                    jpNode.getComponent('ShanKoeMeeJackPotSmall').showWinJackpot(data.amount);

                    player.moneyChange(data.amount, data.balance, false);
                    player.setCardData(data.cardList);
                    player.showAllCards();
                })
                .start();
        }
    }

    onBtnBackClicked() {
        if (this._getLocalChair(this.bankerChair) == 0) {
            // let str = "Warning leave";
            // str = ShanUtils.formatWithArg(str,ShanUtils.format(this.pot.getValue()));
            // Alert.show("", str).addButton('ok', function () { 
            //     this._ws.leaveRoom();
            // }.bind(this)).addButton('cancel');
            this._ws.leaveRoom();
        }
        else {
            this._ws.leaveRoom();
        }
    }
}