// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pot extends cc.Component {

    @property(cc.Label)
    digits: cc.Label[] = [];
    @property(cc.Label)
    unit: cc.Label = null;

    _value: number = 0;
    constructor() {
        super();
        this._value = 0;
    }

    setValue(amount: number) {
        let tempValue = this._value;
        this._value = amount;
        this.updateUi(amount);
    }

    updateUi(amount: number) {
        if(this.unit) {
            if (amount >= 10e6) {
                amount /= 1000;
                this.unit.node.active = true;
                this.unit.string = "K";
            } else {
                this.unit.node.active = false;
            }
        }
        
        var i = 0;
        while (amount > 0) {
            this.digits[i].string = (amount % 10)+"";
            amount = Math.floor(amount / 10);
            i++;
        }
        while (i < this.digits.length) {
            this.digits[i].string = "0";
            i++;
        }
    }

    getValue() {
        return this._value;
    }
}
