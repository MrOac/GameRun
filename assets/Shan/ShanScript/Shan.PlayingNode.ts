// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ShanUtils, { format, NumberUtils, shorten } from "./common/Shan.Utils";
import cmd from "./Shan.Cmd";
import ShanNetworkClient from "./Shan.NetworkClient";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayingNode extends cc.Component {
    @property(cc.Label)
    lbBtns: cc.Label[] = [];
    @property(cc.Node)
    rebetNode: cc.Node = null;
    @property(cc.Node)
    lbAllIn: cc.Node = null;
    @property(cc.Node)
    lbMaxBet: cc.Node = null;
    @property(cc.Label)
    lbRebet: cc.Label = null;
    private _ws: ShanNetworkClient;
    _lastBet: number;
    private _tempLastBet: number;

    constructor() {
        super();
        this._lastBet = 0;
        this._tempLastBet = 0;
    }

    setData(ws, potValue, betValue) {
        this._ws = ws;

        var arr = [1, 2, 3, 4];
        if (potValue < 40 * betValue) {
            arr = [1, 2, 5, 10];
        } else if (potValue < 100 * betValue) {
            arr = [1, 5, 10, 20];
        } else {
            arr = [1, 5, 10, 50];
        }

        for (var i = 0; i < arr.length; i++) {
            this.lbBtns[i].string =ShanUtils.shorten((arr[i] * betValue),1);
            this.lbBtns[i].node.parent.userData = arr[i] * betValue;
        }

        if (this._lastBet > 0) {
            this.rebetNode.active = true;
        } else {
            this.rebetNode.active = false;
        }

        if (ShanUtils.getChip() <= potValue) {
            this.lbAllIn.active = true;
            this.lbMaxBet.active = false;
        } else {
            this.lbAllIn.active = false;
            this.lbMaxBet.active = true;
        }
    }

    onBtnClicked(event) {
        // this._lastBet = event.target.userData;
        // this._ws.bet(event.target.userData);
        // this._ws.bet(event.target.userData);
        ShanNetworkClient.getInstance().bet(event.target.userData)
    }

    onReBetClicked() {
        // this._ws.bet(this._lastBet);
        this._ws.bet(this._lastBet)
    }

    onAllInClicked() {
        // this._lastBet = -1;
        // this._ws.bet(-1);
        this._ws.bet(-1)
    }

    setLastBet(value) {
        if(value == -1) {
            this.lbRebet.string = NumberUtils.format(this._tempLastBet);
            this._lastBet = this._tempLastBet;
        } else if(value == 0) {
            this._lastBet = 0;
            this.lbRebet.string = '';
            this.rebetNode.active = false;
        }
        this._tempLastBet = value;
        // cc.log('setLastBet', value, this._lastBet, this.lbRebet.string );
    }

    setActive(boolean) {
        // let pos = this.node.getPosition();
        let pos = cc.v2(0,0);
        this.node.stopAllActions();
        
        if (boolean) {
            this.node.setPosition(cc.v2(pos.x, pos.y - 100));
            this.node.active = true;
            this.node.opacity = 255;
            cc.tween(this.node)
                .to(0.3, { x: pos.x, y: pos.y }, { easing: 'backIn' })
                .start()
        }
        else {
            let tmpPos = cc.v2(pos.x, pos.y - 100)
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
