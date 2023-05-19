const { ccclass, property } = cc._decorator;
@ccclass
export default class ScrollView extends cc.Component {
    @property(cc.Node)
    view: cc.Node = null;
    @property
    isOpacity: boolean = false;


    viewRect: cc.Rect;

    update(dt) {
        var pos = cc.v2(-this.view.width / 2, -this.view.height / 2);
        pos = this.node.convertToNodeSpaceAR(this.view.convertToWorldSpaceAR(pos));
        this.viewRect = cc.rect(pos.x, pos.y, this.view.width, this.view.height);
        for (var i = 0; i < this.node.children.length; i++) {
            var node = this.node.children[i];
            if (this.viewRect.intersects(node.getBoundingBox())) {
                if (!this.isOpacity)
                    node.active = true;
                else
                    node.opacity = 255;
            } else {
                if (!this.isOpacity)
                    node.active = false;
                else
                    node.opacity = 0;
            }
        }
    }
}