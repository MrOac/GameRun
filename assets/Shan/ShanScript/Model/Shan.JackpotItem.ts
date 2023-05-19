import ShanUtils, { NumberUtils, StringUtils } from "../common/Shan.Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotItem extends cc.Component {
    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Label)
    lbChip: cc.Label = null;
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Label)
    lbBet: cc.Label = null;
    updateUi(data) {
        this.lbName.string = StringUtils.shorten(data.userName, 13);
        this.lbChip.string =NumberUtils.format(data.amount);
        // this.lbTime.string = moment(data.time).format('HH:mm:ss') + '\n' + moment(data.time).format('DD-MM-YYYY');
        this.lbBet.string =NumberUtils.format(data.bet);
    }
}