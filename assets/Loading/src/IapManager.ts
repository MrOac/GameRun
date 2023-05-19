import NativeHelper from "./NativeHelper";

export default class IapManager{
    static instance: IapManager;
    public static getInstance(){
        if(!IapManager.instance){
            IapManager.instance = new IapManager();
        }
        return IapManager.instance;
    }
    private transaction: string = "";
    init () {
        window.NativeListener.setListener("iapCallback", (jdata) => {
            jdata = base64.decode(jdata);
            if (jdata && jdata.length > 0) {
                let receipt = JSON.parse(jdata);
                // post Iap to server
              
            } else {
                cc.log("Purchase failed");
            }
        })
    };
    purchase(str) {
        NativeHelper.callNative("getSingleInAppDetail", str);
    }

    setTransactionId(str) {
        this.transaction = str;
        // update transaction to user
        //............
    }
}