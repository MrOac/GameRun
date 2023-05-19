


// enum GROUP_CARD_NAME {
//     NONE = 0,
//     SAP = 1, 
//      SHAN = 2, 
// }
export default class CARD_RANK {

    private _className: string;
    private _value: any;

    static ACE_ALIAS = new CARD_RANK(1);
    static TWO = new CARD_RANK(2);
    static THREE = new CARD_RANK(3);
    static FOUR = new CARD_RANK(4);
    static FIVE = new CARD_RANK(5);
    static SIX = new CARD_RANK(6);
    static SEVEN = new CARD_RANK(7);
    static EIGHT = new CARD_RANK(8);
    static NINE = new CARD_RANK(9);
    static TEN = new CARD_RANK(10);
    static JACK = new CARD_RANK(11);
    static QUEEN = new CARD_RANK(12);
    static KING = new CARD_RANK(13);
    static ACE = new CARD_RANK(14);

    static ALL = {
        2: CARD_RANK.TWO,
        3: CARD_RANK.THREE,
        4: CARD_RANK.FOUR,
        5: CARD_RANK.FIVE,
        6: CARD_RANK.SIX,
        7: CARD_RANK.SEVEN,
        8: CARD_RANK.EIGHT,
        9: CARD_RANK.NINE,
        10: CARD_RANK.TEN,
        11: CARD_RANK.JACK,
        12: CARD_RANK.QUEEN,
        13: CARD_RANK.KING,
        14: CARD_RANK.ACE
    }
    constructor(value) {
        this.setValue("CARD_RANK", value)
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