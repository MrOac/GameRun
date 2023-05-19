import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import SPUtils from "../Script/common/SPUtils";
import Http from "../../../Loading/src/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Tween from "../Script/common/Tween";
import { Global } from "../../../Loading/src/Global";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupCodaSms extends Dialog {
    static instance: PopupCodaSms = null;
    @property(cc.EditBox)
    edbConten: cc.EditBox = null;

    @property(cc.Node)
    liskPackage: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    detailBank: cc.Node = null;

    @property(cc.ScrollView)
    scrListGame: cc.ScrollView = null;
    totalHeightConten: number = 0;

    @property([cc.Button])
    btnTab: cc.Button[] = [];

    @property(cc.Node)
    btnBack: cc.Node = null;
    @property(cc.Label)
    lbPriceUsd: cc.Label = null;
    @property(cc.Label)
    lbPriceChip: cc.Label = null;
    saveChannelPayment: string = "";
    saveChannelPaymentTab: string = "";
    savePriceUsd: number;
    saveName: string;
    saveRateMoney: number;
    saveCodePack: number;

    private _listPaymentChannel = { METFONE: "Metfone", CELLCARD: "Cellcard", SMART: "Smart" }
    private _infoPaymentChannelMetfone = [];
    private _infoPaymentChannelCellcard = [];
    private _infoPaymentChannelSmart = [];

    protected onLoad(): void {
        PopupCodaSms.instance = this;
    }
    start() {
        for (let key in Global.ListPaymentChannel) {
            switch (key) {
                case this._listPaymentChannel.METFONE:
                    this._infoPaymentChannelMetfone.push(Global.ListPaymentChannel[key]);
                    break;
                case this._listPaymentChannel.CELLCARD:
                    this._infoPaymentChannelCellcard.push(Global.ListPaymentChannel[key]);
                    break;
                case this._listPaymentChannel.SMART:
                    this._infoPaymentChannelSmart.push(Global.ListPaymentChannel[key]);
                    break;
                default:
                    break;
            }
        }
        this.saveChannelPayment = this._listPaymentChannel.CELLCARD;
        this.saveChannelPaymentTab = this._listPaymentChannel.CELLCARD;
        this.showPaymentChannel(this._listPaymentChannel.CELLCARD);
        this.checkBtnTab();
        this.liskPackage.active = true;
        this.detailBank.active = false;
        this.btnBack.active = false;
        //App.instance.showLoading(true);
    }
    creatPack(infoPack: any[]): cc.Node[] {
        for (let i = 0; i < infoPack.length; i++) {
            let item = cc.instantiate(this.itemPrefab);
            const element = infoPack[i];
            this.totalHeightConten += item.height;
            this.content.addChild(item, i, element.name);
        }
        return this.content.children;
    }
    onScrollEvent() {
        this.scrListGame.stopAutoScroll();
        let upperLimit = this.scrListGame.content.y;
        let lowerLimit = (this.totalHeightConten / 2) + 100;
        if (upperLimit < 0) {
            this.scrListGame.scrollToTop();
        }
        if (upperLimit > lowerLimit) {
            this.scrListGame.content.y = lowerLimit;
        }
    }
    checkBtnTab(): void {
        let isCheck: boolean = false;
        let channels: any[] = [this._infoPaymentChannelMetfone, this._infoPaymentChannelCellcard, this._infoPaymentChannelSmart];
        let arrayChannelPayment = [this._listPaymentChannel.METFONE, this._listPaymentChannel.CELLCARD, this._listPaymentChannel.SMART];
        for (let i = 0; i < channels.length; i++) {
            const element = channels[i];
            if (element.length === 0) {
                this.btnTab[i].node.active = false;
            }
            if (isCheck === false && this.btnTab[i].node.active === true) {
                this.saveChannelPayment = arrayChannelPayment[i];
                this.saveChannelPaymentTab = arrayChannelPayment[i];
                this.showPaymentChannel(arrayChannelPayment[i]);
                isCheck = true;
            }
        }
    }
    showPaymentChannel(paymentChannel: string) {
        switch (paymentChannel) {
            case this._listPaymentChannel.METFONE:
                if (this._infoPaymentChannelMetfone.length === 0) {
                    this.content.removeAllChildren();
                } else {
                    this.content.removeAllChildren();
                    this.totalHeightConten = 0;
                    let packsMetfone = this.creatPack(this._infoPaymentChannelMetfone[0]);
                    let infoPaymentChannelMetfone = this._infoPaymentChannelMetfone[0];
                    for (let i = 0; i < packsMetfone.length; i++) {
                        const element = packsMetfone[i];
                        this.detailPack(element, infoPaymentChannelMetfone[i].priceChip, infoPaymentChannelMetfone[i].priceUsd);
                    }
                }
                break;
            case this._listPaymentChannel.CELLCARD:
                if (this._infoPaymentChannelCellcard.length === 0) {
                    this.content.removeAllChildren();
                } else {
                    this.content.removeAllChildren();
                    this.totalHeightConten = 0;
                    let packsCellcard = this.creatPack(this._infoPaymentChannelCellcard[0]);
                    let infoPaymentChannelCellcard = this._infoPaymentChannelCellcard[0];
                    for (let i = 0; i < packsCellcard.length; i++) {
                        const element = packsCellcard[i];
                        this.detailPack(element, infoPaymentChannelCellcard[i].priceChip, infoPaymentChannelCellcard[i].priceUsd);
                    }
                }
                break;
            case this._listPaymentChannel.SMART:
                if (this._infoPaymentChannelSmart.length === 0) {
                    this.content.removeAllChildren();
                } else {
                    this.content.removeAllChildren();
                    this.totalHeightConten = 0;
                    let packsSmart = this.creatPack(this._infoPaymentChannelSmart[0]);
                    let infoPaymentChannelSmart = this._infoPaymentChannelSmart[0];
                    for (let i = 0; i < packsSmart.length; i++) {
                        const element = packsSmart[i];
                        this.detailPack(element, infoPaymentChannelSmart[i].priceChip, infoPaymentChannelSmart[i].priceUsd);
                    }
                }
                break;
        }
    }
    changeChannelPayment(event, data) {
        this.scrListGame.content.y = 0;
        switch (data) {
            case this._listPaymentChannel.METFONE:
                this.showPaymentChannel(this._listPaymentChannel.METFONE);
                this.saveChannelPayment = this._listPaymentChannel.METFONE;
                this.saveChannelPaymentTab = this._listPaymentChannel.METFONE;
                break;
            case this._listPaymentChannel.CELLCARD:
                this.content.destroyAllChildren();
                this.showPaymentChannel(this._listPaymentChannel.CELLCARD);
                this.saveChannelPayment = this._listPaymentChannel.CELLCARD;
                this.saveChannelPaymentTab = this._listPaymentChannel.CELLCARD;
                break;
            case this._listPaymentChannel.SMART:
                this.content.destroyAllChildren();
                this.showPaymentChannel(this._listPaymentChannel.SMART);
                this.saveChannelPayment = this._listPaymentChannel.SMART;
                this.saveChannelPaymentTab = this._listPaymentChannel.SMART;
                break;
            default:
                break;
        }
    }

    detailPack(paymentChannel: cc.Node, priceChips: number, priceDollar: number) {
        let childPrice = paymentChannel.getChildByName("price_dollar");
        let childChips = paymentChannel.getChildByName("price_chip");
        let childValuePrice = childPrice.getChildByName("value");
        let childValueChip = childChips.getChildByName("value");
        let valuePrice = childValuePrice.getComponent(cc.Label);
        let valueChip = childValueChip.getComponent(cc.Label);
        valueChip.string = Utils.formatNumber(priceChips);
        valuePrice.string = Utils.formatNumber(priceDollar);
    }

    openDetailBank(name: string) {
        switch (this.saveChannelPayment) {
            case this._listPaymentChannel.METFONE:
                let infoPaymentChannelMetfone = this._infoPaymentChannelMetfone[0];
                for (let i = 0; i < infoPaymentChannelMetfone.length; i++) {
                    const element = infoPaymentChannelMetfone[i];
                    if (name === element.name) {
                        this.lbPriceChip.string = element.priceChip;
                        this.lbPriceUsd.string = element.priceUsd;
                        this.savePriceUsd = element.priceUsd;
                        this.saveName = element.name;
                        this.saveRateMoney = element.rate;
                        this.saveCodePack = element.code;
                    }
                }
                break;
            case this._listPaymentChannel.CELLCARD:
                let infoPaymentChannelCellcard = this._infoPaymentChannelCellcard[0];
                for (let i = 0; i < infoPaymentChannelCellcard.length; i++) {
                    const element = infoPaymentChannelCellcard[i];
                    if (name === element.name) {
                        this.lbPriceChip.string = element.priceChip;
                        this.lbPriceUsd.string = element.priceUsd;
                        this.savePriceUsd = element.priceUsd;
                        this.saveName = element.name;
                        this.saveRateMoney = element.rate;
                        this.saveCodePack = element.code;
                    }
                }
                break;
            case this._listPaymentChannel.SMART:
                let infoPaymentChannelSmart = this._infoPaymentChannelSmart[0];
                for (let i = 0; i < infoPaymentChannelSmart.length; i++) {
                    const element = infoPaymentChannelSmart[i];
                    if (name === element.name) {
                        this.lbPriceChip.string = element.priceChip;
                        this.lbPriceUsd.string = element.priceUsd;
                        this.savePriceUsd = element.priceUsd;
                        this.saveName = element.name;
                        this.saveRateMoney = element.rate;
                        this.saveCodePack = element.code;
                    }
                }
                break;
            default:
                break;
        }
        for (let i = 0; i < this.btnTab.length; i++) {
            if (this.btnTab[i].node.name === this.saveChannelPaymentTab) {
                this.btnTab[i].interactable = false;
                this.btnTab[i].enableAutoGrayEffect = false;
            } else {
                this.btnTab[i].interactable = false;
            }
        }
        if (this.liskPackage.active === true) {
            this.liskPackage.active = false;
            this.detailBank.active = true;
            this.btnBack.active = true;
        }
    }

    onBack() {
        this.savePriceUsd = null;
        this.saveName = null;
        this.saveRateMoney = null;
        this.saveCodePack = null;
        this.liskPackage.active = true;
        this.detailBank.active = false;
        this.btnBack.active = false;
        this.edbConten.string = "";
        this.scrListGame.scrollToTop();
        this.saveChannelPaymentTab = this.saveChannelPayment;

        for (let i = 0; i < this.btnTab.length; i++) {
            this.btnTab[i].interactable = true;
            this.btnTab[i].enableAutoGrayEffect = true;
        }
    }

    actOpenSupport() {
        // link fanpage
        cc.sys.openURL("https://m.me/joker123en");
    }

    onBtnXacNhan() {
        console.log(`UserName ${Configs.Login.Nickname}`);
        console.log(`this.savePayment ${this.saveChannelPayment}`);
        console.log(`this.saveName ${this.saveName}`);
        console.log(`this.savePrice ${this.savePriceUsd}`);
        console.log(`this.rate ${this.saveRateMoney}`);
        console.log(`saveCodePack ${this.saveCodePack}`);
        let payType: number;
        switch (this.saveChannelPayment) {
            case this._listPaymentChannel.METFONE:
                payType = 1;
                break;
            case this._listPaymentChannel.CELLCARD:
                payType = 1;
                break;
            case this._listPaymentChannel.SMART:
                payType = 1;
                break;
            default:
                break;
        }
        if (this.node.active) {
            let stringConten: string = this.edbConten.string;
            const money: number = this.savePriceUsd;
            let channelPayment: string = this.saveChannelPayment;
            if (!Utils.isNumberIsChar(stringConten)) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_txt_content'));
                return;
            }
            if (stringConten == "") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            //var bankNumber = this.editBankNumber.string.trim();
            if (money.toString() == "") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if ((money) < 0) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 0.5$");
                return;
            }
            if ((money) > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 3.000.000 $");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
            var request = {
                "c": 2051,
                "co": this.saveCodePack,
                "p": this.savePriceUsd,
                "n": this.saveName,
                "t": 1,
                "nn": Configs.Login.Nickname,
                "sdt": stringConten,
                "cp": encodeURIComponent(channelPayment),
                "pt":payType
            };
            console.log("request ", request);
            //this.lbTransMsg.string = request['ds'];
            // Http.get(Configs.App.API, request, (err, res) => {
            //     App.instance.showLoading(false);
            //     if (res.success == true) {
            //         App.instance.ShowAlertDialog("ដាក់​ប្រាក់​បាន​ជោគជ័យ!");
            //     }
            //     else {
            //         App.instance.ShowAlertDialog(res.message);
            //     }
            // });
            Http.get(Configs.App.API, request, (err, res) => {
                console.log(res);
                App.instance.showLoading(false);
                if (res.success == true) {
                    App.instance.ShowAlertDialog("Deposit successfully!");
                    if (cc.sys.isMobile && cc.sys.isNative) {
                        if (Configs.App.IS_SANBOX_CODA == true) {
                            cc.sys.openURL(`https://sandbox.codapayments.com/airtime/begin?type=${payType}&txn_id=${res.txnId}&browser_type=mobile-web`)
                        } else {
                            cc.sys.openURL(`https://airtime.codapayments.com/airtime/begin?type=${payType}&txn_id=${res.txnId}&browser_type=mobile-web`)
                        }
                    }else{
                        if (Configs.App.IS_SANBOX_CODA == true) {
                            cc.sys.openURL(`https://sandbox.codapayments.com/airtime/begin?type=${payType}&txn_id=${res.txnId}`)
                        } else {
                            cc.sys.openURL(`https://airtime.codapayments.com/airtime/begin?type=${payType}&txn_id=${res.txnId}`)
                        }
                    }
                }
                else {
                    App.instance.ShowAlertDialog("Deposit Failed");
                }
            })
        }
    }
}

