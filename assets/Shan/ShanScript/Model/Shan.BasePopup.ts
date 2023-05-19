const {ccclass, property} = cc._decorator;

@ccclass
export default class BasePopup extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    darkBg: cc.Node = null;
    _isClosing: any;
    private _isRightSide: any;
    _ws: any;
    _gameLayer: any;
    constructor() {
        super();
        this._ws = null;
        this._gameLayer = null;
    }

    onLoad() {

    }

    start() {
        // this.show();
    }

    initWs(ws) {
        this._ws = ws;
    }

    show () {
        this._isClosing = false;
        this.node.active = true;
        this.bg.scale = 0.75;
        let bgDarkOpa = 150;
        if (this.name === 'FreeChipsNode' || this.name === 'PiggySave') {
            bgDarkOpa = 220;
        }
        if (this.darkBg) {
            this.darkBg.runAction(cc.fadeTo(0.25, bgDarkOpa));
        }

        this.bg.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.25, 1).easing(cc.easeBackOut()), cc.fadeIn(0.25)), cc.callFunc(this.finishAnimation.bind(this))));
    }

    fadeIn() {
        this._isClosing = false;
        this.node.opacity = 0;
        this.node.active = true;

        if (this.darkBg) {
            this.darkBg.runAction(cc.fadeTo(0.25, 150));
        }

        this.node && this.node.runAction(cc.sequence(cc.fadeIn(0.25), cc.callFunc(this.finishAnimation.bind(this))));
    }

    fadeOut() {
        if (this.darkBg) {
            this.darkBg.runAction(cc.fadeOut(0.25));
        }

        this.node.runAction(cc.sequence(cc.fadeOut(0.25), cc.callFunc(() => {
            this.onCloseDone(true)
        })));
    }

    showSlide (isRightSide) {
        this._isRightSide = isRightSide;
        this._isClosing = false;
        this.node.active = true;
        let tagetX = this.bg.x;
        this.bg.x = isRightSide ? (tagetX + this.bg.width) : (tagetX - this.bg.width);
        this.bg.active = true;
        if (this.darkBg) {
            this.darkBg.runAction(cc.fadeTo(0.25, 150));
        }

        cc.tween(this.bg)
            .to(0.25, { x: tagetX }, { easing: 'backOut' })
            .call(() => this.finishAnimation())
            .start();
    }

    finishAnimation () {
        // if(this._gameLayer) {
        //     this._gameLayer.basePopUpActive = null;
        // }
    }

    onClose (isDestroy = true) {
        if (this._isClosing)
            return;
        this._isClosing = true;

        if (this.darkBg && this.darkBg.active) {
            this.darkBg.runAction(cc.fadeTo(0.15, 0));
        }

        if (this.bg) {
            this.bg.runAction(cc.spawn(cc.scaleTo(0.15, 0.75), cc.fadeOut(0.15)));
        }

        this.node && this.node.runAction(cc.sequence(cc.delayTime(0.15), cc.callFunc(this.onCloseDone.bind(this, isDestroy))));
    }

    onSlideClose () {
        if (this._isClosing)
            return;
        this._isClosing = true;

        if (this.darkBg && this.darkBg.active) {
            this.darkBg.runAction(cc.fadeTo(0.15, 0));
        }
        let tagetX;
        this._isRightSide ? tagetX = (this.bg.x + this.bg.width) : tagetX = (this.bg.x - this.bg.width);

        if (this.bg) {
            cc.tween(this.bg)
                .to(0.25, { x: tagetX }, { easing: 'backIn' })
                .start();

            this.node.runAction(cc.sequence(cc.delayTime(0.15), cc.callFunc(this.onCloseDone.bind(this))));
        }
    }

    onCloseDone (isDestroy?: boolean) {
        this.scheduleOnce(() => {
            if (!isDestroy) {
                this.node.removeFromParent(false);
            }
            else {
                this.node.destroy();
            };
        }, 0.1)
    }
 }