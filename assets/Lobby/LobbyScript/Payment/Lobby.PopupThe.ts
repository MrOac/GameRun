import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient2 from "../Script/networks/MiniGameNetworkClient2";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import Http from "../Script/common/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass("Lobby.PopupShop.TabNapThe")
export class TabNapThe {
    @property(Dropdown)
    dropdownTelco: Dropdown = null;
    @property(Dropdown)
    dropdownAmount: Dropdown = null;
    @property(cc.EditBox)
    edbCode: cc.EditBox = null;
    @property(cc.EditBox)
    edbSerial: cc.EditBox = null;
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    start() {
        this.itemFactorTemplate.active = false;
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            let node = cc.instantiate(this.itemFactorTemplate);
            node.parent = this.itemFactorTemplate.parent;
            node.active = true;

            let menhGia = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i];
            let nhan = Math.ceil(menhGia * Configs.App.SERVER_CONFIG.ratioNapThe);
            node.getChildByName("menhgia").getComponent(cc.Label).string = Utils.formatNumber(menhGia);
            node.getChildByName("khuyenmai").getComponent(cc.Label).string = "0%";
            node.getChildByName("nhan").getComponent(cc.Label).string = Utils.formatNumber(nhan);
        }
    }
    reset() {
        this.dropdownTelco.setOptions(["ជ្រើសរើសក្រុមហ៊ុនដឹកជញ្ជូន"].concat(Configs.App.SERVER_CONFIG.listTenNhaMang));
        let listMenhGia = ["ជ្រើសរើសនិកាយ"];
        for (let i = 0; i < Configs.App.SERVER_CONFIG.listMenhGiaNapThe.length; i++) {
            listMenhGia.push(Utils.formatNumber(Configs.App.SERVER_CONFIG.listMenhGiaNapThe[i]));
        }
        this.dropdownAmount.setOptions(listMenhGia);
        this.resetForm();
    }
    resetForm() {
        this.dropdownTelco.setValue(0);
        this.dropdownAmount.setValue(0);
        this.edbCode.string = "";
        this.edbSerial.string = "";
    }
    submit() {
        let ddTelcoValue = this.dropdownTelco.getValue();
        let ddAmountValue = this.dropdownAmount.getValue();
        let code = this.edbCode.string.trim();
        let serial = this.edbSerial.string.trim();
        if (ddTelcoValue == 0) {
            App.instance.alertDialog.showMsg("សូមជ្រើសរើសក្រុមហ៊ុនដឹកជញ្ជូន.");
            return;
        }
        if (ddAmountValue == 0) {
            App.instance.alertDialog.showMsg("សូមជ្រើសរើសនិកាយ.");
            return;
        }
        if (code == "" || parseInt(code) <= 0 || isNaN(parseInt(code))) {
            App.instance.alertDialog.showMsg("លេខកូដកាតមិនត្រឹមត្រូវ.");
            return;
        }
        if (serial == "" || parseInt(serial) <= 0 || isNaN(parseInt(serial))) {
            App.instance.alertDialog.showMsg("លេខកូដសៀរៀលមិនត្រឹមត្រូវ.");
            return;
        }
        let telcoId = Configs.App.SERVER_CONFIG.listIdNhaMang[ddTelcoValue - 1];
        let amount = Configs.App.SERVER_CONFIG.listMenhGiaNapThe[ddAmountValue - 1].toString();
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqDepositCard(telcoId, serial, code, amount));
    }
}
@ccclass
export default class PopupShop extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    @property(TabNapThe)
    tabNapThe: TabNapThe = null;
    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];
    private tabSelectedIdx = 0;
    start() {
		this.tabNapThe.reset();
        for (let i = 0; i < this.lblContainsBotOTPs.length; i++) {
            let lbl = this.lblContainsBotOTPs[i];
            lbl.string = lbl.string.replace("$bot_otp", "@" + Configs.App.getLinkTelegram());
        }
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }
        MiniGameNetworkClient2.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_CARD: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositCard(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("បញ្ចូលកាតដោយជោគជ័យ.");
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            break;
                        case 30:
                            this.tabNapThe.resetForm();
                            App.instance.alertDialog.showMsg("ប្រព័ន្ធបានកត់ត្រាប្រតិបត្តិការ សូមរង់ចាំឱ្យប្រព័ន្ធដំណើរការ.");
                            break;
                        case 31:
                            App.instance.alertDialog.showMsg("កាតត្រូវបានប្រើប្រាស់រួចហើយ.");
                            break;
                        case 32:
                            App.instance.alertDialog.showMsg("កាតត្រូវបានចាក់សោ.");
                            break;
                        case 33:
                            App.instance.alertDialog.showMsg("កាតមិនត្រូវបានធ្វើឱ្យសកម្មទេ។.");
                            break;
                        case 34:
                            App.instance.alertDialog.showMsg("កាតបានផុតកំណត់.");
                            break;
                        case 35:
                            App.instance.alertDialog.showMsg("លេខកូដកាតមិនត្រឹមត្រូវ.");
                            break;
                        case 36:
                            App.instance.alertDialog.showMsg("លេខស៊េរីមិនត្រឹមត្រូវទេ។.");
                            break;
                        case 8:
                            App.instance.alertDialog.showMsg("គណនី​ត្រូវ​បាន​រារាំង​មិន​ឱ្យ​ផ្ទុក​កាត​ដោយ​សារ​ផ្ទុក​ខុស​ច្រើន​ដង​ពេក! ពេលវេលានៅសល់ដើម្បីចាក់សោកាត: " + this.longToTime(res.timeFail));
                            break;
                        default:
                            App.instance.alertDialog.showMsg("កំហុស " + res.error + ". មិនស្គាល់.");
                            break;
                    }
                    break;
                }
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    // console.log(res);
                    if (res.error == 0) {
                        this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = "";
                        App.instance.alertDialog.showMsg("គណនីមិនមានទេ។.");
                        break;
                    }
                    this.tabTransfer.receiverAgent=res.type == 1 || res.type == 2;
                    if(!this.tabTransfer.receiverAgent)
                    {
                        this.tabTransfer.edbNickname.string ="";
                        App.instance.alertDialog.showMsg("គណនី "+this.tabTransfer.edbNickname.string+" មិនមែនជាគណនីភ្នាក់ងារទេ។.");
                        break;
                    }
                    this.tabTransfer.lblDaiLy.node.active = res.type == 1 || res.type == 2;
                    this.tabTransfer.lblFee.string = res.fee + "%";
                    this.tabTransfer.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            this.tabTransfer.panelContent.active = false;
                            this.tabTransfer.panelContinue.active = true;
                            this.tabTransfer.edbOTP.string = "";
                            App.instance.alertDialog.showMsg("សូមចុច \"ទទួល OTP SMS\" ឬទទួលបាន OTP ពី Telegram ហើយបញ្ចូលលេខកូដ OTP ដើម្បីបន្ត!");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("ចំនួនទឹកប្រាក់អប្បបរមាគឺ 200,000.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("មុខងារនេះមានសម្រាប់តែគណនីដែលបានចុះឈ្មោះជាមួយ SMS security PLUS ប៉ុណ្ណោះ។.");
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg("សមតុល្យមិនគ្រប់គ្រាន់.");
                            break;
                        case 5:
                            App.instance.alertDialog.showMsg("គណនីត្រូវបានហាមឃាត់មិនឱ្យផ្ទេរប្រាក់.");
                            break;
                        case 6:
                            App.instance.alertDialog.showMsg("ឈ្មោះហៅក្រៅដែលបានទទួលមិនមានទេ។.");
                            break;
                        case 10:
                            App.instance.alertDialog.showMsg("មុខងារសុវត្ថិភាពនឹងដំណើរការដោយស្វ័យប្រវត្តិបន្ទាប់ពី 24 ម៉ោងចាប់ពីពេលចុះឈ្មោះជោគជ័យ!");
                            break;
                        case 11:
                            App.instance.alertDialog.showMsg("អ្នកអាចផ្ទេរទៅភ្នាក់ងារទូទៅក្នុងចំនួនទឹកប្រាក់ដែលបានបញ្ជាក់ប៉ុណ្ណោះ។!");
                            break;
                        case 22:
                            App.instance.alertDialog.showMsg("គណនីនេះមិនមានសិទ្ធិផ្ទេរប្រាក់ទេ។.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("កំហុស " + res.error + ". សូម​ព្យាយាម​ម្តង​ទៀត​នៅ​ពេល​ក្រោយ.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    // console.log(res);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg("OTP ត្រូវបានផ្ញើ!");
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg("ប្រតិបត្តិការនីមួយៗដើម្បីទទួលបានសារ SMS OTP ត្រូវតែនៅដាច់ពីគ្នាយ៉ាងតិច 5 នាទី។!");
                    } else {
                        App.instance.alertDialog.showMsg("ប្រតិបត្តិការបានបរាជ័យ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ!");
                    }
                    break;
                }
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    // console.log(res);
                    if (res.error != 0) {
                        App.instance.showLoading(false);
                        switch (res.error) {
                            case 1:
                            case 2:
                                App.instance.alertDialog.showMsg("ប្រតិបត្តិការបានបរាជ័យ!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវទេ សូមព្យាយាមម្តងទៀត!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("OTP បានផុតកំណត់ហើយ។!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("កំហុស " + res.error + ". មិនស្គាល់.");
                                break;
                        }
                        return;
                    }
                    App.instance.showLoading(true);
                    break;
                }
                case cmd.Code.RESULT_TRANSFER_COIN: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("ប្រតិបត្តិការផ្ទេរជោគជ័យ!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("កំហុស " + res.error + ". សូម​ព្យាយាម​ម្តង​ទៀត​នៅ​ពេល​ក្រោយ.");
                            break;
                    }
                    this.tabTransfer.reset();
                    break;
                }
                case cmd.Code.INSERT_GIFTCODE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResInsertGiftcode(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("លេខកូដកាតមិនត្រឹមត្រូវ។ សូមពិនិត្យម្តងទៀត!");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg("លេខកូដកាតបានប្រើរួចហើយ.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("ដើម្បីប្រើមុខងារនេះ សូមចុះឈ្មោះសុវត្ថិភាព.");
                            break;
                        case 4:
                        case 5:
                        case 6:
                            App.instance.alertDialog.showMsg("លេខកូដកាតដែលបានបញ្ចូលមិនត្រឹមត្រូវទេ។.");
                            break;
                        case 2:
                            Configs.Login.Coin = res.currentMoneyVin;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("បញ្ចូលកាតដោយជោគជ័យ.");
                            break;
                    }
                    break;
                }
                case cmd.Code.DEPOSIT_BANK: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositBank(data);
                    switch(res.error){
                        case 0:
                            App.instance.alertDialog.showMsg("ប្រព័ន្ធបានកត់ត្រាប្រតិបត្តិការរបស់អ្នក សូមរង់ចាំមួយភ្លែតដើម្បីឱ្យពួកយើងដំណើរការ");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("អ្នកមានប្រតិបត្តិការដែលមិនទាន់សម្រេច សូមរង់ចាំរហូតដល់ប្រតិបត្តិការត្រូវបានបញ្ចប់");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("ទិន្នន័យមានកំហុស សូមព្យាយាមម្តងទៀត!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("ទិន្នន័យមានកំហុស សូមព្យាយាមម្តងទៀត!");
                    }
                  //  console.log(res.error);
                    break;
                }
                case cmd.Code.DEPOSIT_MOMO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositMomo(data);
                    switch(res.error){
                        case 0:
                            App.instance.alertDialog.showMsg("ប្រព័ន្ធបានកត់ត្រាប្រតិបត្តិការរបស់អ្នក សូមរង់ចាំមួយភ្លែតដើម្បីឱ្យពួកយើងដំណើរការ");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("អ្នកមានប្រតិបត្តិការដែលមិនទាន់សម្រេច សូមរង់ចាំរហូតដល់ប្រតិបត្តិការត្រូវបានបញ្ចប់");
                            break;
                        case 2:
                        case 1:
                            App.instance.alertDialog.showMsg("ទិន្នន័យមានកំហុស សូមព្យាយាមម្តងទៀត!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("ទិន្នន័យមានកំហុស សូមព្យាយាមម្តងទៀត!");
                    }
                //    console.log(res.error);
                    break;
                }
            }
        }, this);

        this.tabNapThe.start();
       
       
        
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabNapThe.reset();
                break;
            case 1:
                this.tabNapThe.reset();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                this.tabNapThe.reset();
                break;
            case 5:
                this.tabNapThe.reset();
                break;
        }
    }
    private longToTime(l: number): string {
        return (l / 60) + " ម៉ោង " + (l % 60) + " នាទី";
    }
    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }
    showAndOpenTransfer(nickname: string = null) {
        super.show();
        this.tabSelectedIdx = 1;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
        if (nickname != null) {
            this.tabTransfer.edbNickname.string = this.tabTransfer.edbReNickname.string = nickname;
            App.instance.showLoading(true);
            MiniGameNetworkClient2.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        }
    }
    actSubmitNapThe() {
        this.tabNapThe.submit();
    }
    actContinueTransfer() {
        if(!this.tabTransfer.receiverAgent)
        {
            App.instance.alertDialog.showMsg("មូលនិធិអាចត្រូវបានផ្ទេរទៅគណនីភ្នាក់ងារប៉ុណ្ណោះ។");
            return;
        }
        this.tabTransfer.continue();
    }
    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqGetOTP());
    }
    actSubmitTransfer() {
        let otp = this.tabTransfer.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("លេខកូដផ្ទៀងផ្ទាត់មិនអាចទុកនៅទទេបានទេ។.");
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    }
    actSubmitCard() {
        this.tabCard.submit();
    }
}
 