import Utils from "../Script/common/Utils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupIAP extends cc.Component {

    @property(cc.Node)
    prefab: cc.Node = null;
    @property(cc.Node)
    packs: cc.Node = null;
    @property(cc.ScrollView)
    container: cc.ScrollView = null;

    saveChips: number;
    saveUSD: number;
    totalHeightContent: number = 0;
    lowerLimit: number = 0;
    countRow: number = 0;
    sizeRow: number = 0;
    data = {
        "pack1": { "name": "pack1", "priceChips": 18000, "priceUSD": 0.99, "bonusRate":0, "isHot" : true },
        "pack2": { "name": "pack2", "priceChips": 95000, "priceUSD": 3.99, "bonusRate": 0 , "isHot" : false },
        "pack3": { "name": "pack3", "priceChips": 200000, "priceUSD": 8.99, "bonusRate": 0 , "isHot" : false },
        "pack4": { "name": "pack4", "priceChips": 525000, "priceUSD": 21.99, "bonusRate": 0 , "isHot" : false },
        "pack5": { "name": "pack5", "priceChips": 1110000, "priceUSD": 44.99, "bonusRate": 0 , "isHot" : false },
        "pack6": { "name": "pack6", "priceChips": 2300000, "priceUSD": 89.99, "bonusRate": 0 , "isHot" : false }
    };

    onLoad() {
        this.packs.removeAllChildren();
        let length = Object.keys(this.data).length;
        this.countRow = Math.floor(length / 2) + (length % 2);
        for (let i = 0; i < length; i++) {
            let item = cc.instantiate(this.prefab);
            let pack = Object.keys(this.data)[i];
            item.parent = this.packs;
            item.setSiblingIndex(i);
            item.name = this.data[pack].name;
            item.zIndex = i;
            this.totalHeightContent += item.height;
            this.detailPack(item, this.data[pack].priceChips, this.data[pack].priceUSD, this.data[pack].isHot, this.data[pack].bonusRate , this.data[pack].name);
        }
        this.sizeRow =((this.totalHeightContent / length) * this.countRow);
        this.lowerLimit = this.sizeRow - this.container.content.height;
        this.checkSizeScrollViewEvent();
    }
    checkSizeScrollViewEvent() {
        let layoutPacks = this.packs.getComponent(cc.Layout);
        if ((this.container.content.height > this.totalHeightContent / 2)) {
            layoutPacks.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layoutPacks.paddingTop = (this.container.content.height - this.sizeRow) / 2;
        }
    }
    onScrollEvent() {
        this.container.stopAutoScroll();
        let upperLimit = this.container.content.y;
        if (upperLimit < 0 || this.lowerLimit <= 0) {
            this.container.scrollToTop();
        }
        if (upperLimit > this.lowerLimit && this.lowerLimit > 0) {
            this.container.content.y = this.lowerLimit;
        }
    }
    detailPack(pack: cc.Node, priceChip: number, priceUsd: number, isHot: boolean, bonusRate:number, eventClick: string) {
        let contentPack = pack.getChildByName("content");
        let priceNode = contentPack.getChildByName("price");
        let priceChips = priceNode.getChildByName("chip");
        let priceUSD = priceNode.getChildByName("usd");
        let effectX2 = contentPack.getChildByName("x2_icon");
        let valueChip: cc.Label = priceChips.getChildByName("value").getComponent(cc.Label);
        let valueUSD: cc.Label = priceUSD.getChildByName("value").getComponent(cc.Label);
        let btnBuyEvent = contentPack.getComponentInChildren(cc.Button);
        btnBuyEvent.clickEvents[0].customEventData = eventClick;
        valueUSD.string = Utils.formatNumber(priceUsd);
        valueChip.string = Utils.formatNumber(priceChip)
        effectX2.active = isHot;
    }
    actBuy(event: cc.Event.EventTouch, dataClick) {
        let btnslect = this.data[dataClick];
        this.saveChips = btnslect.priceChips;
        this.saveUSD = btnslect.priceUSD;
        console.log("this.saveChips ", this.saveChips);
        console.log("this.saveUSD ", this.saveUSD);
    }
}
