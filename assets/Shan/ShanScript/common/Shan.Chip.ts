const {ccclass, property} = cc._decorator;
const VALUE_CHIPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000,  //12
    10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, //24
    100000000, 200000000, 500000000]; //32
@ccclass
export default class  Chip extends cc.Component {
    @property(cc.SpriteAtlas)
    alasImage: cc.SpriteAtlas = null;
    @property(cc.SpriteFrame)
    imgs: cc.SpriteFrame[] = [];
    _value: number = 10;
    _userId: number = 0;
    userData: any;
    constructor() {
        super();
        this._value = 10;
        this._userId = 0;
    }
    setValue (value, amount) {
        // cc.log("chip set value", value, amount);
        this._value = (value == null || value < 1) ? 1 : value;

        let valueC = VALUE_CHIPS[VALUE_CHIPS.length - 1];
        for (let i = VALUE_CHIPS.length - 1; i >= 0; i--) {
            if (VALUE_CHIPS[i] < amount) {
                break;
            }
            else {
                valueC = VALUE_CHIPS[i];
            }
        }

        if (value) {
            // this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.js.formatStr("chip/%s.png", valueC.toString()));
            this.node.getComponent(cc.Sprite).spriteFrame = this.alasImage.getSpriteFrame(valueC.toString());
        }
    }

    setValues (value) {
        // cc.log("chip set value", value);
        this._value = (value == null || value < 1) ? 1 : value;

        let valueC = VALUE_CHIPS[VALUE_CHIPS.length - 1];
        for (let i = VALUE_CHIPS.length - 1; i >= 0; i--) {
            if (VALUE_CHIPS[i] < value) {
                break;
            }
            else {
                valueC = VALUE_CHIPS[i];
            }
        }

        if (value) {
            // this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.js.formatStr("chip/%s.png", valueC.toString()));
            this.node.getComponent(cc.Sprite).spriteFrame = this.alasImage.getSpriteFrame(valueC.toString());
        }
    }

    setOwnUserId(userId) {
        this._userId = userId;
    }

    getOwnUserId() {
        return this._userId;
    }

    updateChipTexture(value) {
        this._value = (value == null || value < 1) ? 1 : value;

        let valueC = VALUE_CHIPS[VALUE_CHIPS.length - 1];
        for (let i = VALUE_CHIPS.length - 1; i >= 0; i--) {
            if (VALUE_CHIPS[i] < value) {
                break;
            }
            else {
                valueC = VALUE_CHIPS[i];
            }
        }
        // this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.js.formatStr("chip/%s.png", valueC.toString()));
        this.node.getComponent(cc.Sprite).spriteFrame = this.alasImage.getSpriteFrame(valueC.toString());
    }

    jumpTo (pos:cc.Vec2, box: cc.Rect, actions) {
        if (!box)
            box = cc.rect(-70, -40, 140, 80)
        var addedPos = cc.v2(box.x + Math.random() * box.width, box.y + Math.random() * box.height)

        pos = pos.add(addedPos)

        var distance = pos.sub(this.node.getPosition());
        var direction = distance.normalize();
        var length = distance.mag();
        var normal: cc.Vec2 = cc.v2(direction).rotate(-90 * Math.PI / 180);
        if (normal.y < 0)
            normal = normal.neg();
        if (normal.y < Math.abs(normal.x))
            normal.x = Math.min(Math.max(normal.x, -normal.y), normal.y);

        var bezierPos = pos.add(direction.mul(length * -0.03))
        var curveMidpoint = this.node.getPosition().add(bezierPos).mul(0.5).add(normal.mul(length * this.randomIn(0.1, 0.2)));
        var nextJumpHeight = length * 0.01
        // cc.log(this.getPosition(), curveMidpoint, pos)

        var arr = [
            cc.delayTime(this.randomIn(0, 0.2)),
            cc.bezierTo(0.3, [this.node.getPosition(), curveMidpoint, bezierPos]),
            cc.jumpTo(0.2, pos, nextJumpHeight, 1)
        ].concat(actions || [])

        this.node.runAction(cc.sequence(arr))
    }
    randomIn(x: number, y: number) {
        return x +Math.random()*(y-x)
    }

    moveTo (delay, pos, actions) {
        var distance = pos.sub(this.node.getPosition());
        var direction = distance.normalize();
        var length = distance.mag()
        var normal = cc.v2(direction).rotate(-90 * Math.PI / 180);
        if (normal.y < 0)
            normal = normal.neg();
        if (normal.y < Math.abs(normal.x))
            normal.x = Math.min(Math.max(normal.x, -normal.y), normal.y);

        var curveMidpoint = this.node.getPosition().add(pos).mul(0.5).add(normal.mul(length * this.randomIn(0.1, 0.2)));

        var arr = [
            cc.delayTime(delay),
            cc.delayTime(this.randomIn(0, 0.2)),
            cc.show(),
            cc.bezierTo(0.3, [this.node.getPosition(), curveMidpoint, pos]),
        ].concat(actions || [])

        this.node.runAction(cc.sequence(arr))
    }

    getValue () {
        return this._value;
    }

    setTargetPos (pos) {
        var userData = this.userData || {};
        userData.targetPos = pos;
        this.setUserData(userData);
    }

    setUserData (userData) {
        this.userData = userData;
    }

    getTargetPos () {
        var userData = this.userData || {};
        return userData.targetPos || this.node.getPosition();
    }

    stopAllActions () {
        cc.Node.prototype.stopAllActions.call(this);

        this.node.setPosition(this.getTargetPos());
    }
    
 }