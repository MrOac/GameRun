import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
//import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
//import Http from "../Script/common/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../../scripts/networks/ShootFishNetworkClient";

const { ccclass, property } = cc._decorator;


@ccclass("Lobby.PopupShop.TabTransfer")
export class TabTransfer {
    @property(cc.Node)
    panelContent: cc.Node = null;
    @property(cc.Node)
    panelContinue: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblFee: cc.Label = null;
    @property(cc.Label)
    lblReceive: cc.Label = null;
    @property(cc.Label)
    lblDaiLy: cc.Label = null;
    @property(cc.Label)
    lblNote: cc.Label = null;
    @property(cc.EditBox)
    edbNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbReNickname: cc.EditBox = null;
    @property(cc.EditBox)
    edbCoinTransfer: cc.EditBox = null;
    @property(cc.EditBox)
    edbNote: cc.EditBox = null;

    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;

    ratioTransfer = Configs.App.SERVER_CONFIG.ratioTransfer;
    
    receiverAgent: boolean= false;

    start() {
        this.edbCoinTransfer.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoinTransfer.string);
            this.edbCoinTransfer.string = Utils.formatNumber(number);
            this.lblReceive.string = Utils.formatNumber(Math.round(this.ratioTransfer * number));
        });
        this.edbNickname.node.on("editing-did-ended", () => {
            let nickname = this.edbNickname.string.trim();
            if (nickname != "") {
               App.instance.showLoading(true);
               MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
            }
        });
    }

    reset() {
        this.panelContent.active = true;
     //   this.panelContinue.active = false;
        this.lblDaiLy.node.active = false;
        this.lblFee.string = "0";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        this.lblReceive.string = "0";
        this.edbNickname.string = "";
        this.edbReNickname.string = "";
        this.edbNote.string = "";
        this.edbCoinTransfer.string = "";
        this.lblNote.string = this.lblNote.string.replace("%s", Math.round((1 - this.ratioTransfer) * 100) + "%");
        this.lblFee.string = Math.round((1 - this.ratioTransfer) * 100) + "%";
    }

    continue() {
        let nickname = this.edbNickname.string.trim();
        let reNickname = this.edbReNickname.string.trim();
        let coin = Utils.stringToInt(this.edbCoinTransfer.string);
        // let note = this.edbNote.string.trim();
        let note = Configs.App.NAME_APP;
        if (nickname == "") {
            App.instance.alertDialog.showMsg("ឈ្មោះហៅក្រៅមិនអាចទុកឲ្យទទេបានទេ។.");
            return;
        }
        if (nickname != reNickname) {
            App.instance.alertDialog.showMsg("ឈ្មោះហៅក្រៅពីរផ្សេងគ្នា.");
            return;
        }
        // if (note == "") {
        //     App.instance.alertDialog.showMsg("ហេតុផលសម្រាប់ការផ្ទេរមិនអាចទុកនៅទទេបានទេ។.");
        //     return;
        // }
        if (coin < 50000) {
            App.instance.alertDialog.showMsg("ចំនួនទឹកប្រាក់ប្រតិបត្តិការអប្បបរមាគឺ 50,000.");
            return;
        }
        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("សមតុល្យមិនគ្រប់គ្រាន់.");
            return;
        }

        App.instance.confirmDialog.show2("តើអ្នកប្រាកដថាចង់ផ្ទេរទៅ\nគណនី: \"" + nickname + "\" (មិនមែនជាភ្នាក់ងារទេ។)\nចំនួន​ទឹកប្រាក់: " + this.edbCoinTransfer.string + "\nហេតុផល: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoin(nickname, coin, note));
            }
        });
    }
}


@ccclass
export default class PopupShop extends Dialog {

    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;

    
    @property(TabTransfer)
    tabTransfer: TabTransfer = null;
    
    

    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];


    



    private tabSelectedIdx = 0;

    start() {
		this.tabTransfer.reset();
        /* switch (VersionConfig.CPName) {
            case VersionConfig.CP_NAME_F69:
                this.tabs.toggleItems[2].node.active = false;//inactive momo tab
                this.tabs.toggleItems[5].node.active = true;//active bitcoin tab
                break;
            default:
                this.tabs.toggleItems[2].node.active = true;//active momo tab
                this.tabs.toggleItems[5].node.active = false;//inactive bitcoin tab
                break;
        } */

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

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            //.log(inpacket.getCmdId());
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
                //    {
                //        this.tabTransfer.edbNickname.string ="";
                //        App.instance.alertDialog.showMsg("Tài khoản "+this.tabTransfer.edbNickname.string+" Không phải là tài khoản đại lý.");
                //        break;
                //    }
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
                            this.tabTransfer.panelContent.active = true;
                         //   this.tabTransfer.panelContinue.active = true;
                        //    this.tabTransfer.edbOTP.string = "";
                            App.instance.alertDialog.showMsg("ការផ្ទេរជោគជ័យ");
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("ចំនួនទឹកប្រាក់អប្បបរមាគឺ 50,000.");
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
                            App.instance.alertDialog.showMsg("កំហុស " + res.error + ". មិនស្គាល់.");
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
                    //console.log(res.error);
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
                    //console.log(res.error);
                    break;
                }
            }
        }, this);

        
        this.tabTransfer.start();
        
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
                this.tabTransfer.reset();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                this.tabCard.reset();
                break;
            case 5:
                this.tabBitCoin.start(this);
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
          //  App.instance.showLoading(true);
          //  MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
        }
    }

    

    actContinueTransfer() {
        
        this.tabTransfer.continue();
    }

    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actSubmitTransfer() {
        let otp = this.tabTransfer.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg("លេខកូដផ្ទៀងផ្ទាត់មិនអាចទុកនៅទទេបានទេ។.");
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(otp, 0));
    }

    actSubmitNapMomo() {
        this.tabMomo.submit();
    }

    actSubmitNapNganHang() {
        this.tabBank.submit();
    }

    actSubmitCard() {
        this.tabCard.submit();
    }
}
