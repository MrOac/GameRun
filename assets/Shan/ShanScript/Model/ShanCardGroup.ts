import Card from "../common/Shan.Card";
import { getRank, getSuit } from "../common/Shan.Utils";
import CARD_RANK from "./Shan.CardRank";
import GROUP_CARD_NAME from "./ShanCardGroupName";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardGroup {
    _cards: Card[];
    private _groupName: GROUP_CARD_NAME;
    private _groupPoint: number;
    private _multiple: number;


    
    setCards(cards) {
        // cards[0].setId(5)
        // cards[1].setId(6)
        // cards[2].setId(7)

        // cards.forEach(function(c) { c.setDirty(true) })

        this._cards = cards.slice(0, 3).sort(function(a, b) { return b.getId() - a.getId() });

        // cc.log(this._cards);

        this._groupName = GROUP_CARD_NAME.NONE;
        this._groupPoint = this._cards.reduce(function(sum, card) { 
            var r = card.getRank() || -1;
            if (r.valueOf() == CARD_RANK.ACE.valueOf())
                return sum + 1;

            if (r.valueOf() > CARD_RANK.TEN.valueOf())
                return sum;

            return sum + r.valueOf()
        }, 0) % 10

        if(this._checkHeads()) {
            this._groupPoint = 10;
        }

        if (this._checkShan())
            this._groupName = GROUP_CARD_NAME.SHAN;
        else if (this._checkSap()) 
            this._groupName = GROUP_CARD_NAME.SAP;

        this._multiple = this._checkMultiple();
    }

    getGroupName() {
        return this._groupName;
    }

    getPoint() {
        return this._groupPoint;
    }

    getMultiple() {
        return this._multiple;
    }

    _checkShan() {
        if (this._cards.length > 2) return false;
        return this._groupPoint >= 8;
    }

    _checkSap() {
        if (this._cards.length != 3) return false;
        
        for (var i = 0; i < this._cards.length-1; i++) {
            if (this._cards[i].getRank().valueOf() != this._cards[i+1].getRank().valueOf())
                return false;
        }
        return true;
    }

    _checkHeads() {
        if (this._cards.length != 3) return false;
        
        for (var i = 0; i < this._cards.length; i++) {
            if (this._cards[i].getId() < 36 || this._cards[i].getId() > 47)
                return false;
        }
        return true;
    }

    _checkMultiple() {
        
        let _countR = 1;
        let _countS = 1;

        for (var i = 0; i < this._cards.length-1; i++) {
            if (this._cards[i].getRank().valueOf() === this._cards[i+1].getRank().valueOf())
                _countR += 1;
            if (this._cards[i].getSuit().valueOf() === this._cards[i+1].getSuit().valueOf())
                _countS += 1;
        }

        // cc.log('_checkMultiple ' + _countR + ',' + _countS + ' this._cards.length: ' + this._cards.length);
        if(_countR === this._cards.length && _countR === 2) {
            return 2
        }

        if(_countR === this._cards.length && _countR === 3) {
            return 5
        }

        if(_countS === this._cards.length) {
            return _countS
        } 

        if(this._checkHeads()) {
            return 3;
        }

        return 1;
    }
}

