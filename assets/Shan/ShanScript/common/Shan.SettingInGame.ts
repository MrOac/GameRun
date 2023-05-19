import BroadcastReceiver from "../../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import SPUtils from "../../../Lobby/LobbyScript/Script/common/SPUtils";

const { ccclass, property } = cc._decorator;
const SP_BTN_MAP = {
    shankoemee: 0,
    baucua: 1,
    luckybork: 1,
    tienlen: 0,
}
@ccclass
export default class SettingInGame extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    spSoundOff: cc.Node = null;
    @property(cc.Node)
    spMusicOff: cc.Node = null;

    @property(cc.Node)
    bgClose: cc.Node = null;
    @property(cc.Prefab)
    prefabGuide: cc.Prefab = null;
    @property(cc.Sprite)
    spBtnSetting: cc.Sprite = null;
    @property(cc.SpriteFrame)
    lstSpriteFrameBtn: cc.SpriteFrame[] = [];
    
    isOnMusic: boolean;
    isOnSound: boolean;
    private _ws: any;
    private _gameLayer: any;
    private _isShow: boolean;

    constructor() {
        super();
        this.isOnMusic = false;
        this.isOnSound = false;
        this._ws = null;
        this._gameLayer = null;

        this._isShow = false;
    }
    // LIFE-CYCLE CALLBACKS:

    init(ws, gameLayer, gamename?: string) {
        this._ws = ws;
        this._gameLayer = gameLayer;

        // if(gamename == 'baucua') {
        // this.spBtnSetting.spriteFrame = this.lstSpriteFrameBtn[SP_BTN_MAP[this._gameLayer._gameName]];
        // }

    }

    onLoad() {
        // this.isOnMusic = Global.audioManager.isMusicEnabled();
        // this.isOnSound = Global.audioManager.isEffectEnabled();

        // this.spSoundOff.active = !this.isOnSound;
        // this.spMusicOff.active = !this.isOnMusic;
        this.isOnMusic = SPUtils.getMusicVolumn() > 0;
        this.isOnSound = SPUtils.getSoundVolumn() > 0;
        this.spSoundOff.active = !this.isOnSound;
        this.spMusicOff.active = !this.isOnMusic;
    }

    start() {
        
    }

    onSoundClick() {
        if (this.isOnSound) {
            this.isOnSound = false;
            this.spSoundOff.active = true;

            // Global.audioManager.setEffectEnabled(false);
        }

        else {
            this.isOnSound = true;
            this.spSoundOff.active = false;

            // Global.audioManager.setEffectEnabled(true);
        }
        SPUtils.setSoundVolumn(this.isOnSound ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
        this.onMenuClick();
    }

    onMusicClick() {
        if (this.isOnMusic) {
            this.isOnMusic = false;
            this.spMusicOff.active = true;

            // Global.audioManager.setMusicEnabled(false);
        }

        else {
            this.isOnMusic = true;
            this.spMusicOff.active = false;

            // Global.audioManager.setMusicEnabled(true);
        }
        SPUtils.setMusicVolumn(this.isOnMusic ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);

        this.onMenuClick();
    }

    onGuideClick() {
        // this.wvGuide.url = ;
        // this.guideNode.active = true;

        let guide = cc.instantiate(this.prefabGuide);

        this.node.parent.addChild(guide, cc.macro.MAX_ZINDEX, 'guide');
        // guide.getComponent(GuideNode).showSlide();
        // guide.getComponent(GuideNode).initGuide(this._gameLayer._gameName);

        // this._gameLayer.basePopUpActive = guide.getComponent(GuideNode);

        this.onMenuClick();
    }

    onReMatchClick() {
        this._gameLayer.onReMatchClick();
        this.onMenuClick();
    }

    onMenuClick() {
        this._isShow = !this._isShow;
        // let posY = (this._gameLayer._gameName == 'baucua' || this._gameLayer._gameName == 'luckybork') ? 100 : 50;
        let posY = (this.spBtnSetting.node.y + this.spBtnSetting.node.height/2)-this.bg.height/2 - this.bg.parent.y;
        if (this._isShow) {
            this.bg.active = true;
            cc.tween(this.bg)
                .to(0.1, { y: posY }, { easing: 'backOut' })
                .start();
            this.bgClose.active = true;
        }
        else {
            this.bg.active = true;
            cc.tween(this.bg)
                .to(0.1, { y: 400 }, { easing: 'backIn' }).call(() => {
                    this.bg.active = false;
                })
                .start();
            this.bgClose.active = false;
        }
    }
    // update (dt) {},
 }