
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";
import Configs from "../../Loading/src/Configs";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupChangePassword extends Dialog {
    @property(cc.Node)
    info: cc.Node = null;
    @property(cc.Node)
    continue: cc.Node = null;

    @property(cc.EditBox)
    edbNewNickName: cc.EditBox = null;
    @property(cc.EditBox)
    edbNewPassword: cc.EditBox = null;
    @property(cc.EditBox)
    edbReNewPassword: cc.EditBox = null;
    @property(cc.Label)
    lblTitle: cc.Label = null;

    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Node)
    userNameNew: cc.Node = null;
    @property(cc.Node)
    infoNode: cc.Node = null;

    saveUser: string = "";
    saveNewNickName: string = "";
    saveNewPass: string = "";
    checking: boolean;

    onEnable() {
        let lbInfoNode = this.infoNode.getComponent(cc.Layout);
        let checkUserName = Configs.Login.Nickname.toLowerCase().substring(0, 5);
        if (checkUserName === "guest") {
            this.userNameNew.active = true;
            this.checking = true;
            this.lblTitle.string = "ការពារគណនីរបស់អ្នក";
        } else {
            this.userNameNew.active = false;
            lbInfoNode.paddingTop = 50;
            this.saveUser = Configs.Login.Nickname;
            this.checking = false;
            this.lblTitle.string = "ផ្លាស់ប្តូរពាក្យសម្ងាត់";
        }
    }

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHANGE_PASSWORD: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResChangePassword(data);
                    switch (res.error) {
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_old_password_incorrect'));
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_change_password_success'));
                            Configs.Login.Nickname = this.saveNewNickName;
                            Configs.Login.Password = this.saveNewPass;
                            BroadcastReceiver.send(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, { "userName": Configs.Login.Nickname });
                            BroadcastReceiver.send(BroadcastReceiver.PROTECT_ACCOUNT);
                            this.dismiss();
                            break;
                        case 6:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_change_username_from_server'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error') + "\n" + res.error);
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_send'));
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_delay_time'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_not_success'));
                    }
                    break;
                }
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    App.instance.showLoading(false);
                    switch (res.error) {
                        case 0:
                            break;
                        case 1:
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error_exchange'));
                            break;
                        case 77:
                        case 3:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_expired_otp'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error') + "\n" + res.error);
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_CHANGE_PASSWORD: {
                    let res = new cmd.ResSendOTP(data);
                    App.instance.showLoading(false);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_change_password_success'));
                            this.dismiss();
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error') + "\n" + res.error);
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    show() {
        super.show();
        this.info.active = true;
        this.continue.active = false;
        this.edbNewNickName.string = "";
        this.edbNewPassword.string = "";
        this.edbReNewPassword.string = "";
        this.edbOTP.string = "";
    }

    actSubmit() {
        let newNickName = this.edbNewNickName.string.trim();
        this.saveNewNickName = newNickName;
        let newPassword = this.edbNewPassword.string.trim();
        this.saveNewPass = newPassword;
        let reNewPassword = this.edbReNewPassword.string.trim();
        let checkstring = newNickName.toLowerCase().substring(0, 5);
        if (!Utils.isNumberIsChar(newNickName)) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_change_pass'));
            return;
        }
        if (checkstring == "guest") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_quest'));
            return;
        }
        if (newNickName.length == 0 && this.checking) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_old_password_not_blank'));
            return;
        }
        if (newPassword.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_new_password_not_blank'));
            return;
        }
        if (reNewPassword != newPassword) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_password_not_same'));
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqChangePassword((newNickName ? newNickName : this.saveUser), newPassword));
    }

    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actContinue() {
        let otp = this.edbOTP.string.trim();
        if (otp.length == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_blank'));
            return;
        }
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSendOTP(otp, false ? 1 : 0));
    }
}
