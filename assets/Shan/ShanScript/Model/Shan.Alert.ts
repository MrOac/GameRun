const {ccclass, property} = cc._decorator;

@ccclass
export default class Alert extends cc.Component{ 
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    txtNode: cc.Node[] = [];
    onLoad () {
        this.bg.x = -1280;
        this.txtNode.forEach(e => e.active = false);
    }

    start () {

    }

    show(count, callback) {
        this.txtNode[count - 1].active = true;
        cc.tween(this.bg)
            .to(0.3, {x: 0}, {easing: 'backIn'})
            .delay(1)
            .to(0.2, {x: 1280}, {easing: 'backOut'})
            .call(() => {if(callback) callback()})
            .removeSelf()
            .start();
    }
}