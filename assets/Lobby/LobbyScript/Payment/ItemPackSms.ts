import PopupCodaSms from "./Lobby.PopupCodaSms";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemPackSms extends cc.Component {
    @property(cc.Node)
    btnBuy:cc.Node = null;
    onLoad(): void {
        this.btnBuy.on(cc.Node.EventType.TOUCH_START,()=>{
            PopupCodaSms.instance.openDetailBank(this.node.name);
        })
    }
}