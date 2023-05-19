import { Global } from "../../Loading/src/Global";
import { Tophudata } from "./Lobby.ItemTopHu";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTopHu extends Dialog {

    @property(cc.ScrollView)
    scrList: cc.ScrollView = null;
    @property([cc.SpriteFrame])
    sprIconGame: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprXHu: cc.SpriteFrame[] = [];


    selectedJpValue = 100;
    currentList = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    dataHu = null;
    index: number = 0;
    listData100: Array<Tophudata> = new Array<Tophudata>();
    listData1000: Array<Tophudata> = new Array<Tophudata>();
    listData10000: Array<Tophudata> = new Array<Tophudata>();

    setInfo() {
        this.dataHu = App.instance.topHuData;
        this.currentList = [];
        for (var key in this.dataHu) {
            if (key != "caothap") {
                let dataHu = this.dataHu[key];
                let gameName = App.instance.getGameName(key);
                if (gameName != key) {
                    if (key == "TAI_XIU") {
                        let topHu100 = new Tophudata(key, gameName, dataHu["1"]["pt"], dataHu["0"]["px"]);
                        this.currentList.push(topHu100);
                    } else {
                        let topHu100 = new Tophudata(key, gameName, dataHu["100"]["p"], dataHu["1000"]["p"], dataHu["10000"]["p"], dataHu["100"]["x2"], dataHu['1000']['x2'], dataHu['10000']['x2']);
                        this.currentList.push(topHu100);
                    }
                }
            }
        }
        if (this.selectedJpValue == 100) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value100 > y.value100 ? -1 : 1;
            });
        } else if (this.selectedJpValue == 1000) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value1000 > y.value1000 ? -1 : 1;
            });
        } else if (this.selectedJpValue == 10000) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value10000 > y.value10000 ? -1 : 1;
            });
        }
        for (let i = 0; i < this.currentList.length; i++) {
            let data = this.currentList[i];
            let item = this.scrList.content.children[i];
            if (!item) {
                item = cc.instantiate(this.scrList.content.children[0]);
                item.parent = this.scrList.content;
            }
            item['data'] = data;
            item.active = true;
            item.getChildByName('sprIcon').getComponent(cc.Sprite).spriteFrame = this.getSprIcon(data['gamename']);
            item.getChildByName("lbGameName").getComponent(cc.Label).string = data['gamename'];
            item.getComponent(cc.Button).clickEvents[0].customEventData = data['gamename'];
            Tween.numberTo(item.getChildByName('lbJp100').getComponent(cc.Label), data['value100'], 1.0);
            Tween.numberTo(item.getChildByName('lbJp1K').getComponent(cc.Label), data['value1000'], 1.0);
            Tween.numberTo(item.getChildByName('lbJp10K').getComponent(cc.Label), data['value10000'], 1.0);
            item.getChildByName('sprX100').active = data['valueX100'] != 0 ? true : false;
            item.getChildByName('sprX1K').active = data['valueX1000'] != 0 ? true : false;
            item.getChildByName('sprX10K').active = data['valueX10000'] != 0 ? true : false;
            item.getChildByName('sprTai').active = item.getChildByName('sprXiu').active = data['gamename'] == 'Tài Xỉu' ? true : false;

        }
    }
    /*name game :
  spartans-Thantai
  BENLEY:bitcoin
  audition:duaxe
  maybach:thethao
  tamhung:chimdien
  chiemtinh:chiemtinh
  RollRoye:Sơn Tinh
  
  */
    getSprIcon(gameName): cc.SpriteFrame {
        let sprIcon: cc.SpriteFrame = null;
        switch (gameName) {
            case 'Tây Du Ký':
                sprIcon = this.sprIconGame[0];
                break;
            case 'Viking':
                sprIcon = this.sprIconGame[1];
                break;
            case 'Pokemon':
                sprIcon = this.sprIconGame[2];
                break;
            case 'Dance':
                sprIcon = this.sprIconGame[3];
                break;
            case 'Haloween':
                sprIcon = this.sprIconGame[4];
                break;
            case 'Night Club':
                sprIcon = this.sprIconGame[5];
                break;
            case 'Hoa Quả':
                sprIcon = this.sprIconGame[6];
                break;
            case 'Bikini':
                sprIcon = this.sprIconGame[7];
                break;
            case 'Mini Mậu Binh':
                sprIcon = this.sprIconGame[8];
                break;
            case 'Cao Thấp':
                sprIcon = this.sprIconGame[9];
                break;
            case 'Sơn Tinh':
                sprIcon = this.sprIconGame[10];
                break;
            case 'Lọ Nước Thần':
                sprIcon = this.sprIconGame[11];
                break;
            case 'Tài Xỉu':
                sprIcon = this.sprIconGame[12];
                break;
        }
        return sprIcon
    }
    actChangeAmount(event, data) {
        this.selectedJpValue = parseInt(data);
        this.setInfo();
    }
    actGoToGame(event, data) {
        let TabMenuGame = cc.find('Center/Tabs', Global.LobbyController.node.parent).getComponent("TabMenuGame");
        switch (data) {
            case 'Tây Du Ký':
                Global.LobbyController.actGoToSlot1();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Viking':
                Global.LobbyController.actGoToSlot3();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Pokemon':
                Global.LobbyController.actGameSlot3x3();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Dance':
                Global.LobbyController.actGoToSlot7();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Haloween':
                Global.LobbyController.actGoToSlot10();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Night Club':
                Global.LobbyController.actGoToSlot4();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Hoa Quả':
                Global.LobbyController.actGoToSlot6();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Bikini':
                Global.LobbyController.actGoToSlot11();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Mini Mậu Binh':
                Global.LobbyController.actGameMiniPoker();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Cao Thấp':
                Global.LobbyController.actGameCaoThap();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Sơn Tinh':
                Global.LobbyController.actGoToSlot8();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Lọ Nước Thần':
                Global.LobbyController.actGameSlot3x3Gem();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Tài Xỉu':
                Global.LobbyController.actGameTaiXiu();
                TabMenuGame.onBtnTabMini();
                break;
        }
        this.dismiss();
    }
    // update (dt) {}
}
