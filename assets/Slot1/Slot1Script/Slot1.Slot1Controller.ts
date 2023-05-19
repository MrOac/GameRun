import cmd from './Slot1.Cmd';

import Configs from "../../Loading/src/Configs";
import Slot1ChooseLine from './Slot1.PopupSelectLine';
import Slot1PopupBonus from './Slot1.PopupBonus';
import Slot1TrialResult from './Slot1.TrialResults';
import Slot1Lobby from "./Slot1.Lobby";
import App from '../../Lobby/LobbyScript/Script/common/App';
import BroadcastReceiver from '../../Lobby/LobbyScript/Script/common/BroadcastReceiver';
import Tween from '../../Lobby/LobbyScript/Script/common/Tween';
import Utils from '../../Lobby/LobbyScript/Script/common/Utils';
import InPacket from '../../Lobby/LobbyScript/Script/networks/Network.InPacket';
import SlotNetworkClient from '../../Lobby/LobbyScript/Script/networks/SlotNetworkClient';
import ItemIconSlot25 from '../../Lobby/LobbyScript/Script/BaseSlot25/ItemIconSlot25';

var MAX_CYCCLE_SPIN = 20;
var FAST_CYCCLE_SPIN = 10;
var ERROR_CYCCLE_SPIN = 50;
var ANIM_ICON = ["Jackpot","wildmonkey","bonus","batgioi","satang","quadao","vongkimco"];
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot1Controller extends cc.Component {
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(cc.Button)
    btnPlayTry: cc.Button = null;
    @property(cc.Button)
    btnPlayReal: cc.Button = null;
    @property(cc.Button)
    btnLine: cc.Button = null;

    @property(Slot1PopupBonus)
    popupBonus:Slot1PopupBonus = null;

    @property(Slot1ChooseLine)
    chooseLineScript:Slot1ChooseLine = null;
    @property(cc.Node)
    nodeBoxSetting: cc.Node = null;
    @property(cc.Button)
    toggleMusic: cc.Button = null;
    @property(cc.Button)
    toggleSound: cc.Button = null;
    
    @property(cc.Sprite)
    spriteSpin: cc.Sprite = null;
    @property(cc.SpriteFrame)
    sfSpinStart: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfSpinStop: cc.SpriteFrame = null;
    @property(cc.Node)
    nodeDemo: cc.Node = null;
    @property(cc.Node)
    nodeWinJackpot: cc.Node = null;
    @property(cc.Label)
    txtWinJackpot: cc.Label = null;
    @property(cc.Node)
    nodeGamePlay: cc.Node = null;
    @property(Slot1Lobby)
    mSlotLobby: Slot1Lobby = null;
    @property(cc.Label)
    jackpotLabel: cc.Label = null;

    @property(cc.Label)
    moneyLabel: cc.Label = null;

    
    @property(cc.Label)
    totalLineLabel: cc.Label = null;

    @property(cc.Button)
    btnSpin: cc.Button = null;
    @property(cc.Toggle)
    toggleFast: cc.Toggle = null;
    @property(cc.Label)
    lblFreeSpinCount: cc.Label = null;
    //win
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Node)
    bigWinNode: cc.Node = null;
    @property(cc.Label)
    txtWinBigWin: cc.Label = null;
    @property(cc.Node)
    jackpotNode: cc.Node = null;
    @property(cc.Node)
    bonusNode: cc.Node = null;
    
    @property(cc.Node)
    iconWildColumns: cc.Node = null;
    //line win
    @property(cc.Node)
    lineWinParent: cc.Node = null;

    //show result
    @property(cc.Label)
    totalWinLabel: cc.Label = null;
    @property(cc.Label)
    totalBetLabel: cc.Label = null;

   

    @property({ type: cc.AudioClip })
    musicLobby: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    musicBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundClick: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundStartSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundRepeatSpin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundEndSpin: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    soundSpinWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBigWin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundJackpot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundtouchBonus: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    soundSmumary: cc.AudioClip = null;
    
    private dailyFreeSpin = 0;
    private listActiveItem: cc.Node[] = [];         //list 15 item nhin thay tren man hinh
    private columnsWild = [];
    private TIME_DELAY_SHOW_LINE: number = 1;
    private readonly wildItemId = 1;
    public betId = 0;
    private listBet = [100, 1000, 10000];
    private listBetString = ["100", "1K", "10K"];
    private arrLineSelected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    public isTrial: Boolean = false;
    private isSpining: Boolean = false;
    private mapLine = [
        [5, 6, 7, 8, 9],
        [0, 1, 2, 3, 4],
        [10, 11, 12, 13, 14],
        [5, 6, 2, 8, 9],
        [5, 6, 12, 8, 9],
        [0, 1, 7, 3, 4],
        [10, 11, 7, 13, 14],
        [0, 11, 2, 13, 4],
        [10, 1, 12, 3, 14],
        [5, 1, 12, 3, 9],
        [10, 6, 2, 8, 14],
        [0, 6, 12, 8, 4],
        [5, 11, 7, 3, 9],
        [5, 1, 7, 13, 9],
        [10, 6, 7, 8, 14],
        [0, 6, 7, 8, 4],
        [5, 1, 2, 3, 9],
        [5, 11, 12, 13, 9],
        [10, 11, 7, 3, 4],
        [0, 1, 7, 13, 14]
    ];

    //new 

    private isFastCurrent = false;
    private isFast = false;

    @property([cc.Node])
    arrReel: cc.Node[] = [];

    @property(cc.Float) 
    distanceReel: number = 0;

    @property([cc.SpriteFrame])
    iconSFBlurArr100: cc.SpriteFrame[] = [];

    @property([sp.SkeletonData])
    arrSkeletonIcon100: sp.SkeletonData[] = [];

   

    @property([ItemIconSlot25])
    arrUIItemIcon: ItemIconSlot25[] = [];




    public numberSpinReel = null;
    public isHaveResultSpin = false;
    public dataResult = null;
    private isFirst = false;
   
    public isSound = false;
    public isMusic = true;

    private offMusic:cc.Node = null;
    private offSound:cc.Node = null;

   
    start() {
        // Configs.Login.Coin = 0;
        this.dailyFreeSpin = 0;
        this.offMusic = this.toggleMusic.node.getChildByName("off");
        this.offSound = this.toggleSound.node.getChildByName("off");
        this.isSound = true;
        this.isMusic = true;
        this.totalWinLabel.string = "";
        SlotNetworkClient.getInstance().addOnClose(() => {
            this.mSlotLobby.onBtnBack();
        }, this);

      

        this.init();
        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            //console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_JACKPOT_SLOTS:
                    this.mSlotLobby.onUpdateJackpot(data);
                break;
                case cmd.Code.UPDATE_POT:
                    {
                        
                        let res = new cmd.ReceiveUpdatePot(data);
                        //console.log("update Jackpot:"+(this.betId == 0));
                        if(this.betId == -1){
                            Tween.numberTo(this.jackpotLabel, res.valueRoom3, 0.3);
                        }
                        else if(this.betId == 0){
                            Tween.numberTo(this.jackpotLabel, res.valueRoom1, 0.3);
                        }
                        else if(this.betId == 1){
                            Tween.numberTo(this.jackpotLabel, res.valueRoom2, 0.3);
                        }
                        else if(this.betId == 2){
                            Tween.numberTo(this.jackpotLabel, res.valueRoom4, 0.3);
                        }
                        
                    }
                    break;
                case cmd.Code.UPDATE_RESULT:
                    {
                        let res = new cmd.ReceiveResult(data);
                        this.spinResult(res);
                    }
                    break;
                case cmd.Code.FREE_DAI_LY:
                        {
                           if(!this.isTrial){
                                let res = new cmd.ReceiveFreeDaiLy(data);
                                //console.log("init Slot1 FreeSpin:"+JSON.stringify(res));
                                this.dailyFreeSpin = res.freeSpin;
                                if(this.dailyFreeSpin > 0){
                                    this.lblFreeSpinCount.node.parent.active = true;
                                    this.lblFreeSpinCount.string = this.dailyFreeSpin+"";
                                }
                                else{
                                    this.lblFreeSpinCount.node.parent.active = false;
                                }
                           }
                           
                        }
                        break;
                case cmd.Code.DATE_X2:
                    {
                        let res = new cmd.ReceiveDateX2(data);
                        if(this.isFirst == false){
                            //vua vao lobby
                            this.hideGamePlay();
                            this.isFirst = true;
                        }
                        else{
                            this.mSlotLobby.node.active = false;
                            this.onJoinRoom(res);
                        }
                    }
                    break;
                case cmd.Code.CHANGE_ROOM:
                    {
                        //console.log("changeRoom:" + JSON.stringify(data));
                    }
                    break;
            }
        }, this);
        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(0));

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            Tween.numberTo(this.moneyLabel, Configs.Login.Coin, 0.3);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        App.instance.showErrLoading("កំពុងភ្ជាប់ទៅម៉ាស៊ីនមេ...");
        SlotNetworkClient.getInstance().checkConnect(() => {
            App.instance.showLoading(false);
        });

        
        this.chooseLineScript.onSelectedChanged = (lines) => {
            this.arrLineSelected = lines;
            this.totalLineLabel.string = lines.length.toString();
            this.totalBetLabel.string = Utils.formatNumberMin(lines.length * this.listBet[this.betId]);
        }

        this.mSlotLobby.init(this);

    }

    showAnimations() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var nodeItem = self.arrUIItemIcon[i].nodeBox;
            var indexCol = i % 5;
            nodeItem.opacity = 0;
            nodeItem.position = cc.v3(0, self.distanceReel, 0);
            cc.tween(nodeItem)
                .delay(indexCol * 0.1)
                .to(1, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
                .start();
        }
    }

    showGamePlay() {
        this.randomIconList();
        this.nodeGamePlay.active = true;
        this.showAnimations();
    }

    hideGamePlay() {
        this.nodeGamePlay.active = false;
    }

    init() {
        this.totalWinLabel.string = "";
    }

    public onJoinRoom(res = null) {
        //console.log("onJoinRoom:"+this.betId);
        this.lblBet.string = this.listBetString[this.betId];
        var betIdTmp = this.betId;
        if(betIdTmp == -1) betIdTmp = 2;
        let totalbet = (this.arrLineSelected.length * this.listBet[betIdTmp]);
        this.totalBetLabel.string = Utils.formatNumberMin(totalbet);
        this.mSlotLobby.hide();
        this.nodeDemo.active = this.isTrial ? true : false;
        this.showGamePlay();
        this.setButtonEnable(true);
        
       

    }

    randomIconList() {
        var self = this;
        for (var i = 0; i < self.arrUIItemIcon.length; i++) {
            var index = i;
            var itemId = Math.floor(Math.random() * (self.arrSkeletonIcon100.length));
            self.arrUIItemIcon[i].init(itemId, index, self);
            self.arrUIItemIcon[i].changeSpineIcon(itemId);
            self.arrUIItemIcon[i].spriteIcon.node.active = false;
            self.arrUIItemIcon[i].spineIcon.node.active = true;
            self.arrUIItemIcon[i].spineIcon.animation = ANIM_ICON[itemId];
            self.arrUIItemIcon[i].spineIcon.loop = true;
        }
    }

    /**
     * random between, min, max included
     */
    randomBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    spinClick() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        

        for (var i = 0; i < this.iconWildColumns.childrenCount; i++) {
            this.iconWildColumns.children[i].active = false;
        }

        //hide effect
        
        // this.setButtonAuto(false);
        // this.setButtonFlash(false);
        //console.log("spinClick:"+this.isTrial);
        if (!this.isTrial) {
            
            if (this.dailyFreeSpin > 0) {
                this.dailyFreeSpin--;
                if(this.dailyFreeSpin > 0){
                    this.lblFreeSpinCount.node.parent.active = true;
                    this.lblFreeSpinCount.string = this.dailyFreeSpin+"";
                }
                else{
                    this.lblFreeSpinCount.node.parent.active = false;
                }
            }
            else{
                if (Configs.Login.Coin < this.listBet[this.betId] * this.arrLineSelected.length) {
                    App.instance.alertDialog.showMsg("សមតុល្យមិនគ្រប់គ្រាន់");
                    return;
                }
            }
            this.hideWinEffect();
            this.hideLineWin(true);
            this.setButtonEnable(false);
            this.totalWinLabel.string = "";
            SlotNetworkClient.getInstance().send(new cmd.SendPlay(this.listBet[this.betId],this.arrLineSelected.toString()));
        } else {
            this.hideWinEffect();
            this.hideLineWin(true);
            this.setButtonEnable(false);
            this.totalWinLabel.string = "";
            var rIdx = Utils.randomRangeInt(0, Slot1TrialResult.results.length);
            this.spinResult(Slot1TrialResult.results[rIdx]);
        }
    }

    

    private audioIdRepeatSpin = 0;
    spinResult(res: cmd.ReceiveResult | any) {
        this.isSpining = true;
        //console.log("spinResult:"+JSON.stringify(res));
        

        let that = this;
        let successResult = [0, 1, 2, 3, 5, 6];
        let result = res.result;
        if (successResult.indexOf(result) === -1) {
            //fail
            if (result === 102) {
                //khong du tien
                App.instance.alertDialog.showMsg("សមតុល្យគណនីមិនគ្រប់គ្រាន់ទេ។");

            } else {
                //console.log("co loi xay ra");
            }
            return;
        }

        //set icon
        let matrix = res.matrix.split(",");
        this.numberSpinReel = new Array(this.arrReel.length);
        this.dataResult = res;
        this.isHaveResultSpin = true;
        this.columnsWild.length = 0;
        if (this.isSound) {
            cc.audioEngine.play(this.soundStartSpin, false, 1);
        }
        if (this.isSound) {
            this.audioIdRepeatSpin = cc.audioEngine.play(this.soundRepeatSpin, true, 1);
        }
        for (var i = 0; i < this.arrReel.length; i++) {
            this.beginSpinReel(i);
        }

    }

    spinFinish(hasDelay: boolean) {
        this.isSpining = false;
        var that = this;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(hasDelay ? 1 : 0),
                cc.callFunc(() => {
                    if (that.toggleFast.isChecked) {
                        that.spinClick();
                    } else {
                        that.setButtonEnable(true);
                        that.setButtonFlash(true);
                    }
                })
            )
        )

    }

    showWinEffect(prize: number, currentMoney: number, result: number) {
        var self = this;
        if (prize > 0) {
            if (result == 5) {
                //bonus
                if(this.isMusic) cc.audioEngine.playMusic(this.musicBonus, true);
                this.bonusNode.active = true;
                let bonusSpine = this.bonusNode.getComponentInChildren(sp.Skeleton);
                bonusSpine.animation = "bonus";
                bonusSpine.loop = false;
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(3),
                        cc.callFunc(() => {
                            this.bonusNode.active = false;
                            
                            this.popupBonus.showBonus(this.isTrial ? 100 : this.listBet[this.betId], this.dataResult.haiSao,this, () => {
                                this.showLineWin(self.dataResult.linesWin.split(","));
                                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                                if (this.toggleFast.isChecked) {
                                    self.spinFinish(true);
                                } else {
                                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                    else self.spinFinish(false);
                                }
                            });
                        })
                    )
                )

            } 
            else if (result == 2 || result == 6) {
                //thang lon                
                if (this.isSound) {
                    cc.audioEngine.play(this.soundBigWin, false, 1);
                }
                this.bigWinNode.active = true;
                let bigwinSpine = this.bigWinNode.getComponentInChildren(sp.Skeleton);
                bigwinSpine.animation = "Bigwin";
                bigwinSpine.loop = false;
                Tween.numberTo(this.txtWinBigWin, prize, 0.3);
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(5),
                        cc.callFunc(() => {
                            this.bigWinNode.active = false;
                            if (this.toggleFast.isChecked) {
                                self.spinFinish(true);
                            } else {
                                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                else self.spinFinish(false);
                            }
                        })
                    )
                )
                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
               
            } else if (result == 3) {
                //no hu
                if (this.isSound) {
                    var audioIdJackpot = cc.audioEngine.play(this.soundJackpot, false, 1);
                }
               
                this.jackpotNode.active = true;
                let jackpotSpine = this.jackpotNode.getComponentInChildren(sp.Skeleton);
                jackpotSpine.animation = "Jackpot";
                jackpotSpine.loop = false;
                
                cc.Tween.stopAllByTarget(this.nodeWinJackpot);
                Tween.numberTo(this.txtWinJackpot, prize, 0.3);
                this.nodeWinJackpot.position = cc.v3(0,-360,0);
                this.nodeWinJackpot.active = true;
                cc.tween(this.nodeWinJackpot)
                .to(1,{position:cc.v3(0,0,0)})
                .delay(3)
                .to(1,{position:cc.v3(0,-360,0)})
                .start();
                this.node.runAction(
                    cc.sequence(
                        cc.delayTime(5),
                        cc.callFunc(() => {
                            this.jackpotNode.active = false;
                            if (this.toggleFast.isChecked) {
                                self.spinFinish(true);
                            } else {
                                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                                else self.spinFinish(false);
                            }
                            if (this.isSound) {
                                cc.audioEngine.stop(audioIdJackpot);
                            }
                        })
                    )
                )
                Tween.numberTo(this.totalWinLabel, prize, 0.3);
                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                
            } else {
                if (this.isSound) {
                    cc.audioEngine.play(this.soundSpinWin, false, 1);
                }
                Tween.numberTo(this.totalWinLabel, prize, 0.3);

                if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
                if (this.toggleFast.isChecked) {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                } else {
                    if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                    else self.spinFinish(false);
                }
            }

            
        } else {
            
            Tween.numberTo(this.totalWinLabel, prize, 0.3);
            if (!this.isTrial) Tween.numberTo(this.moneyLabel, currentMoney, 0.3);
            if (this.toggleFast.isChecked) {
                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                else self.spinFinish(false);
            } else {
                if (self.dataResult.linesWin !== "") self.showLineWin(self.dataResult.linesWin.split(","));
                else self.spinFinish(false);
            }
        }
        

    }

    public beginSpinReel(indexReel) {
        var self = this;
        self.isFastCurrent = self.toggleFast.isChecked;
        self.numberSpinReel[indexReel] = 0;
        cc.Tween.stopAllByTarget(self.arrReel[indexReel]);
        cc.tween(self.arrReel[indexReel])
            .delay(indexReel * 0.2)
            .to(0.1, { position: cc.v3(self.arrReel[indexReel].position.x, 70, 0) }, { easing: "linear" })
            .call(() => {
                self.loopSpinReel(indexReel);
            })
            .start();
    }

    loopSpinReel(indexReel) {

        var self = this;
        cc.tween(self.arrReel[indexReel])
            .to(0.06, { position: cc.v3(self.arrReel[indexReel].position.x, -self.distanceReel, 0) }, { easing: "linear" })
            .call(() => {
                self.processLoopSpinReel(indexReel);
            })
            .start();
    }

    processLoopSpinReel(indexReel) {
        var self = this;
        self.numberSpinReel[indexReel] += 1;
        for (var i = 4; i >= 0; i--) {
            var index = indexReel + (i * 5);

            var indexRow = Math.floor(index / 5);
            var itemIdTmp = 0;
            if (indexRow == 0) {
                itemIdTmp = Math.floor(Math.random() * self.iconSFBlurArr100.length);
            }
            else {
                itemIdTmp = self.arrUIItemIcon[index - 5].itemId;
            }
            self.arrUIItemIcon[index].changeSpriteBlurByItemId(itemIdTmp);
            if (self.arrUIItemIcon[index].spriteIcon.node.active == false) {
                self.arrUIItemIcon[index].spriteIcon.node.active = true;
                self.arrUIItemIcon[index].spineIcon.node.active = false;
            }
        }
        self.arrReel[indexReel].position = cc.v3(self.arrReel[indexReel].position.x, 0, 0);
        if (self.isHaveResultSpin) {
            if (self.isFastCurrent == false) {
                if (self.numberSpinReel[indexReel] >= MAX_CYCCLE_SPIN) {
                    self.endSpinReel(indexReel);
                }
                else {
                    self.loopSpinReel(indexReel);
                }
            }
            else {
                if (self.numberSpinReel[indexReel] >= FAST_CYCCLE_SPIN) {
                    self.endSpinReel(indexReel);
                }
                else {
                    self.loopSpinReel(indexReel);
                }
            }
        }
        else {
            if (self.numberSpinReel[indexReel] >= ERROR_CYCCLE_SPIN) {
                self.endSpinReel(indexReel);
            }
            else {
                self.loopSpinReel(indexReel);
            }
        }

    }

    endSpinReel(indexReel) {
        var self = this;
        if (self.dataResult == null) {
            for (var i = 3; i >= 1; i--) {
                var index = indexReel + (i * 5);
                var itemId = Math.floor(Math.random() * (self.arrSkeletonIcon100.length));
                self.arrUIItemIcon[index].changeSpineIcon(itemId);
                self.arrUIItemIcon[index].spriteIcon.node.active = false;
                self.arrUIItemIcon[index].spineIcon.node.active = true;
                self.arrUIItemIcon[index].spineIcon.animation = ANIM_ICON[itemId];
                self.arrUIItemIcon[index].spineIcon.loop = true;
            }
            return;
        }
        var matrix = self.dataResult.matrix.split(',');
        var roll = this.arrReel[indexReel];
        self.arrReel[indexReel].position = cc.v3(self.arrReel[indexReel].position.x, self.distanceReel, 0);
       
        for (var i = 3; i >= 1; i--) {
            var index = indexReel + (i * 5);
            var id = matrix[index-5];
            self.arrUIItemIcon[index].changeSpineIcon(id);
            self.arrUIItemIcon[index].spriteIcon.node.active = false;
            self.arrUIItemIcon[index].spineIcon.node.active = true;
            self.arrUIItemIcon[index].spineIcon.animation = ANIM_ICON[id];
            self.arrUIItemIcon[index].spineIcon.loop = true;
        }
        cc.tween(self.arrReel[indexReel])
            .to(0.3, { position: cc.v3(self.arrReel[indexReel].position.x, 0, 0) }, { easing: "backOut" })
            .call(() => {
                if(self.isSound){
                    cc.audioEngine.play(self.soundEndSpin,false,1);
                }
                if (indexReel == 4) {
                    cc.audioEngine.stop(this.audioIdRepeatSpin);
                    for (var i = 0; i < 5; i++) {
                        var itemId = Math.floor(Math.random() * (self.arrSkeletonIcon100.length));
                        self.arrUIItemIcon[i].changeSpineIcon(itemId);
                        self.arrUIItemIcon[i].spriteIcon.node.active = false;
                        self.arrUIItemIcon[i].spineIcon.node.active = true;
                        self.arrUIItemIcon[i].spineIcon.animation = ANIM_ICON[itemId];
                        self.arrUIItemIcon[i].spineIcon.loop = true;
                    }
                    for (var i = 20; i < 25; i++) {
                        var itemId = Math.floor(Math.random() * (self.arrSkeletonIcon100.length));
                        self.arrUIItemIcon[i].changeSpineIcon(itemId);
                        self.arrUIItemIcon[i].spriteIcon.node.active = false;
                        self.arrUIItemIcon[i].spineIcon.node.active = true;
                        self.arrUIItemIcon[i].spineIcon.animation = ANIM_ICON[itemId];
                        self.arrUIItemIcon[i].spineIcon.loop = true;
                    }
                    Configs.Login.Coin = self.dataResult.currentMoney;
                    // for (let j = 0; j < matrix.length; j++) {
                    //     if (parseInt(matrix[j]) == this.wildItemId) {
                    //         let c = j % 5;
                    //         if (this.columnsWild.indexOf(c) == -1) this.columnsWild.push(c);
                    //     }
                    // }
                    // //replace wild items in columns
                    // for (let j = 0; j < this.columnsWild.length; j++) {
                    //     let c = this.columnsWild[j];
                        

                    //     // children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                    //     // children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                    //     // children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                    //     this.iconWildColumns.children[c].active = true;
                    //     this.iconWildColumns.children[c].scale = 0;
                    //     cc.Tween.stopAllByTarget(this.iconWildColumns.children[c]);
                    //     cc.tween(this.iconWildColumns.children[c])
                    //     .to(0.2,{scale:1},{easing:"outCir"})
                    //     .start();
                    //     this.iconWildColumns.children[c].getComponent(sp.Skeleton).animation = "MonkeyKingWild";
                    //     this.iconWildColumns.children[c].getComponent(sp.Skeleton).loop = true;
                    // }

                    self.showWinEffect(self.dataResult.prize, self.dataResult.currentMoney, self.dataResult.result);

                    
                }

            })
            .start();
    }

    onBtnSoundTouchBonus(){
        if(this.isSound){
            cc.audioEngine.play(this.soundtouchBonus,false,1);
        }
    }

    onBtnSoundSumary(){
        if(this.isSound){
            cc.audioEngine.play(this.soundSmumary,false,1);
        }
    }

    getSpriteFrameIconBlur(itemId) {
        var indexIcon = itemId;
        var self = this;
        return self.iconSFBlurArr100[indexIcon];
        
    }

    getSpriteFrameIcon(indexIcon) {
        var self = this;
        return null;
        
    }

    getSpineIcon(itemId) {
        var indexIcon = itemId;
        var self = this;
        return self.arrSkeletonIcon100[indexIcon];
    }

    hideWinEffect() {
        this.bigWinNode.active = false;
        this.jackpotNode.active = false;
    }

    onBtnToggleMusic(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isMusic = !this.isMusic;
        cc.audioEngine.setMusicVolume(this.isMusic?1:0);
        this.offMusic.position = this.isMusic?cc.v3(30,0,0):cc.v3(-20,0,0);
    }

    onBtnToggleSound(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isSound = !this.isSound;
        this.offSound.position = this.isSound?cc.v3(30,0,0):cc.v3(-20,0,0);
    }

    onBtnHistory(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.onBtnHideSetting();
    }

    onBtnHistoryJackpot(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.onBtnHideSetting();
    }

    onBtnHideSetting(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        Tween.hidePopup(this.nodeBoxSetting,this.nodeBoxSetting.parent,false);
    }

    onBtnSoundClick(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
    }

    onBtnSetting(){
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.offMusic.position = this.isMusic?cc.v3(30,0,0):cc.v3(-20,0,0);
        this.offSound.position = this.isSound?cc.v3(30,0,0):cc.v3(-20,0,0);
        
        Tween.showPopup(this.nodeBoxSetting,this.nodeBoxSetting.parent);
    }
    showLineWin(lines: Array<number>) {
        if (lines.length == 0) return;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineNode = this.lineWinParent.children[line - 1];
            lineNode.active = true;
        }

        let that = this;
        //hide all line
        this.lineWinParent.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    that.hideLineWin(false);
                })
            )
        );

        this.lineWinParent.runAction(
            cc.sequence(
                cc.delayTime(1.5),
                cc.callFunc(() => {
                    //active line one by one
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];
                        let lineNode = this.lineWinParent.children[line - 1];
                        this.lineWinParent.runAction(
                            cc.sequence(
                                cc.delayTime(i * this.TIME_DELAY_SHOW_LINE),
                                cc.callFunc(() => {
                                    lineNode.active = true;

                                }),
                                cc.delayTime(this.TIME_DELAY_SHOW_LINE),
                                cc.callFunc(() => {
                                    lineNode.active = false;
                                   
                                    if (i == lines.length - 1)
                                        that.spinFinish(false);
                                })
                            )

                        );
                    }
                })
            )
        );

    }

    hideLineWin(stopAction: boolean) {
        if (stopAction) this.lineWinParent.stopAllActions();
        this.lineWinParent.children.forEach(element => {
            element.active = false;
        });

        

    }

    setButtonEnable(active: boolean) {
        this.btnSpin.interactable = active;
        this.btnBack.interactable = active;
        this.btnLine.interactable = active;
        this.btnPlayTry.interactable = active;
        this.btnPlayReal.interactable = active;
        if (active == true) {
            this.spriteSpin.spriteFrame = this.sfSpinStart;
        }
        else {
            this.spriteSpin.spriteFrame = this.sfSpinStop;
        }
    }

   

    setButtonFlash(active: boolean) {
        this.toggleFast.interactable = active;
        this.toggleFast.node.children[0].color = active ? cc.Color.WHITE : cc.Color.GRAY;
    }

    //#region CHANGE BET
    changeBet() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }

        this.mSlotLobby.node.active = !this.mSlotLobby.node.active;
    }

    chooseBet(event, bet) {
        
        let oldIdx = this.betId;
        this.betId = parseInt(bet);
        this.dailyFreeSpin = 0;
        this.lblFreeSpinCount.node.parent.active = false;
        this.isTrial = bet == -1 ? true : false;
        this.betId = bet == -1 ? 2 : bet;
        if (this.betId >= this.listBet.length) {
            this.betId = 0;
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betId));
        }
        else{
            SlotNetworkClient.getInstance().send(new cmd.SendChangeRoom(oldIdx, this.betId));
            this.onJoinRoom();
        }
        

        
    }


    // showGuide() {
    //     if (this.isSound) {
    //         cc.audioEngine.play(this.soundClick, false, 1);
    //     }
    //     this.popupGuide.show(this);
    // }

    // closeGuide() {
    //     if (this.isSound) {
    //         cc.audioEngine.play(this.soundClick, false, 1);
    //     }
    //     this.popupGuide.hide();
    // }

    showChooseLine() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.chooseLineScript.show();
    }

    changeSpeed() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        this.isFastCurrent = this.toggleFast.isChecked;
        if (this.toggleFast.isChecked && !this.isSpining) {
            this.spinClick();
        }
    }

    setAutoSpin() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
   
        if (!this.isSpining) {
            this.spinClick();
        }
    }


    actBack() {
        if (this.isSound) {
            cc.audioEngine.play(this.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betId));

        this.mSlotLobby.show();
        this.hideGamePlay();
    }
}
