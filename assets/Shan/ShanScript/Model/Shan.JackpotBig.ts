const { ccclass, property } = cc._decorator;
@ccclass
export default class JackpotBig extends cc.Component { 
    @property(sp.Skeleton)
    animJackpot: sp.Skeleton = null;
    @property(cc.Label)
    lbChip: cc.Label = null;
    @property(cc.AudioClip)
    soundJackPot: cc.AudioClip = null;
    start() {

    }

    showWinJackpot(chips) {
        // this.animJackpot.node.active = true;
        // this.animJackpot.animation = i18n.t('anim.jackpotbig')
        // this.lbChip.string = '';
        // Global.audioManager.play(this.soundJackPot);

        // animationChangeNumber(this.lbChip, chips, 0.5, 100, 1);

        // cc.tween(this.node)
        //     .delay(5)
        //     .removeSelf()
        //     .start();
    }
}