import WebHelper from "./WebHelper";

var NativeHelperConfig = {
    getDeviceId: {
        iOS: [
            "Wrapper",
            "getDeviceId"
        ],
        Android: [
            "com/game/Wrapper",
            "getDeviceId",
            "()Ljava/lang/String;"
        ],
        "Web": 'getDeviceId'
    },
    getRandomUUID: {
        iOS: [
            "Wrapper",
            "getRandomUUID"
        ],
        Android: [
            "com/game/Wrapper",
            "getRandomUUID",
            "()Ljava/lang/String;"
        ]
    },
    getSingleInAppDetail: {
        Android: [
            "com/game/Wrapper",
            "getSingleInAppDetail",
            "(Ljava/lang/String;)V"
        ]
    }
}
var NativeHelperListener = {};
export default class NativeHelper{
    public static callNative(method, args) {
        if (cc.sys.isNative && cc.sys.isMobile) {
            if (!NativeHelperConfig[method] || !NativeHelperConfig[method][cc.sys.os]) {
                cc.log("WARNING: No config for os: " + cc.sys.os + " with method: " + method)
                return;
            }
    
            args = args || [];
            args = NativeHelperConfig[method][cc.sys.os].concat(args);
            return jsb.reflection.callStaticMethod.apply(this,args);
        }
    
        var methodName = NativeHelperConfig[method] && NativeHelperConfig[method]["Web"];
        if (methodName)
            return WebHelper[NativeHelperConfig[method]["Web"]] &&
                WebHelper[NativeHelperConfig[method]["Web"]](args);
    }
    public static setListener(name, listener) {
        NativeHelperListener[name] = listener;
    }
    public static removeListener(name) {
        delete NativeHelperListener[name];
    }
    public static onReceive (name, fnName, args) {
        if (NativeHelperListener[name]) {
            args = args || [];

            NativeHelperListener[name] && NativeHelperListener[name][fnName].apply(NativeHelperListener[name], args);
        }
        else
            cc.error("WARNING: listener " + name + " not found");
    }
}