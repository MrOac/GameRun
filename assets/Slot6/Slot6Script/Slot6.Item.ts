

const { ccclass, property } = cc._decorator;

const enum SLOT6_ID_ITEM {
    JACKPOT = 3,
    BONUS = 1,
    WILD = 2,
    SCATTER = 0,
    X500 = 4,
    X375 = 5,
    X275 = 6,
    X150 = 7,
    X50 = 8,
    X25 = 9,
    X5 = 10
}

@ccclass
export default class Slot6Item extends cc.Component {



    @property(sp.Skeleton)
    skeItem: sp.Skeleton = null;
    @property(cc.Sprite)
    sprItem: cc.Sprite = null;

    @property(sp.SkeletonData)
    skeDataWild: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    skeDataJackpot: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    skeDataBonus: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    skeDataScatter: sp.SkeletonData = null;

    @property(cc.SpriteAtlas)
    sprAtlast: cc.SpriteAtlas = null;

    @property(sp.SkeletonData)
    aniItem1: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem2: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem3: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem4: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem5: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem6: sp.SkeletonData = null;
    @property(sp.SkeletonData)
    aniItem7: sp.SkeletonData = null;

    private mId: number = -1;
    animName = "";

    public getId() {
        return this.mId;
    }

    public setId(pId: number, isWin = false) {
        this.mId = pId;
        this.sprItem.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        switch (this.mId) {
            case SLOT6_ID_ITEM.JACKPOT:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("jackpot")
                this.skeItem.skeletonData = this.skeDataJackpot;
                this.skeItem.animation = isWin ? "ani_jackpot_win" : "ani_jackpot_lose";
                this.animName = isWin ? "ani_jackpot_win" : "ani_jackpot_lose";
                break;
            case SLOT6_ID_ITEM.WILD:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("wild")
                this.skeItem.skeletonData = this.skeDataWild;
                this.skeItem.animation = isWin ? "ani_wild_win" : "ani_wild_lose";
                this.animName = isWin ? "ani_wild_win" : "ani_wild_lose";
                break;
            case SLOT6_ID_ITEM.BONUS:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("bonus");
                this.skeItem.skeletonData = this.skeDataBonus;
                this.skeItem.animation = isWin ? "ani_bonus_win" : "ani_bonus_lose";
                this.animName = isWin ? "ani_bonus_win" : "ani_bonus_lose";
                break;
            case SLOT6_ID_ITEM.SCATTER:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("scatter");
                this.skeItem.skeletonData = this.skeDataScatter;
                this.skeItem.animation = isWin ? "ani_scatter_win" : "ani_scatter_lose";
                this.animName = isWin ? "ani_scatter_win" : "ani_scatter_lose";
                break;
            case SLOT6_ID_ITEM.X500:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_7");
                this.skeItem.skeletonData = this.aniItem7;
                this.skeItem.animation = isWin ? "ani_item7_win" : "ani_item7_lose";
                this.animName = isWin ? "ani_item7_win" : "ani_item7_lose";
                break;
            case SLOT6_ID_ITEM.X375:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_6");
                this.skeItem.skeletonData = this.aniItem6;
                this.skeItem.animation = isWin ? "ani_item6_win" : "ani_item6_lose";
                this.animName = isWin ? "ani_item6_win" : "ani_item6_lose";
                break;
            case SLOT6_ID_ITEM.X275:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_5");
                this.skeItem.skeletonData = this.aniItem5;
                this.skeItem.animation = isWin ? "ani_item5_win" : "ani_item5_lose";
                this.animName = isWin ? "ani_item5_win" : "ani_item5_lose";
                break;
            case SLOT6_ID_ITEM.X150:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_4");
                this.skeItem.skeletonData = this.aniItem4;
                this.skeItem.animation = isWin ? "ani_item4_win" : "ani_item4_lose";
                this.animName = isWin ? "ani_item4_win" : "ani_item4_lose";
                break;
            case SLOT6_ID_ITEM.X50:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_3");
                this.skeItem.skeletonData = this.aniItem3;
                this.skeItem.animation = isWin ? "ani_item3_win" : "ani_item3_lose";
                this.animName = isWin ? "ani_item3_win" : "ani_item3_lose";
                break;
            case SLOT6_ID_ITEM.X25:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_2");
                this.skeItem.skeletonData = this.aniItem2;
                this.skeItem.animation = isWin ? "ani_item2_win" : "ani_item2_lose";
                this.animName = isWin ? "ani_item2_win" : "ani_item2_lose";
                break;
            case SLOT6_ID_ITEM.X5:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_1");
                this.skeItem.skeletonData = this.aniItem1;
                this.skeItem.animation = isWin ? "ani_item1_win" : "ani_item1_lose";
                this.animName = isWin ? "ani_item1_win" : "ani_item1_lose";
                break;
        }
        this.sprItem.node.setContentSize(cc.size(this.sprItem.node.width / 1.55, this.sprItem.node.height / 1.55));
    }
    showItemAnim() {
        this.skeItem.node.color = cc.Color.WHITE;
        this.skeItem.node.active = true;
        this.sprItem.node.active = false;
        this.skeItem.setAnimation(0, this.animName, true);
    }
    setIdBlur(id) {
        this.sprItem.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        switch (this.mId) {
            case SLOT6_ID_ITEM.JACKPOT:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("jackpot_blur")
                break;
            case SLOT6_ID_ITEM.WILD:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("wild")
                break;
            case SLOT6_ID_ITEM.BONUS:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("bonus_blur");
                break;
            case SLOT6_ID_ITEM.SCATTER:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("scatter_blur");
                break;
            case SLOT6_ID_ITEM.X500:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_7_blur");
                break;
            case SLOT6_ID_ITEM.X375:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_6_blur");
                break;
            case SLOT6_ID_ITEM.X275:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_5_blur");
                break;
            case SLOT6_ID_ITEM.X150:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_4_blur");
                break;
            case SLOT6_ID_ITEM.X50:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_3_blur");
                break;
            case SLOT6_ID_ITEM.X25:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_2_blur");
                break;
            case SLOT6_ID_ITEM.X5:
                this.sprItem.spriteFrame = this.sprAtlast.getSpriteFrame("item_1_blur");
                break;
        }
        this.sprItem.node.setContentSize(cc.size(this.sprItem.node.width / 1.45, this.sprItem.node.height / 1.45));
    }
    offItemAnim() {
        this.sprItem.node.active = true;
        this.skeItem.node.active = false;
    }
}
