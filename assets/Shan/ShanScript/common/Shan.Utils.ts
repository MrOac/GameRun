import Configs from "../../../Loading/src/Configs";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import CARD_RANK from "../Model/Shan.CardRank";
import CARD_SUIT from "../Model/Shan.CardSuit";

const VALUE_CHIPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000,  //12
    10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, //24
    100000000, 200000000, 500000000]; //32
export function getArrChipFromMoney(goldIn, isMany?: boolean) {
    if (isMany) {
        let arrayC1 = this.getArrChipFromMoney(Math.floor(goldIn / 5), false);
        let arrayC2 = this.getArrChipFromMoney(Math.floor(goldIn / 5), false);
        let arrayC3 = this.getArrChipFromMoney(Math.floor(goldIn / 5), false);
        let arrayC4 = this.getArrChipFromMoney(Math.floor(goldIn / 5), false);
        let arrayC5 = this.getArrChipFromMoney(goldIn - 4 * Math.floor(goldIn / 5), false);

        return arrayC1
            .concat(arrayC2)
            .concat(arrayC3)
            .concat(arrayC4)
            .concat(arrayC5);
    }

    let total = goldIn;

    let arr = [];
    while (total > 0) {
        let c = VALUE_CHIPS[i];
        for (var i = VALUE_CHIPS.length - 1; i >= 0; i--) {
            if (total >= VALUE_CHIPS[i]) {
                arr.push(VALUE_CHIPS[i]);
                c = VALUE_CHIPS[i];
                break;
            }
        }
        total -= c;
    }
    return arr;
}
export function getRank(cardid) {
    return CARD_RANK.ALL[Math.floor(cardid / 4) + 2];
}
export function getSuit(cardid) {
    return CARD_SUIT.ALL[cardid % 4];
}
export function setTextureFromRes(sprite: cc.Sprite, res) {
    cc.assetManager.getBundle("Shan").load(res, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
        if (err) {
            cc.error(err.message)
            return
        }
        try {
            sprite.spriteFrame = spriteFrame;
        } catch (e) {
            console.error(e);
        }
    });
    // sprite.spriteFrame  = App.instance.getAvatarSpriteFrame(res)
}
export function getAvatarPath(avatarId) {
    avatarId = parseInt(avatarId) || 0;
    avatarId = avatarId % 20 + 1;
    return "avatar/" + NumberUtils.pad(avatarId, 2);
}
export function shorten(value, digits) {
    var si = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9, symbol: "B" },
        { value: 1E6, symbol: "M" },
        { value: 1E3, symbol: "K" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
    for (i = 0; i < si.length; i++) {
        if (value >= si[i].value) {
            return (value / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        }
    }
    return value.toFixed(digits).replace(rx, "$1");
}
export function format(value: number, separator?) {
    separator = separator || '.'
    // return this.toLocaleString('vi')
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export default class ShanUtils {
    static getChip() {
        return Configs.Login.Coin;
    }
    static setChip(value) {
        Configs.Login.Coin = value;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }
    static formatWithArg(str, ...args) {
        let a = str;
        let b
        for (b in args) {
            a = a.replace(/%[a-z]/, args[b]);
        }
        return a; // Make chainable
    };
    static format(value: number, separator?) {
        separator = separator || '.'
        // return this.toLocaleString('vi')
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
    static shorten(value: number, digits) {
        var si = [
            { value: 1E18, symbol: "E" },
            { value: 1E15, symbol: "P" },
            { value: 1E12, symbol: "T" },
            { value: 1E9, symbol: "B" },
            { value: 1E6, symbol: "M" },
            { value: 1E3, symbol: "K" }
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
        for (i = 0; i < si.length; i++) {
            if (value >= si[i].value) {
                return (value / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
        return value.toFixed(digits).replace(rx, "$1");
    }
}
export class StringUtils {
    static shorten(v, l?, c?) {
        l = l || 12;
        c = c || '.';
        if (v.length > l)
            return v.substring(0, l) + "" + c + c;

        return v.slice()
    }
}
export class NumberUtils {
    static pad(v: number, size) {
        var s = String(v);
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }
    static format(value: number, separator?) {
        separator = separator || '.'
        // return this.toLocaleString('vi')
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
}