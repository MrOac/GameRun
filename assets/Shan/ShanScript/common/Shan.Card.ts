import CARD_RANK from "../Model/Shan.CardRank";
import CARD_SUIT from "../Model/Shan.CardSuit";
import ShanRoom from "../Shan.Room";
import Res from "./Shan.Res";

const { ccclass, property } = cc._decorator;
const CARD_MODE = {
    SMALL: 0,
    MEDIUM: 1,
    BIG: 2,
}
@ccclass
export default class Card extends cc.Component {

    @property(cc.Node)
    highlightNode: cc.Node = null;
    @property(cc.Sprite)
    spCard: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    alasCardsMid: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    alasCardsBig1: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    alasCardsBig2: cc.SpriteAtlas = null;
    @property(sp.Skeleton)
    anim_laplanh: sp.Skeleton = null;

    private _cardId: any;
    private _rank: CARD_RANK;
    private _suit: CARD_SUIT;
    private _userData: any = {};
    private cardFrames: cc.SpriteFrame[] = new Array<cc.SpriteFrame>(53);
    private _dirty: any;
    private _isActionRunning: any;
    _mode: number;
    scale: any;

    onLoad() {
        this._cardId = -1;
        this._rank = null;
        this._suit = null;

        this.highlightNode && (this.highlightNode.active = false);

        this.show();
    }

    start() {
        // this.show();
    }

    init(rank, suit) {
        this.setRank(rank);
        this.setSuit(suit);
    }

    isDirty() {
        return this._dirty;
    }

    setIsActionRunning(boolean) { this._isActionRunning = boolean; }
    getIsActionRunning() { return this._isActionRunning; }

    _getSpriteFrame() {
        let mode = this._mode || CARD_MODE.MEDIUM;

        switch (mode) {
            case CARD_MODE.SMALL:
                break;
            case CARD_MODE.MEDIUM:
                if (!this._rank || !this._suit) {
                    return this.alasCardsMid.getSpriteFrame("labai_52");
                }
                else {
                    let realId = (this._cardId + 48) % 52;
                    // return ShanRoom.instance.cardFrames[(this._cardId+48)%52];// this.alasCardsMid.getSpriteFrame("card_" + this._cardId)
                    return this.alasCardsMid.getSpriteFrame("labai_" + realId)
                }
                break;
            case CARD_MODE.BIG:
                if (!this._rank || !this._suit) {
                    // cc.log('_getSpriteFrame0', this._cardId)
                    // return ShanRoom.instance.cardFrames[52];// this.alasCardsBig2.getSpriteFrame("card_52")
                    return this.alasCardsBig2.getSpriteFrame("labai_52")
                }
                else {
                    // cc.log('_getSpriteFrame1', this._cardId);
                    let realId = (this._cardId + 48) % 52;
                    // let sp = ShanRoom.instance.cardFrames[(this._cardId+48)%52];//this.alasCardsBig1.getSpriteFrame("card_" + this._cardId) || this.alasCardsBig2.getSpriteFrame("card_" + this._cardId);
                    let sp = this.alasCardsBig1.getSpriteFrame("labai_" + realId) || this.alasCardsBig2.getSpriteFrame("labai_" + realId);
                    return sp;
                }

                break;
            default:
                // return ShanRoom.instance.cardFrames[52]; //this.alasCardsMid.getSpriteFrame("card_52")
                return this.alasCardsMid.getSpriteFrame("labai_52");
                break;
        }

    }

    _updateSpriteFrame() {
        if (this.spCard) {
            this.spCard.spriteFrame = this._getSpriteFrame();
            if (this.spCard.sizeMode == cc.Sprite.SizeMode.CUSTOM) {
                return;
            }
            let mode = this._mode || CARD_MODE.MEDIUM;
            switch (mode) {
                case CARD_MODE.SMALL:
                break;
            case CARD_MODE.MEDIUM:
                this.node.height = 116;
                this.node.width = 90;
                break;
            case CARD_MODE.BIG:
                this.node.height = 417;
                this.node.height = 320;
                break;
            default:
                return ShanRoom.instance.cardFrames[52]; //this.alasCardsMid.getSpriteFrame("card_52")
                break;
            }
        }
    }

    getRank() {
        return this._rank;
    }

    setRank(value) {
        if (!(value instanceof CARD_RANK))
            return;

        this._rank = value;
        if (this._suit) {
            this._cardId = (this._rank.valueOf() - 2) * 4 + this._suit.valueOf();
        }
    }

    getSuit() {
        return this._suit;
    }

    setSuit(value) {
        if (!(value instanceof CARD_SUIT))
            return;

        this._suit = value;
        if (this._rank) {
            this._cardId = (this._rank.valueOf() - 2) * 4 + this._suit.valueOf();
        }
    }

    getId() {
        return this._cardId;
    }

    setId(value, isShow?: boolean) {
        if (value >= 52)
            return;

        // cc.log("set id", value, isShow);

        this._cardId = value;
        this._rank = CARD_RANK.ALL[Math.floor(this._cardId / 4) + 2];
        this._suit = CARD_SUIT.ALL[this._cardId % 4];

        if (isShow) this.show();
    }

    setTargetPos(pos) {
        var userData = this._userData || {};
        userData.targetPos = pos;
        this._userData = userData;
    }

    getTargetPos() {
        var userData = this._userData || {};
        return userData.targetPos || this.node.position;
    }

    setTargetScale(s) {
        var userData = this._userData || {};
        userData.targetScale = s;
        this._userData = userData;
    }

    getTargetScale() {
        var userData = this._userData || {};
        return userData.targetScale || this.node.scale;
    }

    stopAllActions() {
        this.node.stopAllActions();
        this.node.scale = this.getTargetScale();
        this.node.setPosition(this.getTargetPos());
    }

    highlight() {
        this.highlightNode && (this.highlightNode.active = true);
    }

    removeHighlight() {
        this.highlightNode && (this.highlightNode.active = false);
    }

    setMode(mode) {
        this._mode = mode;
    }

    show() {
        this._updateSpriteFrame();
    }

    flipAndShow() {
        let scale = this.node.scale;
        cc.tween(this.node)
            .to(0.1, { scaleX: 0 })
            .call(() => this.show())
            .to(0.1, { scaleX: scale })
            .start();
    }

    setDarkMode(boolean) {
        boolean ?
            this.spCard.node.color = new cc.Color(100, 100, 100, 255) :
            this.spCard.node.color = new cc.Color(255, 255, 255, 255);
    }
    clean() {
        this._cardId = -1;
        this._rank = null;
        this._suit = null;
        this.show();
    }

    hide() {
        this.spCard.spriteFrame = this.alasCardsMid.getSpriteFrame("card_52");
    }
    setEffectCardBinh(delay) {
        if (!this.anim_laplanh.node) return;
        this.anim_laplanh.node.active = true;
        this.anim_laplanh.setAnimation(0, "animation", true);

        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(() => {
            this.anim_laplanh.node.active = false;
        })));
    }

    hideEffectCardBinh() {
        if (!this.anim_laplanh.node) return;
        this.anim_laplanh.node.active = false;
        this.anim_laplanh.node.stopAllActions();
    }


}
