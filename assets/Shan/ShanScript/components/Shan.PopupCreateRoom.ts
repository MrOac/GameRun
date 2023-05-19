// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CreateRoomItem from "./Shan.CreateRoomItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupCreateRoom extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    nListContent: cc.Node = null;
    @property(cc.Component.EventHandler)
    cbCreateRoom: cc.Component.EventHandler = null;

    tmpItem: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    currentSelected: number = 0;
    listRoom: CreateRoomItem[] = []

    onLoad() {
        this.tmpItem = this.item;
    }
    data: any[];


    start() {

    }
    setData(data: any[]) {
        this.data = data;
        this.reloadListView();
    }
    reloadListView() {
        this.listRoom = []
        this.nListContent.removeAllChildren();
        for (let i = 0; i < this.data.length; i++) {
            let tmp = cc.instantiate(this.tmpItem);
            tmp.active = true;
            let script = tmp.getComponent(CreateRoomItem);
            script.setData(this.data[i], i);
            script.cbOnSelect = (it: CreateRoomItem) => { this.onSelectRoom(it) }
            this.nListContent.addChild(tmp);
            this.listRoom.push(script);
        }
        if(this.listRoom.length>0)
        this.onSelectRoom(this.listRoom[0]);
    }
    onClose() {
        this.node.active = false;
    }
    onCreateRoom() {
        this.cbCreateRoom && this.cbCreateRoom.emit([this.listRoom[this.currentSelected].data])
    }
    onSelectRoom(item: CreateRoomItem) {
        for (let i = 0; i < this.listRoom.length; i++) {
            if (i === item.id) {
                this.listRoom[i].node.opacity = 255;
                this.currentSelected = item.id;
            } else {
                this.listRoom[i].node.opacity = 125;
            }
        }
    }

    // update (dt) {}
}
