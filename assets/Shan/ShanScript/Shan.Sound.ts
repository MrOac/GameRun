// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioManager from "../../Lobby/LobbyScript/Script/common/Common.AudioManager";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Sound extends cc.Component {

    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property(cc.AudioClip)
    waiting: cc.AudioClip = null;
    @property(cc.AudioClip)
    clock: cc.AudioClip = null;
    @property(cc.AudioClip)
    startMusic: cc.AudioClip = null;
    @property(cc.AudioClip)
    dealCard: cc.AudioClip = null;
    @property(cc.AudioClip)
    betTime: cc.AudioClip = null;
    @property(cc.AudioClip)
    allIn: cc.AudioClip = null;
    @property(cc.AudioClip)
    bet: cc.AudioClip = null;
    @property(cc.AudioClip)
    draw: cc.AudioClip = null;
    @property(cc.AudioClip)
    notDraw: cc.AudioClip = null;
    @property(cc.AudioClip)
    compare: cc.AudioClip = null;
    @property(cc.AudioClip)
    dealOneCard: cc.AudioClip = null;
    @property(cc.AudioClip)
    openCard: cc.AudioClip = null;
    @property(cc.AudioClip)
    shan8: cc.AudioClip = null;
    @property(cc.AudioClip)
    shan9: cc.AudioClip = null;
    @property(cc.AudioClip)
    win: cc.AudioClip = null;
    @property(cc.AudioClip)
    lose: cc.AudioClip = null;
    @property(cc.AudioClip)
    tie: cc.AudioClip = null;
    @property(cc.AudioClip)
    chipDrop: cc.AudioClip = null;
    @property(cc.AudioClip)
    bankerWin: cc.AudioClip = null;
    @property(cc.AudioClip)
    winJackPot: cc.AudioClip = null;
    @property(cc.AudioClip)
    changeBanker: cc.AudioClip = null;
    @property(cc.AudioClip)
    bankerIsMe: cc.AudioClip = null;
    @property(cc.AudioClip)
    last3game: cc.AudioClip = null;
    @property(cc.AudioClip)
    tip: cc.AudioClip = null;
    @property(cc.AudioClip)
    dealerKiss: cc.AudioClip = null;
    @property(cc.AudioClip)
    otherShan: cc.AudioClip = null;
    @property(cc.AudioClip)
    compareLose: cc.AudioClip = null;
    @property(cc.AudioClip)
    compareWin: cc.AudioClip = null;
    @property(cc.AudioClip)
    threeOfAKind: cc.AudioClip = null;
    @property(cc.AudioClip)
    showAllCards: cc.AudioClip = null;

    playBgMusic() {
        // AudioManager.getInstance().playBackgroundMusic(this.);
    }
    playAudioEffect(clip: cc.AudioClip) {
        // this.effSound.clip = this.listAudio[indexAudio];
        // this.effSound.play();
        if (SPUtils.getSoundVolumn() > 0) {
            cc.audioEngine.play(clip, false, 1);
        }

    }
    stopAudioEffect() {
        cc.audioEngine.stopAll();
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
    playWaiting() {
        // //Global.audioManager.play(this.waiting);
        this.playAudioEffect(this.waiting);
    }

    playClock() {
        // //Global.audioManager.play(this.clock);
        this.playAudioEffect(this.clock)
    }

    playStart() {
        this.playAudioEffect(this.startMusic)
        // //Global.audioManager.play(this.startMusic);
    }

    playDealCard() {
        this.playAudioEffect(this.dealCard)
        // //Global.audioManager.play(this.dealCard);
    }

    playBetTime() {
        this.playAudioEffect(this.betTime)
        //Global.audioManager.play(this.betTime);
    }

    playAllIn() {
        // this.playAudioEffect(this.allIn)
        //Global.audioManager.play(this.allIn);
    }

    playBet() {
        this.playAudioEffect(this.bet)
        //Global.audioManager.play(this.bet);
    }

    playDrawClick() {
        // this.playAudioEffect(this.draw)
        //Global.audioManager.play(this.draw);
    }

    playNotDraw() {
        // this.playAudioEffect(this.notDraw)
        //Global.audioManager.play(this.notDraw);
    }

    playCompare() {
        // this.playAudioEffect(this.compare)
        //Global.audioManager.play(this.compare);
    }

    playDealOneCard() {
        this.playAudioEffect(this.dealOneCard)
        //Global.audioManager.play(this.dealOneCard);
    }

    playOpenCard() {
        this.playAudioEffect(this.openCard)
        //Global.audioManager.play(this.openCard);
    }

    playShan8() {
        // this.playAudioEffect(this.shan8)
        //Global.audioManager.play(this.shan8);
    }

    playShan9() {
        // this.playAudioEffect(this.shan9)
        //Global.audioManager.play(this.shan9);
    }

    playWin() {
        // this.playAudioEffect(this.win)
        //Global.audioManager.play(this.win);
    }

    playLose() {
        // this.playAudioEffect(this.lose)
        //Global.audioManager.play(this.lose);
    }

    playTie() {
        this.playAudioEffect(this.tie)
        //Global.audioManager.play(this.tie);
    }

    playChipDrop() {
        this.playAudioEffect(this.chipDrop)
        //Global.audioManager.play(this.chipDrop);
    }

    playBankerWin() {
        this.playAudioEffect(this.bankerWin)
        //Global.audioManager.play(this.bankerWin);
    }

    playWinJackPot() {
        this.playAudioEffect(this.winJackPot)
        //Global.audioManager.play(this.winJackPot);
    }

    playChangeBanker() {
        // this.playAudioEffect(this.changeBanker)
        //Global.audioManager.play(this.changeBanker);
    }

    playBankerIsMe() {
        // this.playAudioEffect(this.bankerIsMe)
        //Global.audioManager.play(this.bankerIsMe);
    }

    playLast3game() {
        this.playAudioEffect(this.last3game)
        //Global.audioManager.play(this.last3game);
    }

    playTip() {
        this.playAudioEffect(this.tip)
        //Global.audioManager.play(this.tip);
    }

    playDealerKiss() {
        this.playAudioEffect(this.dealerKiss)
        //Global.audioManager.play(this.dealerKiss);
    }

    playOtherShan() {
        // this.playAudioEffect(this.otherShan)
        //Global.audioManager.play(this.otherShan);
    }

    playCompareLose() {
        this.playAudioEffect(this.compareLose)
        //Global.audioManager.play(this.compareLose);
    }

    playCompareWin() {
        this.playAudioEffect(this.compareWin)
        //Global.audioManager.play(this.compareWin);
    }

    playThreeOfAKind() {
        // this.playAudioEffect(this.threeOfAKind)
        //Global.audioManager.play(this.threeOfAKind);
    }

    playShowAllCards() {
        this.playAudioEffect(this.showAllCards)
        //Global.audioManager.play(this.showAllCards);
    }
}
