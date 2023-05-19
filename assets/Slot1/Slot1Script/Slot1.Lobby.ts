
import App from "../../Lobby/LobbyScript/Script/common/App";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import cmd from "./Slot1.Cmd";
import Slot1Controller from "./Slot1.Slot1Controller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot1Lobby extends cc.Component {

    @property([cc.Label])
    listPot : cc.Label[] = [];
    @property([cc.Node])
    rooms : cc.Node[] = [];
    
    mSlotController : Slot1Controller = null;

    start(){
       
    }
    public init(pSlot3Controller : Slot1Controller){
        this.mSlotController = pSlot3Controller;
        if(this.mSlotController.isMusic) cc.audioEngine.playMusic(this.mSlotController.musicLobby, true);
        this.show();
    }

    show(){
        this.node.active = true;
        this.showAnimation();
    }

    hide(){
        this.node.active = false;
    }

    showAnimation () {
        if (this.mSlotController.isSound) {
            cc.audioEngine.play(this.mSlotController.soundStartSpin, false, 1);
        }
        var self = this;
        for(var i=0;i<this.rooms.length;i++){
            var nodeBox = this.rooms[i]
            cc.Tween.stopAllByTarget(nodeBox);
            nodeBox.opacity = 0;
            if (i == 0) {
                nodeBox.position = cc.v3(-200, 0,0);
            }
            else if (i == 1) {
                nodeBox.position = cc.v3(0, -200,0);
            }
            else if (i == 2) {
                nodeBox.position = cc.v3(0, 200,0);
            }
            else {
                nodeBox.position = cc.v3(200, 0,0);
            }
            cc.tween(nodeBox)
                .to(1, { position: cc.v3(0, 0,0), opacity: 255 }, { easing: "backOut" })
                .start();
        }
    }

    public onBtnBack(){
        
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.mSlotController.betId));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    private onBtn100(){
        this.mSlotController.betId = 0;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betId));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private onBtn5k(){
        this.mSlotController.betId = 1;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betId));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private omBtn10k(){
        this.mSlotController.betId = 2;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betId));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    public onUpdateJackpot(pData){
        let res = new cmd.ResUpdateJackpotSlots(pData);
        let resJson = JSON.parse(res.pots);
        Tween.numberTo(this.listPot[0], resJson['audition']['100'].p, 0.3);
        Tween.numberTo(this.listPot[1], resJson['audition']['1000'].p, 0.3);
        Tween.numberTo(this.listPot[2], resJson['audition']['10000'].p, 0.3);
    }
}
