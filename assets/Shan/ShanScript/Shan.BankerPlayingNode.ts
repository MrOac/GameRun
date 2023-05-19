import cmd from "./Shan.Cmd";
import ShanNetworkClient from "./Shan.NetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BankerPlayingNode extends cc.Component {
    private _ws: ShanNetworkClient;
    init(ws: any) {
        // throw new Error("Method not implemented.");
        this._ws = ws;
    }

    @property(cc.Node)
    btnDraw: cc.Node = null;
    @property(cc.Node)
    btnNoDraw: cc.Node = null;


    onBtnDrawClicked () {
        // this.node.active = false;
        this.setActive(false);
        ShanNetworkClient.getInstance().send(new cmd.SendDraw());
    }

    onBtnNoDrawClicked () {
        // this.node.active = false;
        this.setActive(false);
        ShanNetworkClient.getInstance().send(new cmd.SendNoDraw());
    }

    onBtnCompareClicked () {
        // this.node.active = false;
        this.setActive(false);
        ShanNetworkClient.getInstance().send(new cmd.SendCompare());
    }

    setActiveAllBtn (boolean) {
        // this.btnCompare.active = boolean;
        this.btnDraw.active = boolean;
        this.btnNoDraw.active = boolean;
    }

    setActiveBtnCompare (boolean) {
        // this.btnCompare.active = boolean;

        // if (boolean) {
        //     this.btnDraw.x = 0;
        //     this.btnCompare.x = -220;
        //     this.btnNoDraw.x = 220;
        // }
        // else {
        //     this.btnDraw.x = -110;
        //     this.btnNoDraw.x = 110;
        // }
    }

    setActive(boolean) {
        // cc.log('setActive bankerPlayingNode ', boolean);
        // let pos = this.node.getPosition();
        let pos = cc.v2(0,0);

        this.node.stopAllActions();
        
        if (boolean) {
            this.node.setPosition(cc.v2(pos.x, pos.y - 150));
            this.node.active = true;
            this.node.opacity = 255;
            cc.tween(this.node)
                .delay(0.5)
                .to(0.3, { x: pos.x, y: pos.y }, { easing: 'backIn' })
                .start()
        }
        else {
            let tmpPos = cc.v2(pos.x, pos.y - 150)
            cc.tween(this.node)
                .to(0.2, { x: tmpPos.x, y: tmpPos.y }, { easing: 'backOut' })
                .call(() => {
                    this.node.opacity = 0;
                    this.node.setPosition(pos);
                    this.node.active = false;
                })
                .start()
        }
    }
}