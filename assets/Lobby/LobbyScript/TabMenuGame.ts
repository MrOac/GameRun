

import TabsListGame from "./Lobby.TabsListGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabMenuGame extends cc.Component {

    @property(cc.Node)
    tabGameSport: cc.Node = null;
    @property(cc.Node)
    tabGameLive: cc.Node = null;
    @property(cc.Node)
    tabBanner: cc.Node = null;
    @property(cc.Node)
    tabGameSlot: cc.Node = null;
    @property(cc.Node)
    tabGameMini: cc.Node = null;
    @property(cc.Node)
    tabGameCard: cc.Node = null;
    @property(cc.ScrollView)
    contentScroll: cc.ScrollView = null;

    @property([cc.Node])
    listTab: cc.Node[] = [];

    @property([cc.Toggle])
    listToggle: cc.Toggle[] = [];

    @property([cc.Node])
    listAllGame: cc.Node[] = [];
    @property([cc.Node])
    listLiveGame: cc.Node[] = [];
    @property([cc.Node])
    listSlotGame: cc.Node[] = [];
    @property([cc.Node])
    listCardGame: cc.Node[] = [];
    @property([cc.Node])
    listMiniGame: cc.Node[] = [];
    @property([cc.Node])
    listGameSport: cc.Node[] = [];
    @property(TabsListGame)
    tabListGame: TabsListGame = null;

    onBtnTabAll() {
        this.tabBanner.setSiblingIndex(0);
        this.tabGameCard.setSiblingIndex(1);
        this.tabGameMini.setSiblingIndex(2);
        this.tabGameSlot.setSiblingIndex(3);
        this.tabGameSport.setSiblingIndex(4);
        this.tabGameLive.setSiblingIndex(5);

        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }

    onBtnTabSport() {
        this.tabGameSport.setSiblingIndex(0);
        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }

    onBtnTabLive() {
        this.tabGameLive.setSiblingIndex(0);
        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }
    onBtnTabSlot() {
        this.tabBanner.setSiblingIndex(0);
        this.tabGameSlot.setSiblingIndex(1);
        this.tabGameCard.setSiblingIndex(2);
        this.tabGameMini.setSiblingIndex(3);
        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }
    onBtnTabMini() {
        this.tabBanner.setSiblingIndex(0);
        this.tabGameMini.setSiblingIndex(1);
        this.tabGameSport.setSiblingIndex(2);
        this.tabGameSlot.setSiblingIndex(3);
        this.tabGameCard.setSiblingIndex(4);
        this.tabGameLive.setSiblingIndex(5);

        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }
    onBtnTabCard() {
        this.tabBanner.setSiblingIndex(0);
        this.tabGameCard.setSiblingIndex(1);
        this.tabGameMini.setSiblingIndex(2);
        this.tabGameSlot.setSiblingIndex(3);
        this.tabGameSport.setSiblingIndex(4);
        this.tabGameLive.setSiblingIndex(5);

        this.contentScroll.content.position = new cc.Vec3(-2000, 0, 0);
        this.contentScroll.scrollToPercentHorizontal(0, .8);
    }
    private index = 0;
    start() {
        this.index = 0;
        this.onBtnChangeTab(null, this.index);
        this.listAllGame.push(...this.listLiveGame);
        this.listAllGame.push(...this.listCardGame);
        this.listAllGame.push(...this.listMiniGame);
        this.listAllGame.push(...this.listSlotGame);
        this.listAllGame.push(...this.listGameSport);
    }

    onBtnChangeTab(obj, param) {
        if (this.index == param) return;
        this.listToggle[this.index].isChecked = false;
        this.listToggle[param].isChecked = true;
        this.index = param;
        this.listAllGame.forEach((item) => {
            item.active = false;
            item.opacity = 0;
        });
        let listGame = [];
        switch (param) {
            case "0":
                listGame = this.listAllGame;
                break;
            case "1":
                listGame = this.listMiniGame;
                break;
            case "2":
                listGame = this.listCardGame;
                break;
            case "3":
                listGame = this.listSlotGame;
                break;
            case "4":
                listGame = this.listLiveGame;
                break;
            case "5":
                cc.log("parammm==", this.listGameSport);
                listGame = this.listGameSport;
                break;
        }

        listGame.forEach((item) => {
            item.active = true;
            cc.tween(item).to(0.3, { opacity: 255 }, { easing: cc.easing.sineIn }).start();
        });
        setTimeout(() => {
            this.tabListGame.changeTabGame();
            this.tabListGame.onScrollEvent();
        }, 50);

    }
}
