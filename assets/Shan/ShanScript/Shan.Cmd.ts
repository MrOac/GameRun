
import Configs from "../../Loading/src/Configs";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";
import ShanContants from "./Shan.Contants";

export namespace cmd {
    export class Code {
        static LOGIN = 1;
        static TOPSERVER = 1001;
        static CMD_PINGPONG = 1050;

        static CMD_JOIN_ROOM = 3001;
        static CMD_RECONNECT_ROOM = 3002;
        static MONEY_BET_CONFIG = 3003;
        static JOIN_ROOM_FAIL = 3004;
        static CHAT_ROOM = 3008;

        static CREATE_ROOM = 3013;
        static GET_LIST_ROOM = 3014;
        static JOIN_GAME_ROOM_BY_ID = 3015;

        static MO_BAI = 3101;
        static BAT_DAU = 3102;
        static KET_THUC = 3103;

        static YEU_CAU_DANH_BIEN = 3104;
        static CHIA_BAI = 3105;
        static KE_CUA = 3106;
        static TU_DONG_BAT_DAU = 3107;
        static DONG_Y_DANH_BIEN = 3108;
        static DAT_CUOC = 3112;// 3109;
        // static 

        static THONG_TIN_BAN_CHOI = 3110;
        static DANG_KY_THOAT_PHONG = 3212;// 3111;
        static VAO_GA = 3112;
        static DOI_CHUONG = 3113;
        static MOI_DAT_CUOC = 3114;
        static CHEAT_CARDS = 3115;
        static DANG_KY_CHOI_TIEP = 3116;
        static UPDATE_OWNER_ROOM = 3117;
        static JOIN_ROOM_SUCCESS = 3118;
        static LEAVE_GAME = 3211;
        static NOTIFY_KICK_FROM_ROOM = 3120;
        static NEW_USER_JOIN = 3121;
        static NOTIFY_USER_GET_JACKPOT = 3122;
        static UPDATE_MATCH = 3123;

        static PLAYER_STATUS_OUT_GAME = 0;
        static PLAYER_STATUS_VIEWER = 1;
        static PLAYER_STATUS_SITTING = 2;
        static PLAYER_STATUS_PLAYING = 3;
        static LOGOUT = 2;

        static MAX_PLAYER = 7;

        static START_GAME = 3101;
        static START_PHASE_ONE = 3102;
        static START_PHASE_TWO = 3103;
        static SEEN = 3104;
        static END_GAME = 3105;
        static FINISH = 3107;
        static MATH_KICK = 3108;
        static MATCH_INFO = 3109;
        static LEAVE_NOW = 3110;
        static LEAVE_GAME1 = 3211
        static DRAW = 3111;
        static BETTING = 3112;
        static COMPARE = 3114;
        static BANKER_WIN = 3116;
        static CHECK_ACTION = 3117;
        static ROOM_START_COUNTDOWN = 3209;
        static ROOM_STOP_COUNTDOWN = 3220;
        static ROOM_REGISTER_LEAVE = 3212;

    }

    // OutPacket
    export class CmdLogin extends OutPacket {
        constructor(a: string, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LOGIN);
            this.packHeader();
            this.putString(a); // nickname
            this.putString(b); // accessToken
            this.updateSize();
        }
    }

    export class CmdJoinRoom extends OutPacket {
        constructor(a: number, b: number, c: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_JOIN_ROOM);
            this.packHeader();
            this.putInt(a);
            this.putInt(b);
            this.putLong(c);
            this.putInt(0);
            this.updateSize();
        }
    }

    export class CmdReconnectRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_RECONNECT_ROOM);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendVaoGa extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.VAO_GA);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendRequestLeaveGame extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANG_KY_THOAT_PHONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendHoldRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DANG_KY_CHOI_TIEP);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetGameConfig extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MONEY_BET_CONFIG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetTopServer extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TOPSERVER);
            this.packHeader();
            this.putByte(a);
            this.updateSize();
        }
    }

    export class SendCreateRoom extends OutPacket {
        constructor(a: number, b: number, c: number, d: number, e: number, f: string, g: string, h: number,) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CREATE_ROOM);
            this.packHeader();
            this.putInt(a);
            this.putInt(b);
            this.putLong(c);
            this.putInt(d);
            this.putInt(e);
            this.putString(f);
            this.putString(g);
            this.putLong(h);
            this.updateSize();
        }
    }

    export class SendCardCheat extends OutPacket {
        constructor(a: number, b: []) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHEAT_CARDS);
            this.packHeader();
            this.putByte(a);
            this.putByte(0);
            this.putShort(b.length);
            if (a)
                for (var c = 0; c < b.length; c++) this.putByte(b[c]);
            this.updateSize();
        }
    }

    export class CmdSendDatCuoc extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DAT_CUOC);
            this.packHeader();
            this.putByte(a);
            this.updateSize();
        }
    }

    export class CmdSendDanhBien extends OutPacket {
        constructor(a: number, b: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.YEU_CAU_DANH_BIEN);
            this.packHeader();
            this.putByte(a);
            this.putByte(b);
            this.updateSize();
        }
    }

    export class CmdSendKeCua extends OutPacket {
        constructor(a: number, b: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.KE_CUA);
            this.packHeader();
            this.putByte(a);
            this.putByte(b);
            this.updateSize();
        }
    }

    export class CmdSendAcceptDanhBien extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DONG_Y_DANH_BIEN);
            this.packHeader();
            this.putByte(a); // pos
            this.updateSize();
        }
    }

    export class CmdSendMoBai extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MO_BAI);
            this.packHeader();
            this.updateSize();
        }
    }

    export class CmdSendPing extends OutPacket {
        constructor(a: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CMD_PINGPONG);
            this.packHeader();
            this.updateSize();
        }
    }

    export class SendGetListRoom extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LIST_ROOM);
            this.packHeader();
            this.putInt(Configs.App.MONEY_TYPE);//money type
            // this.putInt(0);//money type
            this.putInt(Code.MAX_PLAYER);//maxplayer
            this.putLong(-1);//khong xac dinh
            this.putInt(0);//khong xac dinh
            this.putInt(0);//CARD_FROM
            this.putInt(50);//CARD_TO
            this.updateSize();
        }
    }

    export class SendJoinRoomById extends OutPacket {
        constructor(id: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.JOIN_GAME_ROOM_BY_ID);
            this.packHeader();
            this.putInt(id);
            this.putString("");//mat khau
            this.updateSize();
        }
    }

    export class SendChatRoom extends OutPacket {
        constructor(a: number, b: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHAT_ROOM);
            this.packHeader();
            this.putByte(a ? 1 : 0);
            this.putString(encodeURI(b));
            this.updateSize();
        }
    }
    /////
    export class SendDraw extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DRAW);
            this.packHeader();
            this.updateSize();
        }
    }
    export class SendNoDraw extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.END_GAME);
            this.packHeader();
            this.updateSize();
        }
    }
    export class SendCompare extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.COMPARE);
            this.packHeader();
            this.updateSize();
        }
    }
    export class SendSeen extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEEN);
            this.packHeader();
            this.updateSize();
        }
    }
    export class SendBet extends OutPacket {
        constructor(amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.BETTING);
            this.packHeader();
            this.putLong(amount);
            this.updateSize();
        }
    }
    export class SendUserAction extends OutPacket {
        constructor(amount: boolean) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHECK_ACTION);
            this.packHeader();
            this.putByte(amount ? 1 : 0);
            this.updateSize();
        }
    }
    export class SendMatchInfo extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.MATCH_INFO);
            this.packHeader();
            this.updateSize();
        }
    }
    export class SendLeaveGame extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LEAVE_GAME);
            this.packHeader();
            this.updateSize();
        }
    }
    // export class SendGetUserInfo extends OutPacket{
    //     constructor() {
    //         super();
    //         this.initData(100);
    //         this.setControllerId(1);
    //         this.setCmdId(Code.ROOM_REGISTER_LEAVE);
    //         this.packHeader();
    //         this.updateSize();
    //     }
    // }

    // InPacket
    export class ReceivedLogin extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }

    export class ReceivedGetListRoom extends InPacket {
        list: any[] = [];

        constructor(data: Uint8Array) {
            super(data);
            let listSize = this.getShort();
            this.list = [];
            for (var i = 0; i < listSize; i++) {
                let item: any = {};
                item["id"] = this.getInt();
                item["userCount"] = this.getByte();
                item["limitPlayer"] = this.getByte();
                item["maxUserPerRoom"] = this.getInt();
                item["moneyType"] = this.getByte();
                item["moneyBet"] = this.getInt();
                item["requiredMoney"] = this.getInt();
                item["rule"] = this.getByte();
                item["nameRoom"] = this.getString();
                item["key"] = this.getBool();
                item["quyban"] = this.getLong();

                // item["id"] = this.getInt();

                // item["moneyBet"] = this.getLong();
                // item["requiredMoney"] = this.getLong();
                // item["maxRequire"] = this.getLong();
                // item["basePlayNow"] = this.getLong();
                // item["userCount"] = this.getInt();
                // item["maxUserPerRoom"] = 8;
                this.list.push(item)
            }
        }
    }
    export class ReceivedGameConfig extends InPacket {
        list = [];
        rules = [];
        constructor(data: Uint8Array) {
            super(data);
            let listSize = this.getShort();
            for (var a = 0; a < listSize; a++) {
                var b = {
                    maxUserPerRoom: this.getInt(),
                    moneyType: this.getByte(),
                    moneyBet: this.getLong(),
                    moneyRequire: this.getLong(),
                    nPersion: this.getInt(),
                };
                this.list.push(b);
            }
            for (a = 0; a < listSize; a++) this.rules.push(this.getByte());
        }
    }
    // edited
    export class ReceivedJoinRoomSucceed extends InPacket {
        myChair: number;
        chuongChair: number;
        moneyBet: number;
        roomId: number;
        gameId: number;
        moneyType: number;
        rule: number;
        playerSize: number;
        playerStatus: any[];
        playerInfos: any[];
        gameAction: number;
        countDownTime: number;

        constructor(data: Uint8Array) {
            super(data);
            var a: number;
            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.rule = this.getByte();
            this.playerSize = this.getShort();
            this.playerStatus = [];
            for (a = 0; a < this.playerSize; a++) this.playerStatus.push(this.getByte());
            this.playerSize = this.getShort();
            this.playerInfos = [];
            for (a =
                0; a < this.playerSize; a++) {
                var b = {};
                b["nickName"] = this.getString();
                b["avatar"] = this.getString();
                b["money"] = this.getLong();
                this.playerInfos.push(b);
            }
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
        }
    }

    // new
    export class ReceivedAutoStart extends InPacket {
        isAutoStart: boolean;
        timeAutoStart: number;
        constructor(data: Uint8Array) {
            super(data);
            this.isAutoStart = this.getBool();
            this.timeAutoStart = this.getByte();
        }
    }

    // new
    export class ReceivedChiaBai extends InPacket {
        cardSize: number;
        cards: any[];
        gameId: number;
        timeChiaBai: number;
        constructor(data: Uint8Array) {
            super(data);
            var a = 0;
            this.cardSize = this.getShort();
            this.cards = [];
            for (a = 0; a < this.cardSize; a++) this.cards.push(this.getByte());
            this.gameId = this.getInt();
            this.timeChiaBai = this.getByte();
        }
    }

    // new
    export class ReceivedFirstTurnDecision extends InPacket {
        isRandom: boolean;
        chair: number;
        cardSize: number;
        cards: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.isRandom = this.getBool();
            this.chair = this.getByte();
            this.cardSize = this.getShort();
            this.cards = [];
            for (let i = 0; i < this.cardSize; i++) {
                this.cards.push(this.getByte());
            }
        }
    }

    // new
    export class ReceivedUserLeaveRoom extends InPacket {
        chair: number;
        nickName: string;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.nickName = this.getString();
        }
    }

    // new
    export class ReceivedUserJoinRoom extends InPacket {
        info: {};
        uChair: number;
        uStatus: number;
        constructor(data: Uint8Array) {
            super(data);
            this.info = {};
            this.info["nickName"] = this.getString();
            this.info["avatar"] = this.getString();
            this.info["money"] = this.getLong();
            this.uChair = this.getByte();
            this.uStatus = this.getByte();
        }
    }


    // new
    export class ReceivedUpdateMatch extends InPacket {
        myChair: number;
        hasInfo: any[];
        infos: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            var a = this.getShort();
            this.hasInfo = [];
            for (var b = 0; b < a; b++) this.hasInfo.push(this.getBool());
            this.infos = [];
            for (b = 0; b < a; b++) {
                var c = {};
                this.hasInfo[b] && (c["nickName"] = this.getString(), c["avatar"] = this.getString(), c["money"] = this.getLong(), c["status"] = this.getInt());
                this.infos.push(c);
            }
        }
    }

    // new
    export class ReceivedShanConfig extends InPacket {
        listSize: number;
        list: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.listSize = this.getShort();
            this.list = [];
            for (var a = 0; a < this.listSize; a++) {
                var b = {};
                b["maxUserPerRoom"] = this.getByte();
                b["moneyType"] = this.getByte();
                b["moneyBet"] = this.getLong();
                b["moneyRequire"] = this.getLong();
                b["nPersion"] = this.getInt();
                this.list.push(b);
            }
        }
    }

    // new
    export class ReceivedNotifyRegOutRoom extends InPacket {
        outChair: number;
        isOutRoom: boolean;
        constructor(data: Uint8Array) {
            super(data);
            this.outChair = this.getByte();
            this.isOutRoom = this.getBool();
        }
    }

    // new
    export class ReceivedKickOff extends InPacket {
        reason: number;
        constructor(data: Uint8Array) {
            super(data);
            this.reason = this.getByte();
        }
    }

    // new
    export class ReceivedMoiDatCuoc extends InPacket {
        timeDatCuoc: number;
        constructor(data: Uint8Array) {
            super(data);
            this.timeDatCuoc = this.getByte();
        }
    }


    // new
    export class ReceivedDatCuoc extends InPacket {
        chairDatCuoc: number;
        level: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chairDatCuoc = this.getByte();
            this.level = this.getByte();
        }
    }

    // new
    export class ReceivedYeuCauDanhBien extends InPacket {
        danhBienChair: number;
        level: number;
        constructor(data: Uint8Array) {
            super(data);
            this.danhBienChair = this.getByte();
            this.level = this.getByte();
        }
    }

    // new
    export class ReceivedChapNhanDanhBien extends InPacket {
        danhBienChair: number;
        level: number;
        constructor(data: Uint8Array) {
            super(data);
            this.danhBienChair = this.getByte();
            this.level = this.getByte();
        }
    }

    // new
    export class ReceivedKeCua extends InPacket {
        chairKeCuaFrom: number;
        chairKeCuaTo: number;
        level: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chairKeCuaFrom = this.getByte();
            this.chairKeCuaTo = this.getByte();
            this.level = this.getByte();
        }
    }

    // new
    export class ReceivedVaoGa extends InPacket {
        chair: number;
        chicKenBet: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.chicKenBet = this.getLong();
        }
    }

    // new
    export class ReceivedMoBai extends InPacket {
        chairMoBai: number;
        cardSize: number;
        cards: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.chairMoBai = this.getByte();
            this.cardSize = this.getShort();
            this.cards = [];
            for (var a = 0; a < this.cardSize; a++) {
                this.cards.push(this.getByte());
            }
        }
    }

    // new
    export class ReceivedEndGame extends InPacket {
        statusList: any[];
        cardList: any[];
        tienThangChuong: number;
        tienThangGa: number;
        keCuaMoneyList: any[];
        danhBienMoneyList: any[];
        tongTienCuoiVan: number;
        tongTienCuocList: any[];
        tongDanhBienList: any[];
        tongKeCuaList: any[];
        tongCuocGaList: any[];
        tongCuoiVanList: any[];
        currentMoneyList: any[];
        timeEndGame: number;

        constructor(data: Uint8Array) {
            super(data);
            var a = 0;
            var b: any = this.getShort();
            this.statusList = [];
            for (a = 0; a < b; a++) this.statusList.push(this.getByte());
            this.cardList = [];
            for (a = 0; a < this.statusList.length; a++) {
                b = [];
                if (3 == this.statusList[a])
                    for (var c = this.getShort(), d = 0; d < c; d++) b.push(this.getByte());
                this.cardList.push(b);
            }
            this.tienThangChuong = this.getLong();
            this.tienThangGa = this.getLong();
            this.keCuaMoneyList = [];
            this.danhBienMoneyList = [];
            b = this.getShort();
            for (a = 0; a < b; a++) this.keCuaMoneyList.push(this.getLong());
            b = this.getShort();
            for (a = 0; a < b; a++) this.danhBienMoneyList.push(this.getLong());
            this.tongTienCuoiVan = this.getLong();
            this.tongTienCuocList = [];
            this.tongDanhBienList = [];
            this.tongKeCuaList = [];
            this.tongCuocGaList = [];
            this.tongCuoiVanList = [];
            this.currentMoneyList = [];
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.tongTienCuocList.push(b);
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.tongDanhBienList.push(b);
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.tongKeCuaList.push(b);
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.tongCuocGaList.push(b);
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.tongCuoiVanList.push(b);
            this.getShort();
            for (a = 0; a < Code.MAX_PLAYER; a++) b = 0, 3 == this.statusList[a] && (b = this.getLong()), this.currentMoneyList.push(b);
            this.timeEndGame = this.getByte();
        }
    }

    // new
    export class ReceivedDoiChuong extends InPacket {
        chuongChair: number;
        constructor(data: Uint8Array) {
            super(data);
            this.chuongChair = this.getByte();
        }
    }

    // new
    export class ReceivedChatRoom extends InPacket {
        chair: number;
        isIcon: boolean;
        content: string;
        nickname: string;
        constructor(data: Uint8Array) {
            super(data);
            this.chair = this.getByte();
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    // new
    export class ReceivedGameInfo extends InPacket {
        myChair: number;
        chuongChair: number;
        cards: any[];
        cuocDanhBienList: any[];
        cuocKeCuaList: any[];
        gameServerState: number;
        isAutoStart: boolean;
        gameAction: number;
        countDownTime: number;
        moneyType: number;
        moneyBet: number;
        gameId: number;
        roomId: number;
        hasInfo: any[];
        players: any[];
        constructor(data: Uint8Array) {
            super(data);
            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
            var a = this.getShort();
            this.cards = [];
            for (var b = 0; b < a; b++) this.cards.push(this.getByte());
            this.cuocDanhBienList = [];
            a = this.getShort();
            for (b = 0; b < a; b++) this.cuocDanhBienList[b] = this.getInt();
            this.cuocKeCuaList = [];
            a = this.getShort();
            for (b = 0; b < a; b++) this.cuocKeCuaList[b] = this.getInt();
            this.gameServerState = this.getByte();
            this.isAutoStart = this.getBool();
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
            this.moneyType = this.getByte();
            this.moneyBet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();
            this.hasInfo = [];
            a = this.getShort();
            for (b = 0; b < a; b++) this.hasInfo[b] = this.getBool();
            this.players = [];
            for (b = 0; b < Code.MAX_PLAYER; b++) this.hasInfo[b] ? (this.players[b] = [], this.players[b].status = this.getByte(), this.players[b].money = this.getLong(), this.players[b].cuocGa = this.getInt(), this.players[b].cuocChuong =
                this.getInt(), this.players[b].avatar = this.getString(), this.players[b].nickName = this.getString()) : (this.players[b] = [], this.players[b].status = 0)
        }
    }

    // new
    export class ReceivedTopServer extends InPacket {
        rankType: number;
        topDay_money: string;
        topWeek_money: string;
        topMonth_money: string;
        topDay_number: string;
        topWeek_number: string;
        topMonth_number: string;
        constructor(data: Uint8Array) {
            super(data);
            this.rankType = this.getByte();
            this.topDay_money = this.getString();
            this.topWeek_money = this.getString();
            this.topMonth_money = this.getString();
            this.topDay_number = this.getString();
            this.topWeek_number = this.getString();
            this.topMonth_number = this.getString();
        }
    }

    export class ReceivedJoinRoomFail extends InPacket {
        constructor(data: Uint8Array) {
            super(data);
        }
    }

    export class ReceivedMatchStart extends InPacket {
        data: any;
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                matchId: this.getInt(),
                bankerChair: this.getInt(),
                bankerPot: this.getLong(),
                moneyAddToPot: this.getLong(),
                countDownTime: this.getInt(),
                warningCount: this.getInt()
            }

            this.data.playerList = []
            var size = this.getShort();
            for (var i = 0; i < size; i++) {
                if (this.getBool()) {
                    this.data.playerList.push({
                        chair: this.getByte(),
                        userId: this.getInt(),
                        userName: this.getString(),
                        avatar: this.getString(),
                        money: this.getLong()
                    })
                }
            }
        }
    }

    export class ReceivedBet extends InPacket {
        data: { chair: number; totalBet: number; remainGold: number; bet?: number; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                chair: this.getInt(),
                bet: this.getLong(),
                totalBet: this.getLong(),
                remainGold: this.getLong(),
            }
        }
    }
    export class ReceivedBankerWin extends InPacket {
        data: { chair: any; balance: any; moneyWin: any; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                chair: this.getInt(),
                moneyWin: this.getLong(),
                balance: this.getLong(),
            }
        }
    }

    export class ReceivedDrawCard extends InPacket {
        data: { chair: any; cardId: any; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                chair: this.getInt(),
                cardId: this.getInt(),
            }
        }
    }

    export class ReceivedSeen extends InPacket {
        data: { chair: number };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                chair: this.getInt()
            }
        }
    }
    class ShanInPacket extends InPacket {
        getPrimitiveArray(f) {
            var data = [];
            var size = this.getShort();
            for (var i = 0; i < size; i++)
                data.push(f.apply(this));
            return data;
        }
        getIntArray() {
            return this.getPrimitiveArray(this.getInt);
        }
    }
    export type EndGameData = {
        playerList?: PlayerData[];
        endType?: number;
        cardId?: number;
        bankerPot?: number;
        bankerGroupId?: number;
        bankerPoint?: number;
        bankerMultiple?: number;
        bankerCards?: number[];
        isShowUserByUser?: boolean;
    }
    export type PlayerData = {
        chair: number;
        isWin: number;
        moneyChange: number;
        moneyChangeBeforTax: number;
        money: number;
        groupId: number;
        point: number;
        multiple: number;
        cards: number[];
    }
    export class ReceivedMatchEnd extends ShanInPacket {
        data: EndGameData
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                endType: this.getByte(),
                cardId: this.getInt(),
                bankerPot: this.getLong(),
                //     bankerChipsChange: this.getLong(),
                // bankerChipsChangeBeforeTax: this.getLong(),
                bankerGroupId: this.getByte(),
                bankerPoint: this.getInt(),
                bankerMultiple: this.getInt(),
                bankerCards: this.getIntArray(),
                isShowUserByUser: this.getBool(),
            };

            this.data.playerList = [];
            var size = this.getShort();
            for (var i = 0; i < size; i++) {
                var player = {
                    chair: this.getInt(),
                    isWin: this.getByte(),
                    moneyChange: this.getLong(),
                    moneyChangeBeforTax: this.getLong(),
                    money: this.getLong(),
                    groupId: this.getByte(),
                    point: this.getInt(),
                    multiple: this.getInt(),
                    cards: this.getIntArray()
                };

                this.data.playerList.push(player);
            }
        }
    }
    export class ReceivedMatchFinish extends ShanInPacket {
        data: {
            playerList?: {
                chair: number;
                stateId: number;
                userId: number;
                userName: string;
                avatar: string;
                money: number;
                vip: number;
            }[];
            bankerPot?: number;
            bankerChair?: number;
        };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                bankerPot: this.getLong(),
                bankerChair: this.getInt(),
            }

            this.data.playerList = [];

            var listSize = this.getShort();
            for (var i = 0; i < listSize; i++) {
                let player: {
                    chair: number;
                    stateId: number;
                    userId: number;
                    userName: string;
                    avatar: string;
                    money: number;
                    vip: number;
                } = {
                    chair: 0,
                    stateId: 0,
                    userId: 0,
                    userName: "",
                    avatar: "",
                    money: 0,
                    vip: 0
                };
                player.chair = this.getByte();
                player.stateId = this.getByte();
                if (player.stateId != cmd.Code.PLAYER_STATUS_OUT_GAME) {
                    player.userId = this.getInt();
                    player.userName = this.getString();
                    player.avatar = this.getString();
                    player.money = this.getLong();
                    player.vip = this.getInt();
                }

                this.data.playerList.push(player);
            }
        }
    }
    export class ReceivedMatchInfo extends ShanInPacket {
        data: {
            cardList: any[];
            playerList: any[];
            countDownTime?: any;
            gameState?: any;
            bankerChair?: any;
            bankerPot?: any;
            warningCount?: any;
            isInstantEndGame?: any;
            roomId?: number;
            matchId?: number;
            moneyBet?: number;
            maxPlayer?: number;
            numPlayer?: number;
            roomOwnerId?: number;
        };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                roomId: this.getInt(),
                matchId: this.getInt(),
                moneyBet: this.getLong(),
                maxPlayer: this.getInt(),
                numPlayer: this.getInt(),
                roomOwnerId: this.getInt(),
                cardList: [],
                playerList: [],
            };
            // Card list
            let size = this.getShort();
            for (let i = 0; i < size; i++)
                this.data.cardList.push(this.getByte());

            // Player Info
            size = this.getShort();
            for (let i = 0; i < size; i++) {
                let player: any = {};

                player.chair = this.getByte();
                player.stateId = this.getByte();
                if (player.stateId != Code.PLAYER_STATUS_OUT_GAME) {
                    player.userId = this.getInt();
                    player.userName = this.getString();
                    player.avatar = this.getString();
                    player.money = this.getLong();
                    player.vip = this.getInt();
                }
                if (player.stateId == Code.PLAYER_STATUS_PLAYING) {
                    player.isRegisterQuit = this.getBool();
                    player.betAmount = this.getLong();
                    player.cardSize = this.getShort();
                    player.isShow = this.getBool();
                    if (player.isShow) {
                        player.cards = [];
                        for (let j = 0; j < player.cardSize; j++)
                            player.cards.push(this.getByte());
                    }
                }

                this.data.playerList.push(player);
            }

            this.data.countDownTime = this.getShort();
            this.data.gameState = this.getByte();
            this.data.bankerChair = this.getInt();
            this.data.bankerPot = this.getLong();
            this.data.warningCount = this.getInt();
            this.data.isInstantEndGame = this.getBool();
        }
    }
    export class ReceivedCompare extends ShanInPacket {
        data: any;
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                playerList: []
            }

            var size = this.getShort();
            for (var i = 0; i < size; i++) {
                var player = {
                    chair: this.getInt(),
                    cards: this.getIntArray(),
                    isWin: this.getBool(),
                }
                this.data.playerList.push(player);
            }
        }
    }
    export class ReceivedStartPhaseOne extends ShanInPacket {
        data: {
            playerList: any[];
            cards?: number[];
            countDownTime?: number;
            isInstantEndGame?: boolean;
            dataList: {
                chair: number;
                point: number;
                cards: any[];
            }[];
        };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                playerList: [],
                dataList: []
            }

            var size = this.getShort();
            for (var i = 0; i < size; i++) {
                this.data.playerList.push({
                    chair: this.getByte(),
                    bet: this.getLong(),
                    remain: this.getLong()
                })
            }

            this.data.cards = this.getIntArray();
            this.data.countDownTime = this.getInt();
            this.data.isInstantEndGame = this.getBool();

            size = this.getShort();

            for (var i = 0; i < size; i++) {
                this.data.dataList.push({
                    chair: this.getInt(),
                    point: this.getInt(),
                    cards: this.getIntArray()
                })
            }
        }
    }
    export class ReceivedStartPhaseTwo extends ShanInPacket {
        data: { countDownTime: any; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                countDownTime: this.getInt(),
            }
        }
    }
    export class ReceivedRoomStartCountDown extends ShanInPacket {
        data: { seconds: number; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                seconds: this.getInt(),
            }
        }
    }
    export class ReceivedRoomLeaving extends ShanInPacket {
        data: { userId?: number; roomOwnerId?: number; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                userId: this.getInt(),
                roomOwnerId: this.getInt()
            }
            // this.data.userId = this.getInt();
            // this.data.roomOwnerId = this.getInt();
        }
    }
    export class CmdReceivedRegisterLeave extends ShanInPacket {
        data: { userId: number; isRegister: boolean; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                userId: this.getInt(),
                isRegister: this.getBool(),
            }
            // this.data.userId = this.getInt();
            // this.data.isRegister = this.getBool();
        }
    }
    export class CmdReceivedRequestBanker extends ShanInPacket {
        data: { errCode: number; id: number; name: string; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                errCode: this.getInt(),
                id: this.getInt(),
                name: this.getString(),
            }
            // this.data.userId = this.getInt();
            // this.data.isRegister = this.getBool();
        }
    }
    export class CmdReceivedLeaveBanker extends ShanInPacket {
        data: { isBeing: boolean; id: number; name: string; };
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
                isBeing: this.getBool(),
                id: this.getInt(),
                name: this.getString(),
            }
            // this.data.userId = this.getInt();
            // this.data.isRegister = this.getBool();
        }
    }
    export class CmdReceivedBankerBeKick extends ShanInPacket {
        data: any;
        constructor(data: Uint8Array) {
            super(data);
            this.data = {
            }
            // this.data.userId = this.getInt();
            // this.data.isRegister = this.getBool();
        }
    }
}
export default cmd;
















