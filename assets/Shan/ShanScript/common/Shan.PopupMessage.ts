import ShanUtils, { StringUtils } from "./Shan.Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupMessage extends cc.Component { 
    @property(cc.Sprite)
    bgMs: cc.Sprite = null;
    @property(cc.Label)
    lbMs: cc.Label = null;


    start() {

    }

    show(ms) {
        this.lbMs.string = StringUtils.shorten(ms, 1000);
        this.bgMs.node.height = this.lbMs.node.height + 50
        this.node.opacity = 0;
        this.node.width = this.bgMs.node.width;
        this.node.height = this.bgMs.node.height;

        cc.tween(this.node)
            .to(0.1, {opacity: 255})
            .delay(3)
            .to(0.1, {opacity: 0})
            .removeSelf()
            .start()
        
    }
}