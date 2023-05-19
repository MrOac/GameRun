// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Card from "./common/Shan.Card";
import { Constant } from "./Shan.Contants";
import Player from "./Shan.Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelfPlayer extends Player {
    
    instantlyAddCard(cardIds: number[], isShow: boolean, nodeHasCard: cc.Node) {
        if (cardIds.length <= 0)
            return;
        this._cardData = cardIds;

        var cardStartPosX = this._getCardStartPosX();

        for (var i = 0; i < cardIds.length; i++) {
            var c = cc.instantiate(this.prefabCard);
            c.zIndex = 10;
            c.x = cardStartPosX + Constant.SHANKOEMEE_CARD_ON_HAND_SCALE * Constant.SHANKOEMEE_CARD_ON_HAND_GAP * i;
            c.y = this._getCardPos().y + Constant.SHANKOEMEE_CARD_ON_HAND_Y_OFFSET
            c.scale = Constant.SHANKOEMEE_CARD_ON_HAND_SCALE;
            nodeHasCard.addChild(c);

            var card = c.getComponent(Card);
            if (isShow) {
                card.setId(cardIds[i], isShow);
            }

            this._addCard(card);
        }

        cc.tween(nodeHasCard)
            .delay(0.1)
            .call(() => {
                this._updateCardRotation();
            })
            .start();

        if (isShow) {
            this.showGroupName();
            this.showMultiple();
        }

        return this._cards;
    }

    addCard(card) {
        if (this._addCard(card)) {
            var cardStartPosX = this._getCardStartPosX();

            var newPos = cc.v2(cardStartPosX + Constant.SHANKOEMEE_CARD_ON_HAND_SCALE * Constant.SHANKOEMEE_CARD_ON_HAND_GAP * (this._cards.length - 1), this._getCardPos().y + Constant.SHANKOEMEE_CARD_ON_HAND_Y_OFFSET)
            card.setTargetPos(newPos);
            card.setTargetScale(Constant.SHANKOEMEE_CARD_ON_HAND_SCALE);

            card.node.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.2, newPos),
                    cc.rotateBy(0.2, 180),
                    cc.scaleTo(0.2, Constant.SHANKOEMEE_CARD_ON_HAND_SCALE)
                ),
                cc.callFunc(function () {
                    this._updateCardRotation();
                }.bind(this)))
            )
        }
    }

    showCards() {
        // var cardStartPosX = this._getCardStartPosX();
        for (var i = 0; i < this._cards.length; i++) {
            var c = this._cards[i];
            // c.stopAllActions();
            // c.setTargetPos(cc.v2(cardStartPosX + Constant.SHANKOEMEE_CARD_ON_HAND_GAP * i, this.y + Constant.SHANKOEMEE_CARD_ON_HAND_Y_OFFSET));
            // c.setTargetScale(Constant.SHANKOEMEE_CARD_ON_HAND_SCALE);
            c.setId(this._cardData[i], true);
        }

        this.node.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function () {
                // this.showGroupName();
                // this.showMultiple();
                this.showAllCards();
            }.bind(this))
        ))
    }

    _getCardStartPosX() {
        return this.node.getPosition().x + 135;
    }
}
