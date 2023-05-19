import App from "../../../Lobby/LobbyScript/Script/common/App";
import BasePopup from "./Shan.BasePopup";
import JackpotItem from "./Shan.JackpotItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Jackpot extends BasePopup {
    static instance: Jackpot = null;
    static prefab: any = null;

    @property(cc.Prefab)
    shanJackpotItem: cc.Prefab = null;
    @property(cc.Node)
    lstContent: cc.Node = null;
    private _listHeight: number;

    constructor() {
        super();
        this._listHeight = 0;
    }

    onLoad () {
        this.node.zIndex = 10000;
        this.onCloseDone();
    }

    showAnđUpateData() {
        this.show();
        // this._ws.getJackpotWinners((data) => {
        //     this.updateData(data);
        // });
    }
    finishAnimation() {
        App.instance.showLoading(false);
    }
    updateData (data) {
        // this.node.active = true;
        // this.updateListUser(data.list);
        // 

        return this;
    }

    onBtnCloseClicked () {
        // LoadingIndicator.remove();
        // this.onClose();
    }

    onCloseDone () {
        this.node.active = false;
    }

    updateListUser (list) {
        this.lstContent.removeAllChildren();
        this._listHeight = 0;
        list = list || [];
        
        list.forEach(element => {
            let item = cc.instantiate(this.shanJackpotItem);
            this.lstContent.addChild(item)
            item.setPosition(cc.v2(0, -this._listHeight))
            this._listHeight += item.height + 5;
            item.getComponent(JackpotItem).updateUi(element)

            this.lstContent.height = this._listHeight;
        });
    }
 }