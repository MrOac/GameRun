import { setTextureFromRes } from "./Shan.Utils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class InteractItem extends cc.Component { 
    @property(cc.Sprite)
    image: cc.Sprite = null;
    @property(cc.ProgressBar)
    timer: cc.ProgressBar = null;
    @property(cc.Node)
    nodeTimer: cc.Node = null;
    _cb: any;
    _imagePath: any;
    onload () {
        if (this.nodeTimer) {
            this.nodeTimer.active = false;
            // let last = KVDatabase.getInstance().getInt('lastClickInteractItem') || 0;
            // if (last + TIME_DELAY > cc.sys.now()) {
            //     this.nodeTimer.active = true;
            // }
        }
    }

    update (dt) {
        if (this.nodeTimer && this.nodeTimer.active) {
            var now = cc.sys.now();
            // let last = KVDatabase.getInstance().getInt('lastClickInteractItem') || 0;
            // var delta = last + TIME_DELAY - now;
            // if (delta <= 0) {
            //     this.nodeTimer.active = false;
            // }
            // else {
                // this.timer.progress = delta / (TIME_DELAY);;
            // }
        }
    }

    setData (cb, itemId, imagePath) {
        this._cb = cb;
        this._itemId = itemId;
        this._imagePath = imagePath;
        this._updateImage();
    }

    onClicked () {
        this._cb && this._cb(this._itemId);
        // KVDatabase.getInstance().set('lastClickInteractItem', cc.sys.now());
    }
    _itemId(_itemId: any) {
        throw new Error("Method not implemented.");
    }

    _updateImage () {
        // setTextureFromRes(this.image, this._imagePath)
    }

    setRotation (rotation) {
        this.node.angle = rotation;
    }
}