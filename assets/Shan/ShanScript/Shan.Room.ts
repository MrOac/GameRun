import BundleControl from "../../Loading/src/BundleControl";
import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmd from "./Shan.Cmd";
import ShanNetworkClient from "./Shan.NetworkClient";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
import AudioManager from "../../Lobby/LobbyScript/Script/common/Common.AudioManager";
import { Global } from "../../Loading/src/Global";
import PopupCreateRoom from "./components/Shan.PopupCreateRoom";
enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    CHIA_BAI = 3,
    CHIP = 4,
    CLOCK = 5,
    START_BET = 6
}
const { ccclass, property } = cc._decorator;
@ccclass("Shan.Room.SoundManager")
export class SoundManager {
    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property(cc.AudioSource)
    effSound: cc.AudioSource = null;

    @property([cc.AudioClip])
    listAudio: cc.AudioClip[] = [];
    playBgMusic() {
        AudioManager.getInstance().playBackgroundMusic(this.listAudio[audio_clip.BG]);
    }
    playAudioEffect(indexAudio) {
        // this.effSound.clip = this.listAudio[indexAudio];
        // this.effSound.play();
        if (SPUtils.getSoundVolumn() > 0) {
            cc.audioEngine.play(this.listAudio[indexAudio], false, 1);
        }

    }
    stopAudioEffect() {
        cc.audioEngine.stopAll();
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
}
@ccclass
export default class ShanRoom extends cc.Component {
    public static instance: ShanRoom = null;
    @property(cc.Prefab)
    prefabGame: cc.Prefab = null;
    @property(cc.Node)
    contentListRooms: cc.Node = null;
    @property(cc.Label)
    labelNickName: cc.Label = null;
    @property(cc.Label)
    labelCoin: cc.Label = null;
    @property(cc.ScrollView)
    scrRoom: cc.ScrollView = null;
    @property(cc.Node)
    UI_Playing: cc.Node = null;
    @property(cc.Prefab)
    uiInGamePr: cc.Prefab = null;
    @property(cc.Toggle)
    btnHideRoomFull: cc.Toggle = null;
    @property(cc.EditBox)
    edtFindRoom: cc.EditBox = null;
    @property(SoundManager)
    soundManager: SoundManager = null;

    @property(PopupCreateRoom)
    popupCreateRoom: PopupCreateRoom = null;

    private listDataRoom = [];
    private listFullRoom = [];

    public isInitedUIRoom = false;
    private gameConfig: any;
    // LIFE-CYCLE CALLBACKS:
    public cardFrames: cc.SpriteFrame[] = new Array<cc.SpriteFrame>(53);

    onLoad() {
        ShanRoom.instance = this;
        if (ShanNetworkClient.getInstance().ws != null) ShanNetworkClient.getInstance()._onCloses = [];
        this.loadCardFrame();
    }
    loadCardFrame() {
        for (let i = 0; i < 53; i++) {
            let path = "res/textures/card/" + "labai_" + i;
            try {
                cc.assetManager.getBundle("Shan").load(path, cc.SpriteFrame, (err1, spriteFrame: cc.SpriteFrame) => {
                    this.cardFrames[i] = spriteFrame;
                })
            } catch (e) {
                cc.log("Load card fail ", path);
            }
        }
    }
    start() {
        this.showUIRooms();
        App.instance.showErrLoading("កំពុងភ្ជាប់ទៅម៉ាស៊ីនមេ...");
        // ShanNetworkClient.getInstance().isAutoReconnect = false;
        ShanNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("បច្ចុប្បន្នបានចូល...");
            ShanNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
            // ShanNetworkClient.getInstance().send(new cmd.SendGetGameConfig());
        }, this);
        ShanNetworkClient.getInstance().addOnClose(() => {
            // if (ShanNetworkClient.getInstance().isForceClose) {
                App.instance.loadScene("Lobby");
            // }

        }, this);
        ShanNetworkClient.getInstance().connect();
        this.soundManager.playBgMusic();
    }
    showUIRooms() {
        if (this.isInitedUIRoom) {
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        } else {
            this.isInitedUIRoom = true;
            this.labelNickName.string = Configs.Login.Nickname;
            BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
                this.labelCoin.string = Utils.formatNumber(Configs.Login.Coin);
                // LogEvent.getInstance().sendEventMoneyChange(Configs.GameId.getGameName(Configs.GameId.Shan),Configs.Login.Currency,Configs.Login.Coin);
            }, this);
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            this.setupListener();
        }
    }
    refeshListRoom() {
        App.instance.showLoading(true);
        ShanNetworkClient.getInstance().send(new cmd.SendGetListRoom());
        ShanNetworkClient.getInstance().send(new cmd.SendGetGameConfig());
    }
    setupListener() {
        ShanNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            // cc.log("<<<<<", inpacket.getCmdId(), "<<<<<")
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    // App.instance.showLoading(false);
                    // cc.log("Login shan success")
                    // let res = new cmd.CmdReceivedLogin(data);
                    // let failError = res.getError();
                    // if (failError == 0) {
                    //     this.refeshListRoom();
                    //     ShanNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
                    // } else {
                    //     cc.log("Shan login fail");
                    //     this.refeshListRoom();
                    //     ShanNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
                    // }
                    this.refeshListRoom();
                    ShanNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());


                    break;
                case cmd.Code.TOPSERVER:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedTopServer(data);
                        let rankType = res["rankType"];
                        let topDay_money = res["topDay_money"];
                        let topWeek_money = res["topWeek_money"];
                        let topMonth_money = res["topMonth_money"];
                    }
                    break;
                case cmd.Code.CMD_PINGPONG:
                    {
                    }
                    break;
                case cmd.Code.CMD_JOIN_ROOM:
                    {
                        // App.instance.showLoading(false);
                        // Utils.Log("Shan CMD_JOIN_ROOM");
                    }
                    break;
                case cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        App.instance.showLoading(false);
                        // cc.log("Shan CMD_RECONNECT_ROOM");
                    }
                    break;
                case cmd.Code.MONEY_BET_CONFIG:
                    {
                        let res = new cmd.ReceivedGameConfig(data);
                        this.gameConfig = res;
                        this.gameConfig.list.sort((x, y) => {
                            return x.moneyBet - y.moneyBet;
                        })
                        App.instance.showLoading(false);
                        // cc.log("Shan MONEY_BET_CONFIG " + JSON.stringify(res));
                    }
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomFail(data);
                        let msg = "កំហុស" + res.getError() + ", មិនដឹង.";
                        switch (res.getError()) {
                            case 1:
                                msg = App.instance.getTextLang('txt_room_err1');
                                break;
                            case 3:
                                msg = App.instance.getTextLang('txt_room_err3');
                                break;
                            case 2:
                            case 4:
                                msg = App.instance.getTextLang('txt_room_err2');
                                break;
                            case 5:
                                msg = App.instance.getTextLang('txt_room_err5');
                                break;
                            case 6:
                                msg = App.instance.getTextLang('txt_room_err6');
                                break;
                            case 7:
                                msg = App.instance.getTextLang('txt_room_err7');
                                break;
                            case 8:
                                msg = App.instance.getTextLang('txt_room_err8');
                                break;
                            case 9:
                                msg = App.instance.getTextLang('txt_room_err9');
                                break;
                            case 10:
                                msg = App.instance.getTextLang('txt_room_err10');
                        }
                        App.instance.alertDialog.showMsg(msg);
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.GET_LIST_ROOM:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedGetListRoom(data);
                        // cc.log("Shan Room data " + JSON.stringify(res));

                        this.listDataRoom = res.list;
                        this.listDataRoom.sort((x, y) => {
                            return x.moneyBet - y.moneyBet;
                        })
                        this.reloadListRoom(this.listDataRoom);
                        // this.scrRoom.scrollToTop(0.2);
                    }
                    break;
                case cmd.Code.JOIN_GAME_ROOM_BY_ID:
                    {
                        // App.instance.showLoading(false);
                    }
                    break;

                // ------------------------ Game ---------------------------     

                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {

                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomSucceed(data);
                        // cc.log("Shan JOIN_ROOM_SUCCESS ", JSON.stringify(res));
                        // let cb = (res) => {
                        //     this.UI_Playing.getComponent("Shan.Controller").setupMatch(res);
                        // }
                        // this.showUIPlaying(res, cb);
                    }
                    break;
                case cmd.Code.MATCH_INFO:
                    {
                        let res = new cmd.ReceivedMatchInfo(data);
                        let cb = (res) => {
                            this.UI_Playing.getComponent("Shan.Controller").onWsMatchInfo(res);
                        }
                        this.onWsMatchInfo(res.data);
                    }
                    break;
                case cmd.Code.THONG_TIN_BAN_CHOI: {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceivedGameInfo(data);
                    //       cc.log("THONG_TIN_BAN_CHOI:", res);
                    let cb = (res) => {
                        this.UI_Playing.getComponent("Shan.Controller").actReJoinRoom(res);
                    }
                    this.showUIPlaying(res, cb);
                    break;
                }
                case cmd.Code.LOGOUT: {
                    //          cc.log("Đăng nhâp từ nguồn khác!");
                }
                default:
                    break;
            }
        }, this);
    }
    showUIPlaying(res, cb) {

        if (this.UI_Playing == null) {
            App.instance.showLoading(true);
            App.instance.showLoading(false);
            this.UI_Playing = cc.instantiate(this.prefabGame);
            this.UI_Playing.parent = this.node.parent;
            this.UI_Playing.active = true;
            this.node.active = false;
            cb(res);
            this.closeUIRoom();
            //     cc.assetManager.getBundle("Shan").load("prefabs/UI_Play", cc.Prefab, function (finish, total, item) {
            //     }, (err1, prefab: cc.Prefab) => {
            //         App.instance.showLoading(false);
            //         this.UI_Playing = cc.instantiate(prefab);
            //         this.UI_Playing.parent = this.node.parent;
            //         this.UI_Playing.active = true;
            //         this.node.active = false;
            //         cb(res);
            //         this.closeUIRoom();
            //     })
        } else {
            App.instance.showLoading(false);
            this.UI_Playing.active = true;
            this.node.active = false;
            cb(res);
        }
    }
    onWsMatchInfo(res) {
        // cc.log("ON ws match info");
        if (this.UI_Playing == null) {
            App.instance.showLoading(true);
            App.instance.showLoading(false);
            let tmp  = cc.instantiate(this.prefabGame);
            this.node.parent.addChild(tmp)
            this.node.active = false;
            tmp.active = true;
            for(let i = 0; i< res.playerList.length; i ++){
                if(res.playerList[i].userName == Configs.Login.Nickname){
                    Configs.Login.UserId = res.playerList[i].userId;
                    break;
                }
            }
            tmp.getComponent("Shan.GameController").init(ShanNetworkClient.getInstance(), this)
            tmp.getComponent("Shan.GameController").restoreGame(res);
            // cb(res);
            this.closeUIRoom();
            //TODO: stop music
            // cc.assetManager.getBundle("Shan").load("prefabs/UI_Play", cc.Prefab, function (finish, total, item) {
            // }, (err1, prefab: cc.Prefab) => {
            //     App.instance.showLoading(false);
            //     this.UI_Playing = cc.instantiate(prefab);
            //     this.UI_Playing.parent = this.node.parent;
            //     this.UI_Playing.active = true;
            //     this.node.active = false;
            //     // this.UI_Playing.getComponent("Shan.Controller").init()
            //     this.UI_Playing.getComponent("Shan.Controller").restoreGame(res);
            //     // cb(res);
            //     this.closeUIRoom();
            // })
        } else {
            App.instance.showLoading(false);
            this.UI_Playing.active = true;
            this.node.active = false;
            this.UI_Playing.getComponent("Shan.Controller").restoreGame(res);
            // cb(res);
        }
    }
    createRoom() {
        //      cc.log("Shan createRoom");
        ShanNetworkClient.getInstance().send(new cmd.SendGetGameConfig());
        this.popupCreateRoom.node.active = true;
        this.popupCreateRoom.setData(this.gameConfig.list.filter((item) => item.moneyType === Configs.App.MONEY_TYPE) || []);
        // ShanNetworkClient.getInstance().send(new cmd.SendCreateRoom(1, 8, 500, 0, 8, "", "", 10000));
    }
    hideCreateRoom() {
        this.popupCreateRoom.node.active = false;
    }
    cbCreateRoom(data: any) {
        ShanNetworkClient.getInstance().send(new cmd.SendCreateRoom(Configs.App.MONEY_TYPE, 7, data.moneyBet, 0, 7, "", "", data.moneyRequire));
    }
    getGameConfig() {
        ShanNetworkClient.getInstance().send(new cmd.SendGetGameConfig());
    }
    hideRoomFull() {
        //   cc.log("hide room full");
        this.listFullRoom = [];
        if (this.btnHideRoomFull.isChecked) {
            this.listDataRoom.forEach((data) => {
                if (data.roomInfo['userCount'] == data.roomInfo["maxUserPerRoom"]) {
                    this.listFullRoom.push(data);
                }
            });
            this.reloadListRoom(this.listFullRoom);
        } else {
            this.reloadListRoom(this.listDataRoom);
        }
    }
    findRoomId() {
        let text = this.edtFindRoom.string.trim();
        if (text.length > 0) {
            let idFind = parseInt(text);
            let dataRoom = null;
            dataRoom = this.listDataRoom.find(data => data["id"] == idFind);
            this.reloadListRoom([dataRoom]);
        } else {
            this.reloadListRoom(this.listDataRoom);
        }
    }
    backToLobby() {
        ShanNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }
    reloadListRoom(listDataRoom) {
        this.listDataRoom = listDataRoom;
        App.instance.showLoading(false);
        let cb = (item, itemData) => {
            item.getComponent("Shan.ItemRoom").initItem(itemData);
            item.active = true;
        }
        this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, listDataRoom);
    }

    private isSortRoom = false;
    onBtnSortRoomId() {
        if (this.isSortRoom == false) {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return x.id - y.id;
                })
            }
        }
        else {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return y.id - x.id;
                })
            }
        }
        this.isSortRoom = !this.isSortRoom;
        let cb = (item, itemData) => {
            item.getComponent("Shan.ItemRoom").initItem(itemData);
            item.active = true;
        }
        this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, this.listDataRoom);
    }
    private isSortMoney;
    onBtnSortRoomMoney() {
        if (this.isSortMoney == false) {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return x.requiredMoney - y.requiredMoney;
                })
            }
        }
        else {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return y.requiredMoney - x.requiredMoney;
                })
            }
        }
        this.isSortMoney = !this.isSortMoney;
        let cb = (item, itemData) => {
            item.getComponent("Shan.ItemRoom").initItem(itemData);
            item.active = true;
        }
        this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, this.listDataRoom);
    }

    joinRoom(info) {
        if (Configs.Login.Coin < info.requiredMoney) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough_money"));
            return;
        }
        App.instance.showLoading(true);
        ShanNetworkClient.getInstance().send(new cmd.SendJoinRoomById(info["id"]));
    }
    playingNow() {
        let arrRoomOkMoney = [];
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent("Shan.ItemRoom");
            if (roomItem.roomInfo["requiredMoney"] < Configs.Login.Coin) {
                arrRoomOkMoney.push(index);
            }
        }

        //    cc.log("Shan playingNow arrRoomOkMoney : ", arrRoomOkMoney);

        if (arrRoomOkMoney.length > 0) {
            let roomCrowed = arrRoomOkMoney[0];
            //    cc.log("Shan playingNow roomCrowed start : ", roomCrowed);
            for (let index = 0; index < arrRoomOkMoney.length; index++) {
                let roomItem = this.contentListRooms.children[arrRoomOkMoney[index]].getComponent("Shan.ItemRoom");
                let roomItemCrowed = this.contentListRooms.children[roomCrowed].getComponent("Shan.ItemRoom");
                //        cc.log("Shan playingNow ------------------------------------------");
                //     cc.log("Shan playingNow roomItem : ", roomItem.roomInfo["userCount"]);
                //     cc.log("Shan playingNow roomItemCrowed : ", roomItemCrowed.roomInfo["userCount"]);
                if (roomItem.roomInfo["userCount"] > roomItemCrowed.roomInfo["userCount"]) {
                    roomCrowed = arrRoomOkMoney[index];
                    //       cc.log("Shan playingNow roomCrowed update : ", roomCrowed);
                }
            }
            //   cc.log("Shan playingNow roomCrowed end : ", roomCrowed);
            let roomChoosed = this.contentListRooms.children[roomCrowed].getComponent("Shan.ItemRoom");
            //   cc.log("Shan playingNow roomCrowed end roomInfo : ", roomChoosed.roomInfo);
            this.joinRoom(roomChoosed.roomInfo);
        } else {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough_money'));
        }
    }
    closeUIRoom() {
        this.node.active = false;
    }
    _onGameLeave() {
        this.node.active = true; 
        this.refeshListRoom();
    }
    // update (dt) {}
}
