import { NumberUtils } from "../common/Shan.Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BankerWin extends cc.Component { 
    @property(cc.RichText)
    lbNotify: cc.RichText = null;
    @property(sp.Skeleton)
    animLabel: sp.Skeleton = null;
    start() {

    }

    onShow(value, name) {
        let self = this;
        this.node.setScale(0);

        let str = `<color=#ffffff>Congrats to </color><color=#00ff00>${name}</color><color=#ffffff> on winning </color><color=#ffff> ${NumberUtils.format(value)} </color><color=#ffffff> chips</color>`
        self.lbNotify.string = str;

        this.animLabel && (this.animLabel.animation = 'animation');
        
        var seq = cc.sequence(
            cc.scaleTo(0.2, 1)
            , cc.delayTime(2)
            , cc.scaleTo(0.2, 0.1)
            ,cc.removeSelf(true)
        );
        this.node.runAction(seq);
    }

    onClose() {
    }
} 