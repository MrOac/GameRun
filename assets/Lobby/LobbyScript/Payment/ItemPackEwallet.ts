import PopupCodaEwallet from "./Lobby.PopupCodaEwallet";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemPackEwallet extends cc.Component {
    @property(cc.Node)
    btnBuy:cc.Node = null;
    onLoad(): void {
        this.btnBuy.on(cc.Node.EventType.TOUCH_START,()=>{
            PopupCodaEwallet.instance.openDetailBank(this.node.name);
        })
    }
}