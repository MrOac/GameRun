


// enum GROUP_CARD_NAME {
//     NONE = 0,
//     SAP = 1, 
//      SHAN = 2, 
// }
export default class CARD_SUIT {

    private _className: string;
    private _value: any;

    static SPADE = new CARD_SUIT(0);
    static CLUB = new CARD_SUIT(1);
    static DIAMOND = new CARD_SUIT(2);
    static HEART = new CARD_SUIT(3);

    static ALL = {
        0: CARD_SUIT.SPADE,
        1: CARD_SUIT.CLUB,
        2: CARD_SUIT.DIAMOND,
        3: CARD_SUIT.HEART
    }
    constructor(value) {
        this.setValue("CARD_SUIT", value)
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