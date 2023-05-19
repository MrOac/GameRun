// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomItem extends cc.Component {

    @property(cc.Label)
    lbRoomBet: cc.Label = null;
    @property(cc.Label)
    lbMoneyRequire: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    data: any;
    roomValue: number;
    moneyRequire: number;
    id: number;
    cbOnSelect: (it: CreateRoomItem) =>void;
    start () {

    }
    setData(data: any, id: number) {
        this.data = data;
        this.roomValue = data.moneyBet;
        this.moneyRequire = data.moneyRequire;
        this.id = id;
        this.updateUI();
    }
    updateUI() {
        this.lbRoomBet.string = this.roomValue + "";
        this.lbMoneyRequire.string = this.moneyRequire + "";
    }
    onSelect() {
        this.cbOnSelect(this);
    }

    // update (dt) {}
}
