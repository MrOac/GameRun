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
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TabPopupBanks extends Dialog {
    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.EditBox)
    edbConten: cc.EditBox = null;

    @property(cc.Button)
    btnCopy: cc.Button = null;

    @property(cc.Node)
    liskPackage: cc.Node = null;

    @property(cc.Node)
    detailBank: cc.Node = null;

    @property([cc.Node])
    contentPackage: cc.Node[] = [];

    @property(cc.ScrollView)
    scrListGame: cc.ScrollView = null;

    @property(cc.Node)
    btnBack: cc.Node = null;
    @property(cc.Label)
    lbPriceDollar: cc.Label = null;
    savePrice: number;
    private _listBank = [];
    private _priceDollar: number[] = [0.5, 1, 2, 5, 10, 20, 50, 100];
    private _priceChips: number[] = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];
    start() {
        for (let i = 0; i < this.contentPackage.length; i++) {
            let childPrice = this.contentPackage[i].getChildByName("price_dollar");
            let childChips = this.contentPackage[i].getChildByName("price_chip");
            let childValuePrice = childPrice.getChildByName("value");
            let childValueChip = childChips.getChildByName("value");
            let valuePrice = childValuePrice.getComponent(cc.Label);
            let valueChip = childValueChip.getComponent(cc.Label);
            valueChip.string = Utils.formatNumber(this._priceChips[i]);
            valuePrice.string = Utils.formatNumber(this._priceDollar[i]);
        }
        this.liskPackage.active = true;
        this.detailBank.active = false;
        this.btnBack.active = false;
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading(false);
            if (err == null) {
                if (res.list_bank === undefined || res.list_bank.length == 0) {
                    return;
                }
                let listBank = res.list_bank;
                this._listBank = listBank;
                for (let i = 0; i < this._listBank.length; i++) {
                    const element = this._listBank[i];
                    this.lblBankNumber.string = element.bankNumber;
                    this.lblBankAccountName.string = element.bankAccountName;
                }
            }
        });
        this.btnCopy.node.on("click", () => {
            if (this.lblBankNumber.string.length > 0) {
                SPUtils.copyToClipboard(this.lblBankNumber.string);
                App.instance.alertDialog.showMsg("លេខគណនីត្រូវបានចម្លង។");
            } else {
                App.instance.alertDialog.showMsg("មិនទាន់មានលេខគណនីនៅឡើយទេ។");
            }
        });

    }

    openDetailBank(target, data) {
        this.savePrice = this._priceDollar[data - 1];
        this.lbPriceDollar.string = this._priceDollar[data - 1].toString();
        if (this.liskPackage.active === true) {
            this.liskPackage.active = false;
            this.detailBank.active = true;
            this.btnBack.active = true;
        }
    }

    onBack() {
        console.log(this.scrListGame.node);
        this.liskPackage.active = true;
        this.detailBank.active = false;
        this.btnBack.active = false;
        this.edbConten.string = "";
        this.scrListGame.scrollToTop();
    }

    actOpenSupport(){
        // link fanpage
        cc.sys.openURL("https://m.me/joker123en");
    }

    onBtnXacNhan() {
        if (this.node.active) {
            let rateMoney: number = 100000;
            let stringConten: string = this.edbConten.string;
            const money: number = this.savePrice * rateMoney;
            let ddBank: number = 1;
            if (ddBank == 1) {
                var bank = "Wing"
            }
            if (ddBank == 2) {
                var bank = "VietinBank"
            }
            if (ddBank == 3) {
                var bank = "TPBank"
            }
            if (ddBank == 4) {
                var bank = "TechcomBank"
            }
            if (ddBank == 5) {
                var bank = "BIDV"
            }
            if (ddBank == 6) {
                var bank = "SacomBank"
            }
            // if(!Utils.isNumberIsChar(stringConten)){
            //     App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_change_pass'));
            //     return;
            // }
            if (stringConten.toString() == "") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            //var bankNumber = this.editBankNumber.string.trim();
            if (money.toString() == "" || ddBank == null || ddBank === 0) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if ((money / rateMoney) < 0) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 0.5$");
                return;
            }
            if ((money / rateMoney) > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 3.000.000 $");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(ddBank),
                "am": money,
                "pt": 1,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": "manualbank",
                "bc": bank,
                "ds": stringConten,
                "bn": money
            };
            //this.lbTransMsg.string = request['ds'];
            Http.get(Configs.App.API, request, (err, res) => {
                App.instance.showLoading(false);
                if (res.success == true) {
                    App.instance.ShowAlertDialog("ដាក់​ប្រាក់​បាន​ជោគជ័យ!");
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
        }
    }
}

