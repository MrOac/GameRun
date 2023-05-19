import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTransaction extends Dialog {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    contentNapRut: cc.Node = null;

    @property(cc.Node)
    prefab: cc.Node = null;
    @property(cc.Node)
    itemNapRut: cc.Node = null;
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    tabPlay: cc.Node = null;
    @property(cc.Node)
    tabNapRut: cc.Node = null;




    @property([cc.BitmapFont])
    fontNumber: cc.BitmapFont[] = [];

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private tabSelectedIdx = 0;
    private data = null;
    private dataPlay = [];
    private dataCashout = [];
    private dataExchange = [];
    private currentData = [];
    private totalPageLoaded = 0;
    private GameName = {
        110: "Đua Xe",
        170: "Dance",
        2: "ធំ - តូច",
        5: "Pokemon",
        11: "ធំ2",
        160: "Night Club",
        120: "Viking",
        150: "Halloween",
        1: "Mini Chinese Poker",
        3: "ផ្លែឃ្លោក ក្តាម",
        9: "ល្បែងបៀបី",
        4: "Zhuge Liang",
        191: "ផ្លែឈើ",
        190: "Tài Xỉu Siêu Tốc",
        12: "សូម្បីតែ - សេស",
        180: "Son Tinh",
        197: "Bikini",
        198: "ដបវេទមន្ត",
    }
    onLoad() {
        var scrollViewEventHandler = new cc.Component.EventHandler();
        scrollViewEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
        scrollViewEventHandler.component = "Lobby.PopupTransaction";// This is the code file name
        scrollViewEventHandler.handler = "onScrollEvent";
    }
    start() {

        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.updateTabsTitleColor();
                this.page = 1;
                this.resetDataLoaded();
                this.loadData();
                this.tabPlay.active = this.tabSelectedIdx == 0 ? true : false;
                this.tabNapRut.active = this.tabSelectedIdx == 0 ? false : true;

            });
        }
    }

    onEnable() {
        this.tabSelectedIdx = 0;
        this.updateTabsTitleColor();
        this.tabs.toggleItems[0].isChecked = true;
    }

    private updateTabsTitleColor() {
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.Label).node.color = j == this.tabSelectedIdx ? cc.Color.YELLOW : cc.Color.WHITE;
        }
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();
        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "/" + this.maxPage;
        this.loadData();
    }

    show() {
        super.show();
        this.resetDataLoaded();
        this.currentData = [];
        this.data
        this.tabSelectedIdx = 0;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }
    resetDataLoaded() {
        this.totalPageLoaded = 0;
        this.currentData = [];
        this.dataCashout = [];
        this.dataPlay = [];
        this.dataExchange = [];
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    parseDescriptionJson(item, itemData) {

        var desJson = JSON.parse(itemData["description"]);
        item.getChildByName("Service").getComponent(cc.Label).string = this.GameName[desJson["gameID"]];
        var gameID = desJson["gameID"];
        switch (gameID) {
            case "110": case "170": case "5": case "160": case "120": case "150": case "191": case "180": case "197": case "198":
                //slot
                if (desJson["type"] == 0) {
                    //dat cuocf
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "<color=#e12e0b>ដាក់ភ្នាល់ : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                }
                else if (desJson["type"] == 1) {
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "ប្រាក់រង្វាន់មនុស្សធម៌ " + this.GameName[desJson["gameID"]];

                }
                else {
                    switch (desJson["result"]) {
                        case 5: case 1:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 2:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>ឈ្នះធំ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 3:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>បំផ្លាញ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 4:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>X2 បំផ្លាញ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                    }


                }
                break;
            case "2":
                //tai xiu
                if (desJson["type"] == 6) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=e12e0b>\nភ្នាល់ : " + (desJson["betSide"] == 0 ? "តូច" : "ធំ") + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["type"] == 7) {
                    if (desJson["action"] == 0) {
                        var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>បង់ការភ្នាល់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 1) {
                        var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>បង់ប្រាក់រង្វាន់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 2) {
                        var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>សងប្រាក់វិញ។ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 3) {
                        var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>Jackpot : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                }

                break;
            case "3":
                //bau cua
                if (desJson["action"] == 0) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#e12e0b>ដាក់ភ្នាល់ : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 1) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#f0bf0b>បង់ការភ្នាល់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 2) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#f0bf0b>បង់ប្រាក់រង្វាន់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }

                break;
            case "4":
                //cao thap
                if (desJson["action"] == 0) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "  ចំនួនជំហាន:" + desJson["step"] + "\n</color>"
                    msg += "<color=#e12e0b>ដាក់ភ្នាល់ : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 1) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "  ចំនួនជំហាន:" + desJson["step"] + "\n</color>"
                    msg += "<color=#f0bf0b>ថង ធួង : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 2) {
                    var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["referenceId"] + "  ចំនួនជំហាន:" + desJson["step"] + "\n</color>"
                    msg += "<color=#f0bf0b>Jackpot : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }

                break;
            case "11":
                var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>បន្ទប់ : " + desJson["roomID"] + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                break;
            case "15":
                var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>បន្ទប់ : " + desJson["roomID"] + "</color>";
                msg += "    <color=#e12e0b>\nភ្នាល់ : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                item.getChildByName("Service").getComponent(cc.Label).string = "សូម្បីតែ - សេស";
                break;
            case "9":
                var msg = "<color=#fbf2e1>វគ្គ : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>បន្ទប់ : " + desJson["roomID"] + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                break;
            case "1":
                if (desJson["type"] == 0) {
                    //dat cuoc
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "<color=#e12e0b>ដាក់ភ្នាល់ : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                }
                else if (desJson["type"] == 1) {
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "ប្រាក់រង្វាន់មនុស្សធម៌" + this.GameName[desJson["gameID"]];

                }
                else {
                    switch (desJson["result"]) {
                        case 1:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ស្តេចត្រង់</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 2:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ទឹកហូរត្រង់</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 3:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - បួនជ្រុង</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 4:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ផ្ទះពេញ</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 5:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ហូរ</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 6:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ត្រង់</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 7:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - បីដង</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 8:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - ពីរទ្វេ</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 9:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - គូ J+</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 10:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - គូ J-</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 11:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - កាតខ្ពស់។</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 12:
                            var msg = "<color=#e12e0b>ដាក់ភ្នាល់ : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>រង្វាន់ : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - X2 Jackpot</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                    }

                }
                break;
        }
        var serviceName = itemData["serviceName"];
        switch (serviceName) {
            case "182":
                item.getChildByName("Service").getComponent(cc.Label).string = "Giftcode";
                var msg1 = "Code : " + desJson["giftCode"] + "\n";
                msg1 += "<color=#f0bf0b>ប្រាក់រង្វាន់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
            case "186":
                item.getChildByName("Service").getComponent(cc.Label).string = "ត្រលប់​មកវិញ";
                var msg1 = "ថ្ងៃ : " + desJson["day"] + "\n";
                msg1 += "<color=#f0bf0b>ត្រលប់​មកវិញ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
            case "199":
                item.getChildByName("Service").getComponent(cc.Label).string = "ការចូលរួម";
                var msg1 = "<color=#FFFFFF>ប្រាក់រង្វាន់ចូលរួមប្រចាំថ្ងៃ</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
        }

        var type = desJson["type"];
        switch (type) {
            case 12:
                item.getChildByName("Service").getComponent(cc.Label).string = "បើកដំណើរការលេខទូរស័ព្ទរបស់អ្នក។";
                var msg1 = "<color=#f0bf0b>ប្រាក់រង្វាន់ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;

        }
    }

    loadPage(res) {
        //Utils.Log("trans:", res);
        this.content.removeAllChildren();
        if (this.tabSelectedIdx == 0) {
            for (let i = 0; i < 13; i++) {
                var indexData = i;

                if (indexData < res["transactions"].length) {
                    let item = cc.instantiate(this.prefab);
                    item.parent = this.content;
                    let itemData = res["transactions"][indexData];
                    var isJson = Utils.IsJsonString(itemData["description"]);
                    if (isJson) {
                        item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
                        item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
                        item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
                        item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);

                        if (itemData["actionName"] === undefined || itemData["actionName"] !== "CashOutByCard") {
                            item.getChildByName("BtnView").active = false;
                        } else {
                            item.getChildByName("BtnView").active = true;
                            item.getChildByName("BtnView").off("click");
                            item.getChildByName("BtnView").on("click", () => {
                                this.loadCard(itemData["transactionTime"]);

                            });
                        }
                        this.parseDescriptionJson(item, itemData);

                    }
                    else {
                        item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
                        item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
                        item.getChildByName("Service").getComponent(cc.Label).string = this.convertNameThirdParty(itemData["serviceName"]);
                        item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
                        item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
                        item.getChildByName("Desc").getComponent(cc.RichText).string = itemData["description"];
                        if (itemData['serviceName'] == "201") {
                            item.getChildByName("Desc").getComponent(cc.RichText).string = "ប្រាក់រង្វាន់ព្រឹត្តិការណ៍\nការប្រោសលោះម៉ោងមាស";
                        }
                        if (itemData['serviceName'] == "202") {
                            item.getChildByName("Desc").getComponent(cc.RichText).string = "ប្រាក់រង្វាន់ណែនាំ";
                        }
                        if (itemData["actionName"] === undefined || itemData["actionName"] !== "CashOutByCard") {
                            item.getChildByName("BtnView").active = false;
                        } else {
                            item.getChildByName("BtnView").active = true;
                            item.getChildByName("BtnView").off("click");
                            item.getChildByName("BtnView").on("click", () => {
                                this.loadCard(itemData["transactionTime"]);

                            });
                        }
                    }

                }
            }
        } else {
            for (let i = 0; i < 13; i++) {
                let data = this.currentData[i];
                if (data != null) {
                    let item = this.contentNapRut.children[i];
                    if (!cc.isValid(item)) {
                        item = cc.instantiate(this.itemNapRut);
                        item.parent = this.contentNapRut;
                    }
                    item.active = true;
                    item.getChildByName('lbTime').getComponent(cc.Label).string = data['CreatedAt'].replace(" ", "\n");
                    item.getChildByName("lbBank").getComponent(cc.Label).string = data['BankCode'];
                    item.getChildByName("lbAmount").getComponent(cc.Label).string = Utils.formatNumber(data['Amount']);
                    switch (data['Status']) {
                        case 0:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_pending');
                            item.getChildByName("lbStatus").color = cc.Color.YELLOW;
                            break;
                        case 1:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_receive2');
                            item.getChildByName("lbStatus").color = cc.Color.YELLOW;
                            break;
                        case 4:
                        case 2:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_success');
                            item.getChildByName("lbStatus").color = cc.Color.GREEN;
                            break;
                        case 3:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_failed');
                            item.getChildByName("lbStatus").color = cc.Color.RED;
                            break;
                        case 12:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_request_cashout');
                            item.getChildByName("lbStatus").color = cc.Color.CYAN;
                            break;

                        default:
                            item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_receive2');
                            item.getChildByName("lbStatus").color = cc.Color.WHITE;

                    }
                }
            }
            for (let i = this.currentData.length; i < this.contentNapRut.childrenCount; i++) {
                this.contentNapRut.children[i].active = false;
            }
        }

    }


    private loadData(isReloadScr = true) {
        App.instance.showLoading(true);
        let params = null;
        switch (this.tabSelectedIdx) {
            case 0:
                params = { "c": 302, "nn": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "p": this.page };
                break;
            case 1:
                // params = { "c": 302, "nn": Configs.Login.Nickname, "mt": 3, "p": this.page };
                params = { "c": 2016, "nn": Configs.Login.Nickname, "tt": 0, "p": this.page, "mi": 5 };
                break;
            case 2:
                params = { "c": 2016, "nn": Configs.Login.Nickname, "tt": 1, "p": this.page, "mi": 5 };
                break;
        }
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) {
                return;
            }
            if (res["success"]) {
                if (this.tabSelectedIdx == 0) {
                    this.maxPage = res["totalPages"];
                } else {
                    if (res['totalRecords'] <= 5) {
                        this.maxPage = 1;
                    } else {
                        this.maxPage = res['totalRecords'] % 5 == 0 ? (res['totalRecords'] / 5) : Math.floor(res['totalRecords'] / 5) + 1;
                    }
                }
                this.totalPageLoaded++;
                this.data = res;
                let transactionData = res['transactions'];
                if (this.tabSelectedIdx == 0) {
                    this.dataPlay.push(...transactionData);
                    this.currentData = this.dataPlay;
                } else {
                    if (res['data'] != null)
                        this.currentData = res['data'];
                }
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.loadPage(res);

            } else {
                if (this.tabSelectedIdx == 0) {
                    this.content.removeAllChildren();
                } else {
                    this.contentNapRut.children.forEach((item) => {
                        item.active = false;
                    })
                }
            }
        });
    }
    private loadCard(time: string) {
        App.instance.showLoading(true);
        let params = { "c": 2001, "nickname": Configs.Login.Nickname, "token": Configs.Login.AccessToken, "transTime": encodeURI(time) };
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;

            if (res == "") {
                return;
            }
            App.instance.popupCardInfo.setListItem(JSON.stringify(res));
        })
    }
    private setDataItem(item, itemData) {
        var isJson = Utils.IsJsonString(itemData["description"]);
        if (isJson) {
            item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
            item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
            item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
            item.getChildByName("Coin").getComponent(cc.Label).font = itemData["moneyExchange"] > 0 ? this.fontNumber[0] : this.fontNumber[1];
            item.getChildByName("Coin").getComponent(cc.Label).fontSize = itemData["moneyExchange"] > 0 ? 8 : 7;
            item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
            if (itemData["actionName"] === undefined || itemData["actionName"] !== "CashOutByCard") {
                item.getChildByName("BtnView").active = false;
            } else {
                item.getChildByName("BtnView").active = true;
                item.getChildByName("BtnView").off("click");
                item.getChildByName("BtnView").on("click", () => {
                    this.loadCard(itemData["transactionTime"]);
                });
            }
            this.parseDescriptionJson(item, itemData);
        }
        else {
            item.getChildByName("Trans").getComponent(cc.Label).string = itemData["transId"];
            item.getChildByName("Time").getComponent(cc.Label).string = itemData["transactionTime"];
            item.getChildByName("Service").getComponent(cc.Label).string = this.convertNameThirdParty(itemData["serviceName"]);
            item.getChildByName("Coin").getComponent(cc.Label).string = (itemData["moneyExchange"] > 0 ? "+" : "") + Utils.formatNumber(itemData["moneyExchange"]);
            item.getChildByName("Coin").getComponent(cc.Label).font = itemData["moneyExchange"] > 0 ? this.fontNumber[0] : this.fontNumber[1];
            item.getChildByName("Coin").getComponent(cc.Label).fontSize = itemData["moneyExchange"] > 0 ? 8 : 7;
            item.getChildByName("Balance").getComponent(cc.Label).string = Utils.formatNumber(itemData["currentMoney"]);
            item.getChildByName("Desc").getComponent(cc.RichText).string = itemData["description"];
            if (itemData["actionName"] === undefined || itemData["actionName"] !== "CashOutByCard") {
                item.getChildByName("BtnView").active = false;
            } else {
                item.getChildByName("BtnView").active = true;
                item.getChildByName("BtnView").off("click");
                item.getChildByName("BtnView").on("click", () => {
                    this.loadCard(itemData["transactionTime"]);
                });
            }
        }
        item.active = true;
    }
    convertNameThirdParty(serviceName) {
        switch (serviceName) {
            case "WM_DEPOSIT":
            case "WM_WITHDRAW":
                return "Live casino WM";
            case "IBC2_DEPOSIT":
            case "IBC2_WITHDRAW":
                return "Thể Thao IBC";
            case "SBO_DEPOSIT":
            case "SBO_WITHDRAW":
                return "Thể Thao SBO";
            case "AG_DEPOSIT":
            case "AG_WITHDRAW":
                return "Live casino AG";
            case "CMD_DEPOSIT":
            case "CMD_WITHDRAW":
                return "Thể thao CMD368";
            case "FISH_DEPOSIT":
            case "FISH_WITHDRAW":
                return "Bắn Cá";
            case "EBET_DEPOSIT":
            case "EBET_WITHDRAW":
                return "Live EBET";
            case "Cashout":
                return "ដក​លុយ";
            case "190":
                return "Tài Xỉu Siêu Tốc";
            case "201":
                return "ការប្រោសលោះម៉ោងមាស";
            case "202":
                return "យោងមិត្តម្នាក់";
            default:
                return serviceName
        }
    }
    onScrollEvent(scrollview, eventType, customEventData) {
        if (eventType == cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {
            if (this.page < this.maxPage) {
                this.page++;
                this.loadData(false);
            }
        }
    }
}
