import BasePopup from "../Model/Shan.BasePopup";
import InteractItem from "./Shan.InteractItem";
import { NumberUtils } from "./Shan.Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupPlayerInfo extends BasePopup {
    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;
    @property(cc.Prefab)
    prefabItemAnim: cc.Prefab = null;
    @property(cc.ScrollView)
    listView: cc.ScrollView = null;

    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Label)
    lbChip: cc.Label = null;
    @property(cc.Label)
    lbId: cc.Label = null;
    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    @property(cc.Node)
    btnAddFriend: cc.Node = null;
    @property(cc.Node)
    btnChat: cc.Node = null;
    @property(cc.Prefab)
    prefabSendMail: cc.Prefab = null;
    items: any[];
    _localChair: any;
    _chair: any;
    _playerData: any;

    onLoad () {
        this.items = [];
        var arrRotate = [1, 0, 0, 0, 1, 0, 1, 1];

        for (var i = 0; i < 7; i++) {
            this.items.push({
                id: i + 1,
                imgPath: "interact/expression_icon-" + (i + 1),
                rotate: arrRotate[i]
            })
            var node = cc.instantiate(this.prefabItem);
            this.listView.content.addChild(node);
            node.x = 65 + i * 130;
            var item = node.getComponent(InteractItem);
            item.setData(this.onItemClicked.bind(this), this.items[i].id, this.items[i].imgPath);
        }

        this.listView.content.width = this.items.length * 100;
    }

    onItemClicked (itemId) {
        // this._ws.sendInteract(this._localChair == 0 ? -1 : this._chair, itemId, function (data) {
        // }.bind(this));

        // this._gameLayer._userAction = true;
        this.onCloseDone();
    }
    setData (gameLayer, localChair, chair, playerData) {
        this._localChair = localChair;
        this._chair = chair;
        this._gameLayer = gameLayer;
        this._ws = gameLayer._ws;
        this._playerData = playerData;
        this.updateUiInfo(playerData);
    }

    updateUiInfo (data) {
        // cc.log('updateUiInfo', data);

        // setTextureFromRes(this.avatar, GuiHelper.getAvatarPath(data.avatar))
        this.lbName.string = data.userName;
        this.lbChip.string = NumberUtils.format(data.money);
        this.lbId.string = data.userId > 0 ? data.userId : (data.userId < -14777777 ? -data.userId : data.userId + 14623528);

        // if (data.userId == Global.user.getId()) {
        //     this.btnAddFriend.active = false;
        //     this.btnChat.active = false;
        // }
    }

    convertIdToAnimation (id) {
        var arrayAnimation = ["nemtrung", "kiss", "votay", "hoahong", "nemdep", "heart", "cachua", "thuocno"];
        return arrayAnimation[id - 1];
    }

    onMessageClick() {
        return;
        let gameLayer = this._gameLayer;

        let node = cc.instantiate(this.prefabSendMail);
        gameLayer.node.addChild(node);
        node.zIndex = 999999999;
        let readmail = node.getComponent('ReadMail');
        gameLayer.basePopUpActive = readmail;
        readmail.setData(this._playerData.userId, this._playerData.userName, '');
        // readmail.initWs(Global.socketManager.getLobbyWS());

        this.onClose();
    }

    onAddFriendClick() {

    }

    onClose() {
        super.onClose();

    }
}