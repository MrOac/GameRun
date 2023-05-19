import GameController from "../Shan.GameController";
import Chip from "./Shan.Chip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChipGroup extends cc.Component {
    @property(cc.Prefab)
    prefabChip: cc.Prefab = null;

    numChip: number = 0;
    totalBet: number = 0;
    minChipType: number = 0;
    maxChipType: number = 0;
    selectChanel: number = 0;
    roomBet: number = 0;
    timeReset: number = 0;
    maxSaveReset: number = 0;
    listChipShow: any[] = [];
    listChipWait: any[] = [];
    timeChipReset: number;
    gameLayer: any;

    static VALUE_CHIPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000,  //12
        10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, //24
        100000000, 200000000, 500000000]; //32
    static LEVEL_CHIP_BETS = [9, 9, 12, 18, 21];
    //////ti le cho hien thi chip bet bieu tuong
    static MAX_MINI_BET = [10, 20, 40, 70, 100, 150];
    static RATE_MINI_BET = [2, 2, 4, 6, 6, 10];
    ////////
    static RATE_X_CHIP_IN = 200;
    static RATE_Y_CHIP_IN = 100;
    static delta_RATE_Y_NO_DEALER = 0;//dich vi tri len khi khong co hien pot (thay doi)
    static RATE_ROTATE_CHIP = 60;
    static RATE_X_CHIP_OUT = 50;
    static RATE_Y_CHIP_OUT = 100;
    static DELAY_ACTION_EACH_CHIP = 0.4;
    static TIME_FADE_CHIP = 0.2;
    static TIME_MOVE_CHIP = 0.5;
    static TIME_MOVE_CHIP_OUT = 0.45;
    static TIME_FADE_OUT = 0.2;

    static DELTA_X_CHIP = 0; //vi tri tap trung chip so voi trung tam
    static DELTA_Y_CHIP = 25; //vi tri tap trung chip so voi trung tam
    static delta_Y_NO_DEALER = 0;//dich vi tri len khi khong co hien pot (thay doi)

    static NUM_CHIP_CIRCLE = 6;
    static NUM_CHIP_RECT = 7;
    static NUM_CHIP_SPEC = 3;
    static MAX_NUM_CHIP = 10;
    constructor() {
        super();
        this.timeChipReset = cc.sys.now();
    }
    onLoad() {
        for (var i = 0; i < ChipGroup.VALUE_CHIPS.length; i++) {
            this.listChipShow.push([]);
        }
    }

    initChip(gameLayer, roomBet) {
        this.roomBet = roomBet;
        this.gameLayer = gameLayer;
        //this.selectChanel = 0;
        this.minChipType = ChipGroup.LEVEL_CHIP_BETS[this.selectChanel];
        this.maxChipType = this.minChipType + ChipGroup.NUM_CHIP_CIRCLE + ChipGroup.NUM_CHIP_RECT;
    }

    getTotalBet() {
        return this.totalBet;
    }

    reset() {
        // this.node.active = false;
        var waitNodes = this.node.children;
        this.listChipWait = [];
        for (var i = 0; i < ChipGroup.VALUE_CHIPS.length; i++) {
            this.listChipShow[i] = [];
        }
        for (var i = 0; i < waitNodes.length; i++) {
            waitNodes[i].active = false;
            this.listChipWait.push(waitNodes[i].getComponent(Chip));
        }
        //xu ly cho xoa bot chip khong su dung
        if (this.maxSaveReset > this.listChipWait.length) {
            this.timeReset++;
        }
        if (this.timeReset > 5) {
            var len = Math.ceil((this.listChipWait.length - this.maxSaveReset) / 5);
            // cc.log("reset remove Child: " + len);
            if (len <= 0) {
                this.timeReset = 0;
            }
            for (var i = 0; i < len; i++)
                this.node.removeChild(this.listChipWait.pop());
        }
        //////

        this.numChip = 0;
        this.totalBet = 0;
        this.timeChipReset = (new Date()).getTime();
        this.updatePotMoney();
    }

    updatePotMoney() {
        // if (this.gameLayer)
            GameController.instance.pot.setValue(this.totalBet);
    }

    playerBet(player, bet, isBanker) {
        // cc.log("playerBet player " + player.getChair() + " Bet " + bet);
        var pos = player.node.getPosition();

        var arrChip = this.getArrChipFromMoney(bet, isBanker);
        this.addChipToGroup(arrChip, pos);
        this.totalBet += bet;
    }

    distributeMoney(players) {
        // cc.log("distributeMoney", players);
        // var i, p;
        var valueC, isLoop = true, listC;

        for (let i = ChipGroup.VALUE_CHIPS.length - 1; i >= 0; i--) {
            listC = this.listChipShow[i];
            if (listC.length <= 0)
                continue;
            valueC = ChipGroup.VALUE_CHIPS[i];
            isLoop = true;
            while (isLoop) {    //so chip tren cung chia deu cho cac user
                isLoop = false;
                for (var j = 0; j < players.length; j++) {
                    let p = players[j];
                    if (p.goldOut >= valueC) {
                        if (listC.length <= 0) {
                            isLoop = false;
                            break;
                        }
                        // cc.log("valueC", p.isBanker, valueC);
                        p.arrC.push(listC.pop());
                        p.goldOut -= valueC;
                        isLoop = true;
                    }
                }
            }
        }

        players = this.addArrChipSecond(players);

        var maxTime = 0;
        for (let i = 0; i < players.length; i++) {
            let p = players[i];
            if (p.delay > maxTime)
                maxTime = p.delay;
            this.node.runAction(cc.sequence(
                cc.delayTime(p.delay),  //thoi gian delay tra tien theo thu tu thang
                cc.callFunc( ()=> {
                    this.payPlayer(p);
                })
            ));
        }
        this.node.runAction(cc.sequence(
            cc.delayTime(maxTime + 0.1),  //thoi gian delay tra tien theo thu tu thang
            cc.callFunc(function () {
                GameController.instance.pot.setValue( GameController.instance.bankerPot);
            }, this)
        ));
        //ghi lai du lieu dung chip
        if (this.numChip > this.maxSaveReset)
            this.maxSaveReset = this.numChip;
    }

    addArrChipSecond(players) {  //nhung chip con hien thi ma khong duoc su dung se duoc thu hoi lai
        var valueC;
        var valueMin = 0;
        var numCN = 0;
        var listCWait = [];
        var xNew = 0, yNew = 0;
        // lay lai toan bo nhung chip khong duoc su dung
        for (var i = ChipGroup.VALUE_CHIPS.length - 1; i >= 0; i--) {
            let len = this.listChipShow[i].length;
            for (var j = 0; j < len; j++) {
                listCWait.push(this.listChipShow[i].pop());
            }
        }
        var zOrder = Math.floor(((new Date()).getTime() - this.timeChipReset) / 1000);
        //add them chip con thieu cho player
        for (var j = 0; j < players.length; j++) {
            for (var i = ChipGroup.VALUE_CHIPS.length - 1; i >= 0; i--) {
                valueC = ChipGroup.VALUE_CHIPS[i];
                var p = players[j];
                if (p.goldOut <= valueMin)
                    break;    //doan bo di nhung chip qua nho
                else if (p.goldOut >= valueC) {
                    numCN = Math.floor(p.goldOut / valueC);
                    for (var k = 0; k < numCN; k++) {
                        if (listCWait.length > 0) {     //Lay ra tu list chip khong dung
                            var c = listCWait.pop();
                            c = this.getChip(i, c);
                            c.node.zIndex = zOrder;
                            p.arrC.push(c);
                        }
                        else {
                            var c = this.getChip(i);
                            c.node.zIndex = zOrder;         // tao chip moi neu thieu
                            xNew = ChipGroup.DELTA_X_CHIP + (Math.random() - 0.5) * ChipGroup.RATE_X_CHIP_IN;
                            yNew = ChipGroup.DELTA_Y_CHIP + ChipGroup.delta_Y_NO_DEALER + (Math.random() - 0.5) * (ChipGroup.RATE_Y_CHIP_IN + ChipGroup.delta_RATE_Y_NO_DEALER);
                            c.node.setPosition(cc.v2(xNew, yNew));
                            c.node.angle = (Math.random() - 0.5) * ChipGroup.RATE_ROTATE_CHIP;
                            p.arrC.push(c);
                        }
                    }
                    p.goldOut -= valueC * numCN;
                }
            }
        }
        //an nhung chip khong duoc su dung dua vao hang doi
        let len = listCWait.length;
        for (var i = 0; i < len; i++) {
            var c = listCWait[i];
            this.listChipWait.push(c);
            this.numChip--;
            c.node.active = false;
        }
        return players;
    }

    payPlayer(pInfo) {
        // cc.log("payPlayer: ", pInfo);
        if (pInfo.isBanker) {
            for (var i = 0; i < pInfo.arrC.length; i++) {
                var c = pInfo.arrC[i];
                this.listChipShow[c.type].push(c);
            }
            return;     //giu nguyen chip nha cai tren ban
        }
        var pos = pInfo.player.node.getPosition();
        var dTime = 0;
        var iTime = 0.1;
        if (pInfo.arrC.length > 4)
            iTime = ChipGroup.DELAY_ACTION_EACH_CHIP / pInfo.arrC.length;
        for (var i = 0; i < pInfo.arrC.length; i++) {
            dTime = iTime * i;
            var c = pInfo.arrC[i];
            if (c.node.active) {
                this.playActionChipOut(pInfo.arrC[i], pos, dTime);
                c.node.runAction(cc.sequence(cc.delayTime(ChipGroup.DELAY_ACTION_EACH_CHIP + 0.2), cc.fadeOut(ChipGroup.TIME_FADE_OUT)));
            }
            else {
                this.listChipWait.push(c);
                this.numChip--;
            }
        }
        this.totalBet -= pInfo.goldOutRaw;
        this.updatePotMoney();
        pInfo.player.hideBet();
        pInfo.player.moneyChange(pInfo.goldChange, pInfo.goldFinal, false);

        return dTime;
    }

    //gom tien ve cho nha cai
    collectGold(player) {
        var pos = player.node.getPosition();
        var iTime = 0.1;
        if (this.numChip > 4)
            iTime = ChipGroup.DELAY_ACTION_EACH_CHIP / this.numChip;
        var num = 0;
        for (var i = 0; i < ChipGroup.VALUE_CHIPS.length; i++) {
            var len = this.listChipShow[i].length;
            for (var j = 0; j < len; j++) {
                var c = this.listChipShow[i].pop();
                this.playActionChipOut(c, pos, iTime * num);
                c.node.runAction(cc.sequence(cc.delayTime(ChipGroup.DELAY_ACTION_EACH_CHIP + 0.2), cc.fadeOut(ChipGroup.TIME_FADE_OUT)));
                num++;
            }
        }
        this.reset();
    }

    playActionChipOut(chip, pos, dTime) {
        var xNew = pos.x + (Math.random() - 0.5) * ChipGroup.RATE_X_CHIP_OUT;
        var yNew = pos.y + (Math.random() - 0.5) * ChipGroup.RATE_Y_CHIP_OUT;
        var actionMove = cc.moveTo(ChipGroup.TIME_MOVE_CHIP_OUT, cc.v2(xNew, yNew)).easing(cc.easeQuadraticActionInOut());
        chip.node.stopAllActions();
        chip.node.runAction(cc.sequence(cc.delayTime(dTime), actionMove));
        this.listChipWait.push(chip);
        this.numChip--;
    }

    addChipToGroup(arrChip, pos, dTime?: number) {
        var typeI, numI, chip, listC;
        var numCN = 0;
        if (!dTime) dTime = 0;
        var totalChip = arrChip.length;
        var rateTime = ChipGroup.DELAY_ACTION_EACH_CHIP / totalChip;
        for (var i = arrChip.length - 1; i >= 0; i--) {

            typeI = arrChip[i];
            listC = this.listChipShow[typeI];

            chip = this.getChip(typeI);
            listC.push(chip);
            dTime += rateTime;
            this.playActionChipIn(chip, pos, dTime);
            numCN++;
        }
        this.node.runAction(cc.sequence(cc.delayTime(dTime + 1.5), cc.callFunc(this.updatePotMoney, this)));
    }

    //add chip vo khi cho view va reconnect
    addChipForView(arrChip) {
        // cc.log("addChipForView: " + JSON.stringify(arrChip));
        var typeI, numI, chip, listC;
        var zOder = Math.floor(((new Date()).getTime() - this.timeChipReset) / 1000);
        for (var i = arrChip.length - 1; i >= 0; i--) {
            numI = arrChip[i];
            // i--;
            typeI = arrChip[i];
            listC = this.listChipShow[typeI];
            this.totalBet += ChipGroup.VALUE_CHIPS[typeI];

            chip = this.getChip(typeI);
            chip.node.zIndex = zOder;
            listC.push(chip);
            var xNew = ChipGroup.DELTA_X_CHIP + (Math.random() - 0.5) * ChipGroup.RATE_X_CHIP_IN;
            var yNew = ChipGroup.DELTA_Y_CHIP + ChipGroup.delta_Y_NO_DEALER + (Math.random() - 0.5) * (ChipGroup.RATE_Y_CHIP_IN + ChipGroup.delta_RATE_Y_NO_DEALER);
            chip.node.setPosition(xNew, yNew);
            chip.node.angle = (Math.random() - 0.5) * ChipGroup.RATE_ROTATE_CHIP;
        }
    }

    getArrChipFromMoney(goldIn: number, isMany?: boolean) {
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
            let c = ChipGroup.VALUE_CHIPS[i];
            for (var i = ChipGroup.VALUE_CHIPS.length - 1; i >= 0; i--) {
                if (total >= ChipGroup.VALUE_CHIPS[i]) {
                    arr.push(i);
                    c = ChipGroup.VALUE_CHIPS[i];
                    break;
                }
            }
            total -= c;
        }
        return arr;
    }

    playActionChipIn(chip: any, pos: cc.Vec2, dTime: number) {
        var xNew = pos.x + (Math.random() - 0.5) * ChipGroup.RATE_X_CHIP_OUT;
        var yNew = pos.y + (Math.random() - 0.5) * ChipGroup.RATE_Y_CHIP_OUT;
        chip.node.setPosition(cc.v2(xNew, yNew));
        chip.opacity = 0;
        chip.angle = 0;
        chip.skewX = Math.random() * 0.05 + 0.95;
        chip.skewY = Math.random() * 0.05 + 0.95;
        xNew = ChipGroup.DELTA_X_CHIP + (Math.random() - 0.5) * ChipGroup.RATE_X_CHIP_IN;
        yNew = ChipGroup.DELTA_Y_CHIP + ChipGroup.delta_Y_NO_DEALER + (Math.random() - 0.5) * (ChipGroup.RATE_Y_CHIP_IN + ChipGroup.delta_RATE_Y_NO_DEALER);
        var delX = (xNew - pos.x);
        var delY = (yNew - pos.y);
        var rate = Math.abs(delX) / (Math.abs(delX) + Math.abs(delY));
        var valueRotate = (Math.random() - 0.5) * ChipGroup.RATE_ROTATE_CHIP;
        delX = (delX > 0 ? 15 : -15) * rate;
        delY = (delY > 0 ? 15 : -15) * (1 - rate);
        xNew -= delX;
        yNew -= delY;
        var xBetween = (xNew + pos.x) * 0.5;
        var yBetween = (yNew + pos.y) * 0.5 + 50;
        var actionFade = cc.fadeIn(ChipGroup.TIME_FADE_CHIP);
        var arrPos = [chip.node.getPosition(), cc.v2(xBetween, yBetween), cc.v2(xNew, yNew)];
        var actionMove = cc.bezierTo(ChipGroup.TIME_MOVE_CHIP, arrPos).easing(cc.easeBezierAction(0, 0.75, 0.9, 1));
        var actionRotate = cc.rotateTo(ChipGroup.TIME_MOVE_CHIP, valueRotate * 0.6).easing(cc.easeOut(1));
        var actionRotateAfter = cc.rotateTo(0.2, valueRotate).easing(cc.easeOut(1));
        var actionJump = cc.jumpBy(0.2, delX, delY, 2, 1);
        var sx = chip.node.scale;
        var actionScale = cc.sequence(
            cc.scaleTo(ChipGroup.TIME_MOVE_CHIP / 2, sx * 1.1, sx * 1.1).easing(cc.easeOut(1)),
            cc.scaleTo(ChipGroup.TIME_MOVE_CHIP / 2, sx, sx).easing(cc.easeIn(1)));
        var callZOder = cc.callFunc(function (sender, chip) {
            chip.node.zIndex = Math.floor(((new Date()).getTime() - this.timeChipReset) / 1000);
        }, this, chip);
        var action1 = cc.spawn(actionMove, actionRotate, actionFade, actionScale, callZOder);
        if (chip.getValue() >= 13) {
            chip.node.runAction(cc.sequence(cc.delayTime(dTime),
                action1, cc.spawn(actionJump, actionRotateAfter,
                    cc.callFunc(function () {
                        // TODO: check
                        // var star = new cc.Sprite("Particles/effectMoney.png");
                        // if (star) {
                        //     star.setPosition(84, 49);
                        //     star.setScale(0);
                        //     this.addChild(star);
                        //     star.runAction(cc.sequence(cc.spawn(
                        //             cc.rotateBy(0.6, 120),
                        //             cc.sequence(cc.scaleTo(0.3, 1.5).easing(cc.easeOut(1)), cc.scaleTo(0.3, 0).easing(cc.easeIn(1)))
                        //         ),
                        //         cc.removeSelf()));
                        // }
                    }, chip))
            ));
        }
        else {
            chip.node.runAction(cc.sequence(cc.delayTime(dTime),
                action1, cc.spawn(actionJump, actionRotateAfter)));
        }
    }

    //fix lai chip hien thi cho dung so pot
    fixChipGroup(gold) {
        // cc.log("fixChipGroup: " + gold);
        if (gold == this.totalBet || gold <= 0) return;
        var delta = gold - this.totalBet;
        //thua chip
        if (delta < 0) {
            delta = -delta;
            var listC, valueC;
            var arrC = [];
            //tru di chip lon nhat
            for (var i = ChipGroup.VALUE_CHIPS.length - 1; i >= 0; i--) {
                listC = this.listChipShow[i];
                if (listC.length <= 0) continue;
                valueC = ChipGroup.VALUE_CHIPS[i];
                while (delta >= valueC && listC.length > 0) {
                    arrC.push(listC.pop());
                    delta -= valueC
                }
                if (delta == 0) break;
            }
            //neu chua dung thi tim chip nho nhat de phan giai
            var isEmpty = false;
            while (delta > 0 && !isEmpty) {
                isEmpty = true;
                for (var i = 0; i < ChipGroup.VALUE_CHIPS.length; i++) {
                    listC = this.listChipShow[i];
                    if (listC.length <= 0) continue;
                    isEmpty = false;
                    valueC = ChipGroup.VALUE_CHIPS[i];
                    if (valueC >= delta) {
                        arrC.push(listC.pop());
                        delta -= valueC
                    }
                    if (delta <= 0) break;
                }
            }
            var len = arrC.length
            for (var i = 0; i < len; i++) {
                valueC = arrC.pop();
                valueC.node.active = false;
                this.listChipWait.push(valueC);
            }
            this.totalBet = gold + delta;
            //neu phan giai chip thi add chip lai
            if (delta < 0) this.fixChipGroup(this.totalBet - delta);
        }
        else {
            var arr = this.getArrChipFromMoney(delta);
            this.addChipForView(arr);
        }
    }

    getTotalValueChips() {
        var arr = [];
        for (var i = 0; i < ChipGroup.VALUE_CHIPS.length; i++) {
            var len = this.listChipShow[i].length;
            if (len > 0) {
                arr.push(len);
                arr.push(ChipGroup.VALUE_CHIPS[i]);
            }
        }
        // cc.log("getTotalValueChips:" + JSON.stringify(arr) + " - child: " + this.node.childrenCount + " - wait " + this.listChipWait.length);
    }

    getChip(type, chip?) {
        var gold = ChipGroup.VALUE_CHIPS[type];

        if (chip || this.listChipWait.length > 0) {
            if (!chip)
                chip = this.listChipWait.pop();
            chip.node.stopAllActions();
            chip.node.active = true;
        } else {
            chip = cc.instantiate(this.prefabChip).getComponent(Chip);
            chip.node.scale = 0.72;
            this.node.addChild(chip.node);
        }
        chip.setValues(gold);
        chip.type = type;

        return chip;
    }
}
