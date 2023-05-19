const { ccclass, property } = cc._decorator;
@ccclass
export default class TimeCountDown extends cc.Component{
    @property(cc.Label)
    lbTime: cc.Label = null;
    @property(cc.Node)
    titleSprite: cc.Node[] = [];
    @property(cc.AudioClip)
    mp3ClockTick: cc.AudioClip = null;
    @property(cc.AudioClip)
    mp3ClockKhurry: cc.AudioClip = null;

    _countDownEndAt: number = 0;
    _state: string = "";
    _isBanker: boolean = false;
    onLoad() {
        this._countDownEndAt = 0;
        this.node.active = false;
        this._state = '';
        this._isBanker = false;
    }

    callback () {
        if (this.node.active) {
            if (cc.sys.now() < this._countDownEndAt) {
                this.lbTime.string = Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000)+''
                if (Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000) > 3) {
                    // Global.audioManager.play(this.mp3ClockTick);
                }
                else {
                    if (this._state == 'banker_time') {
                        // player sound
                        // this._isBanker && Global.audioManager.play(this.mp3ClockKhurry);
                    }

                    if (this._state == 'player_time' || this._state == 'bet_time') {
                        // play sound
                        // !this._isBanker && Global.audioManager.play(this.mp3ClockKhurry);
                    }
                }

            } else {
                this.unschedule(this.callback);
                this.node.active = false;
            }
        }
        else {
            // Cancel this timer at the sixth call-back
            this.unschedule(this.callback);
        }
    }

    show (txt:string, seconds: number, isBanker?: boolean) {
        // this.lbText.string = txt;
        isBanker && (this._isBanker = isBanker);

        this._countDownEndAt = seconds * 1000 + cc.sys.now();
        this.lbTime.node.active = true;
        this.lbTime.string = Math.ceil((this._countDownEndAt - cc.sys.now()) / 1000)+''
        this.node.active = true;

        this.titleSprite.forEach(function (e) {
            e.active = false;
        })
        switch (txt) {
            case "start_countdown":
                {
                    this.titleSprite[0].active = true
                    this._state = 'start_countdown';
                    break;
                }

            case "bet_time":
                {
                    this.titleSprite[1].active = true
                    this._state = 'bet_time';
                    break;
                }
            case "player_time":
                {
                    this.titleSprite[2].active = true
                    this._state = 'player_time';
                    break;
                }
            case "banker_time":
                {
                    this.titleSprite[3].active = true
                    this._state = 'banker_time';
                    break;
                }
            default:
                break;
        }
        this.schedule(this.callback, 1);
    }

    showText (txt:string) {
        // this.lbText.string = txt;
        this.lbTime.node.active = false;
        this.titleSprite.forEach(function (e) {
            e.active = false;
        })

        switch (txt) {
            case "compare_2":
                {
                    this.titleSprite[5].active = true
                    this._state = 'compare_2';
                    break;
                }

            case "compare_3":
                {
                    this.titleSprite[4].active = true
                    this._state = 'compare_3';
                    break;
                }
            default:
                break;
        }

        this.node.active = true;
    }
}   