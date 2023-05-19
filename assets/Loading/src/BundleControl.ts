import ConfirmDialog from "../../Lobby/LobbyScript/Script/common/ConfirmDialog";
import Configs from "./Configs";
import { Global } from "./Global";

export default class BundleControl {
    static serverVersion: any = {};
    static poolCache: { [name: string]: cc.Prefab } = {}

    static init(data) {
        this.serverVersion = data;
        // let dataTest = '{ "BaCay": { "hash": "6c91c", "url": "https://vietkieu888.com/assets/BaCay" }, "BackupRes": { "hash": "59f9e", "url": "https://vietkieu888.com/assets/BackupRes" }, "BaiCao": { "hash": "745af", "url": "https://vietkieu888.com/assets/BaiCao" }, "BauCua": { "hash": "006b1", "url": "https://vietkieu888.com/assets/BauCua" }, "CaoThap": { "hash": "74b61", "url": "https://vietkieu888.com/assets/CaoThap" }, "internal": { "hash": "604e0", "url": "https://vietkieu888.com/assets/internal" }, "Lieng": { "hash": "e4c86", "url": "https://vietkieu888.com/assets/Lieng" }, "Lobby": { "hash": "f6fed", "url": "https://vietkieu888.com/assets/Lobby" }, "Loto": { "hash": "83290", "url": "https://vietkieu888.com/assets/Loto" }, "main": { "hash": "aa574", "url": "https://vietkieu888.com/assets/main" }, "MauBinh": { "hash": "9e18d", "url": "https://vietkieu888.com/assets/MauBinh" }, "migration": { "hash": "205da", "url": "https://vietkieu888.com/assets/migration" }, "MiniPoker": { "hash": "7ef87", "url": "https://vietkieu888.com/assets/MiniPoker" }, "OanTuTi": { "hash": "dd67d", "url": "https://vietkieu888.com/assets/OanTuTi" }, "Poker": { "hash": "bbcc5", "url": "https://vietkieu888.com/assets/Poker" }, "resources": { "hash": "ce096", "url": "https://vietkieu888.com/assets/resources" }, "Sam": { "hash": "8853d", "url": "https://vietkieu888.com/assets/Sam" }, "ScriptCore": { "hash": "6659c", "url": "https://vietkieu888.com/assets/ScriptCore" }, "ShootFish": { "hash": "f3fee", "url": "https://vietkieu888.com/assets/ShootFish" }, "Slot1": { "hash": "5a22d", "url": "https://vietkieu888.com/assets/Slot1" }, "Slot10": { "hash": "bdf81", "url": "https://vietkieu888.com/assets/Slot10" }, "Slot2": { "hash": "ca374", "url": "https://vietkieu888.com/assets/Slot2" }, "Slot3": { "hash": "86863", "url": "https://vietkieu888.com/assets/Slot3" }, "Slot3x3": { "hash": "818af", "url": "https://vietkieu888.com/assets/Slot3x3" }, "Slot4": { "hash": "c3590", "url": "https://vietkieu888.com/assets/Slot4" }, "Slot5": { "hash": "cf326", "url": "https://vietkieu888.com/assets/Slot5" }, "Slot7": { "hash": "c0473", "url": "https://vietkieu888.com/assets/Slot7" }, "Slot8": { "hash": "deae4", "url": "https://vietkieu888.com/assets/Slot8" }, "Slot9": { "hash": "11666", "url": "https://vietkieu888.com/assets/Slot9" }, "TaiXiuDouble": { "hash": "f78ee", "url": "https://vietkieu888.com/assets/TaiXiuDouble" }, "TienLen": { "hash": "050ad", "url": "https://vietkieu888.com/assets/TienLen" }, "XiDach": { "hash": "c35d2", "url": "https://vietkieu888.com/assets/XiDach" }, "XocDia": { "hash": "af76c", "url": "https://vietkieu888.com/assets/XocDia" }, "FbConfig": { "isShowBtnFb":false } }';
        // this.serverVersion = JSON.parse(dataTest);
    }

    static loadSceneGame(bundleName, sceneName, callbackProgress, bundleCallback) {
        this.loadBundle(bundleName, bundle => {
            bundle.loadScene(sceneName, function (finish, total, item) {
                callbackProgress(finish, total);
            }, function (err1, scene) {
                // cc.director.preloadScene(sceneName, (c, t, item) => {
                //     callbackProgress(c, t);
                // }, (err, sceneAsset) => {
                //     cc.director.loadScene(sceneName);
                //     bundleCallback();
                // });
                cc.director.runScene(scene);
                bundleCallback();
            }
            );
        })
    }

    static loadPrefabGame(bundleName, prefabName, callbackProgress, bundleCallback) {
        this.loadBundle(bundleName, bundle => {
            bundle.load(prefabName, cc.Prefab, function (finish, total, item) {
                callbackProgress(finish, total);
            }, function (err1, prefab) {
                bundleCallback(prefab, bundle);
            });
        })
    }

    static loadBundle(bundleName, bundleCallback) {
        console.log(this);
        if (Configs.App.IS_LOCAL) {
            if (this.verifyBundleLoad(bundleName)) {
                let bundle = this.verifyBundleLoad(bundleName);
                bundleCallback(bundle);
            }else{
                var url = bundleName;
                cc.assetManager.loadBundle(url, (err, bundle) => {
                    if (err != null) {
                        // errorCallback(err);
                        //  cc.log("Error Donwload bundle:" + JSON.stringify(err));
                        return;
                    }
                    bundleCallback(bundle);
                });
            }
        } else {
            var bundleVersion = this.serverVersion[bundleName];
            var url = bundleName;
            if (cc.sys.isNative) {
                url = bundleVersion.url;
            }
            // url = "http://192.168.100.5:8700/remote/" + bundleName
            if (this.verifyBundleLoad(bundleName)) {
                let bundle = this.verifyBundleLoad(bundleName);
                bundleCallback(bundle);
            } else {
                cc.assetManager.loadBundle(url, { version: bundleVersion.hash }, (err, bundle) => {
                    // cc.assetManager.loadBundle(url, (err, bundle) => {
                    if (err != null) {
                        // errorCallback(err);
                        //  cc.log("Error Donwload bundle:" + JSON.stringify(err));
                        return;
                    }
                    bundleCallback(bundle);
                });
            }
        }
    }

    static loadPrefabPopup(prefabPath, cb) {
        if (this.poolCache[prefabPath]) {
            cb(this.poolCache[prefabPath])
            return;
        }
        Global.BundleLobby.load(prefabPath, (err, prefab) => {
            if (err) {
                //  cc.log("Err load prefab bundle:", err);
                return;
            } else {
                //  cc.log("loadPrefabPopup Success");
                this.poolCache[prefabPath] = prefab as cc.Prefab;
                cb(prefab);
            }
        });
    }

    //Check Bundle is Load
    static verifyBundleLoad(bundleName): cc.AssetManager.Bundle {
        const verify = cc.assetManager.getBundle(bundleName);
        return verify;
    }

    static preloadSceneInBundle(bundleName: string, nameScene: string, cb: (finish: number, total: number) => void) {
        let seft = this;
        return new Promise((resolve: Function, reject: Function) => {
            this.loadBundle(bundleName, (bundle: cc.AssetManager.Bundle) => {
                if (Configs.App.listSceneGame.includes(nameScene)) {
                    bundle.preloadScene(nameScene, function (finish: number, total: number, item: cc.AssetManager.RequestItem) {
                    },
                    (error: Error) => {
                        if(error){
                            reject();
                        }
                    })
                }
                // if (Configs.App.listPrefabGame.includes(nameScene)) {
                //     bundle.preload(`${nameScene}`, cc.Prefab, function (finish: number, total: number) {
                //     },(error: Error, items)=>{
                //     });
                // }
            })
        })
    }
}