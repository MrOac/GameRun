import Http from "../../Loading/src/Http";
import BundleControl from "./BundleControl";
import Configs from "./Configs";
import { Global } from "./Global";
import IapManager from "./IapManager";
import NativeHelper from "./NativeHelper";
import UtilsNative from "./UtilsNative";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import App from "../../Lobby/LobbyScript/Script/common/App";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    lblStatus: cc.Label = null;
    @property(cc.Label)
    lbTips: cc.Label = null;
    @property(cc.Slider)
    nodeSlider: cc.Slider = null;

    // @property(cc.Slider)
    // slider :cc.Slider = null;

    @property(cc.Sprite)
    spriteProgress: cc.Sprite = null;
    listSkeData = [];
    listTips = [
        {
            vi: "កុំភ្លេចចូលជារៀងរាល់ថ្ងៃ ដើម្បីទទួលបានប្រាក់រង្វាន់ចូលរួមដោយឥតគិតថ្លៃ!",
            en: "Dont forget login every day to get free attendance bonus!"
        },
        {
            vi: "ឃាតករ ១៣៖ ប្រឆាំងការបន្លំ សុវត្ថិភាពដាច់ខាត",
            en: "Killer 13: Anti cheating,absolute safety"
        },
        {
            vi: "ការបញ្ចូលសាច់ប្រាក់លើកដំបូងអាចទទួលបានប្រាក់រង្វាន់រហូតដល់ 790K",
            en: "First cash-in can receive bonus up to 790K"
        },
        {
            vi: "ក្រុមថែទាំអតិថិជនគាំទ្រតាមអ៊ីនធឺណិត 24/24!",
            en: "Customer care team support online 24/24!"
        },
        {
            vi: "vietkieu888.com សាច់ប្រាក់រហ័ស ដកប្រាក់ និងសុវត្ថិភាពជានិច្ច",
            en: "vietkieu888.com quick cashin,cashout and alway safety!"
        },
    ]
    rateBouns: number = 0;
    progressLoading = 0;
    scene: any;
    _assetNeedLoaded: boolean;
    _assetSenceLoaded: boolean;
    _listBundle: string[] = ['Lobby','BaCay','BaiCao', 'Lieng', 'MauBinh', 'Poker', 'Sam', 'Shan', 'Slot1', 'Slot10', 'Slot11Bikini', 'Slot3', 'Slot4', 'Slot6', 'Slot7', 'Slot8', 'TienLen'];

    _listSceneGame: string[] = [];
    onLoad() {
        this.initListener();

    }
    start() {
        cc.assetManager.downloader.maxConcurrency = 20;
        cc.assetManager.downloader.maxRequestsPerFrame = 6;
        this.showTips();
        this.startGame();
    }
    startGame() {
        this.lblStatus.string = "ផ្ទុកធនធានពីម៉ាស៊ីនមេ។...";
        this.spriteProgress.fillRange = 0;
        this.nodeSlider.progress = 0;
        this.initialize();

        if (Configs.App.IS_LOCAL == false) {
            Http.get("https://res.vietkieu888.com/assets/AssetBundleVersion.json", {}, (err, data) => {
                BundleControl.init(data);
                //this._listBundle = Object.keys(data);
                this.loadLobby();
            });

        }
        else {
            this.loadLobby();
        }
        // UtilsNative.getDeviceId();
    }
    initialize() {
        let firstOpen = cc.sys.localStorage.getItem("firstOpen");
        if (!firstOpen) {
            cc.sys.localStorage.setItem("firstOpen", 1);
            cc.log("is Mobile" + cc.sys.isMobile + " is inative", cc.sys.isNative, " os ", cc.sys.os);
            cc.sys.localStorage.setItem('vietkieu888-deviceid', (cc.sys.isMobile && cc.sys.isNative) ? NativeHelper.callNative("getRandomUUID", null) : this.randomUUID())
            cc.log("DEVICE ID ", cc.sys.localStorage.getItem("vietkieu888-deviceid"));
        }
        if (cc.sys.isMobile && cc.sys.isNative) {
            console.log("INIT IAP");
            // IapManager.getInstance().init();
        }
    }
    initListener() {
        window.NativeListener = {}
        window.NativeListener.nativeHelperListener = {};
        window.NativeListener.setListener = (name, listener) => {
            window.NativeListener.nativeHelperListener[name] = listener;
            cc.log("setListener", JSON.stringify(window.NativeListener.nativeHelperListener), name, listener);
        },
            window.NativeListener.removeListener = (name) => {
                delete window.NativeListener.nativeHelperListener[name];
            },
            window.NativeListener.onReceive = (name, args) => {
                cc.log('native receive', name, args, JSON.stringify(window.NativeListener.nativeHelperListener));
                if (window.NativeListener.nativeHelperListener[name]) {
                    args = args || [];

                    window.NativeListener.nativeHelperListener[name] && window.NativeListener.nativeHelperListener[name](args);
                }
                else
                    cc.error("WARNING: listener " + name + " not found");
            }
    }
    randomUUID() {
        return uuidv1();
    }
    loadAllBundle() {
        try {
            for (let i = 0; i < this._listBundle.length; i++) {
                const element = this._listBundle[i];
                BundleControl.preloadSceneInBundle(element, element,(finish: number, total: number)=>{
                    // self.progressLoading = (finish / total) * 0.7 + self.rateBouns;
                    // self.lblStatus.string = element + parseInt(self.progressLoading * 100) + "%";
                    // self.spriteProgress.fillRange = self.progressLoading;
                    // self.nodeSlider.progress = self.spriteProgress.fillRange;
                })
            }
        } catch (error) {
            console.log(error);
        }

    }

    loadLobby() {
        var self = this;
        let time = new Date().getTime();
        BundleControl.loadBundle("Lobby", (bundle) => {
            Global.BundleLobby = bundle;
            let size = this.listSkeData.length;
            for (let i = 0; i < size; i++) {
                let path = this.listSkeData[i];
                bundle.load(path, sp.SkeletonData, (err, asset) => {
                    if (err) {
                        //  cc.log("err load ske:", err);
                        return;
                    }
                    // cc.log("load Success Ske Data:" + path);
                });
            }
            bundle.loadScene('Lobby', function (finish, total, item) {
                self.progressLoading = (finish / total) * 0.7 + self.rateBouns;
                self.lblStatus.string = "Loading: " + parseInt(self.progressLoading * 100) + "%";
                self.spriteProgress.fillRange = self.progressLoading;
                self.nodeSlider.progress = self.spriteProgress.fillRange;
            }, (err1, scene) => {
                if (err1 != null) {
                    //  cc.log("Error Load Scene Lobby:", JSON.stringify(err1));

                } else
                    this._assetSenceLoaded = true;
                // cc.sys.localStorage.setItem("SceneLobby", scene);
                // cc.director.runScene(scene);
                self.scene = scene;
                self.checkCompleloading();
                let time2 = new Date().getTime();
                //  cc.log("Time Delta=" + ((time2 - time) / 1000));
                this.loadAllBundle();
            });
            this.preloadAssetNeed();
            // bundle.loadDir("PrefabPopup", cc.Prefab, (err, arrPrefab) => {
            //     if (err) {
            //         //  cc.log("Error Bundle LoadDir PrefabPopup!");
            //         return;
            //     }
            // });
        })

    }
    showTips() {
        this.schedule(() => {
            this.lbTips.string = this.getStrTips();
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1)
    }
    getStrTips() {
        let langCode = cc.sys.localStorage.getItem("langCode");
        if (langCode == null) {
            langCode = "vi"
        }
        let strTip = this.listTips[this.randomRangeInt(0, this.listTips.length)];
        return strTip[langCode];
    }
    randomRangeInt(min: number, max: number): number {
        //Returns a random number between min (inclusive) and max (inclusive)
        //Math.floor(Math.random() * (max - min + 1)) + min;

        //Returns a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min)) + min;
    }

    preloadAssetNeed() {
        return new Promise((resolve: Function) => {
            let self = this;
            Global.BundleLobby.load("PrefabPopup/PopupLogin", (finish, total) => {
                this.rateBouns = (finish / total) * 0.3;
                // self.progressLoading += this.rateBouns;
                // self.lblStatus.string = "ဂိမ်းကို ဖွင့်နေသည်။ " + self.progressLoading * 100 + "%";
                // self.spriteProgress.fillRange = self.progressLoading;
                // self.nodeSlider.progress = self.spriteProgress.fillRange;
            }, (err, prefab) => {
                this._assetNeedLoaded = true;
                BundleControl.poolCache["PrefabPopup/PopupLogin"] = prefab as cc.Prefab;
                this.checkCompleloading();
                resolve();
                Global.BundleLobby.loadDir("PrefabPopup", cc.Prefab, (err, arrPrefab) => {
                    if (err) {
                        //  cc.log("Error Bundle LoadDir PrefabPopup!");
                        return;
                    }
                });
            })
        })
    }

    checkCompleloading() {
        if (this._assetNeedLoaded && this._assetSenceLoaded) {
            cc.sys.localStorage.setItem("SceneLobby", this.scene);
            cc.director.runScene(this.scene);
        }
    }

    // update (dt) {}
}
