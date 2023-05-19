


// enum GROUP_CARD_NAME {
//     NONE = 0,
//     SAP = 1, 
//      SHAN = 2, 
// }
export default class GROUP_CARD_NAME {

    static NONE = new GROUP_CARD_NAME(0);
    static SAP = new GROUP_CARD_NAME(1);
    static SHAN = new GROUP_CARD_NAME(2);
    static ALL = {
        0: GROUP_CARD_NAME.NONE,
        1: GROUP_CARD_NAME.SAP,
        2: GROUP_CARD_NAME.SHAN
    }

    private _className: string;
    private _value: any;
    constructor(value) {
        this.setValue("Shan.GROUP_CARD_NAME", value)
    }
    setValue(className, value) {
        this._className = className;
        this._value = value;
    }

    valueOf() {
        return this._value;
    }

    toString() {
        return this._className + "." + this._value;
    }
    
        
}