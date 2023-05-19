import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import NetworkClient from "../../Lobby/LobbyScript/Script/networks/Network.NetworkClient";
import NetworkListener from "../../Lobby/LobbyScript/Script/networks/Network.NetworkListener";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";
import cmd from "./Shan.Cmd";
import { ConnectionState } from "./Shan.Contants";


export default class ShanNetworkClient extends NetworkClient {



    private static instance: ShanNetworkClient;

    private listeners: Array<NetworkListener> = new Array<NetworkListener>();
    _state: any;

    public static getInstance(): ShanNetworkClient {
        if (this.instance == null) {
            this.instance = new ShanNetworkClient();
        }
        return this.instance;
    }

    constructor() {
        super();
        this.isUseWSS = Configs.App.USE_WSS;
        this._state = ConnectionState.NO_CONNECTION;
        this.isAutoReconnect = false;
    }

    public connect() {
        this.setState(ConnectionState.CONNECTING);
        super.connect("shankoemee.vietkieu888.com", 443);
    }

    protected onOpen(ev: Event) {
        super.onOpen(ev);
        this.setState(ConnectionState.CONNECTED);
    }
    protected onError(ev: Event): void {
        super.onError(ev);
        this.setState(ConnectionState.NO_CONNECTION);
    }
    protected onClose(ev: Event) {
        //Utils.Log("onClose");
        for (var i = 0; i < this._onCloses.length; i++) {
            var listener = this._onCloses[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(null);
            } else {
                this._onCloses.splice(i, 1);
                i--;
            }
        }
        this.setState(ConnectionState.NO_CONNECTION);
        if (this.isAutoReconnect && !this.isForceClose) {
            // let reconnectCount = 0;

            setTimeout(() => {
                if (!this.isForceClose) super.connect(this.host, this.port);
            }, 2000);
        }
    }
    protected onMessage(ev: MessageEvent) {
        // cc.log("<<<<<<<<");

        var data = new Uint8Array(ev.data);
        let inpacket = new InPacket(data);
        // cc.log("<<<<<", inpacket.getCmdId(), "<<<<<", inpacket.getError());
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.target && listener.target instanceof Object && listener.target.node) {
                listener.callback(data);
            } else {
                this.listeners.splice(i, 1);
                i--;
            }
        }
    }

    public addListener(callback: (data: Uint8Array) => void, target: cc.Component) {
        this.listeners.push(new NetworkListener(target, callback));
    }
    setState(s) {
        this._state = s;
    }
    getState() {
        return this._state;
    }
    public send(packet: OutPacket) {
        // cc.log(">>>>>", packet._cmdId, ">>>>>")
        for (var b = new Int8Array(packet._length), c = 0; c < packet._length; c++)
            b[c] = packet._data[c];
        if (this.ws != null && this.isConnected())
            this.ws.send(b.buffer);
    }
    public sendInGame(packet: OutPacket) {
        // cc.log(">>>=>>", packet._cmdId, ">>>=>>")
        var b = new Int8Array(packet._length);
        for (let c = 0; c < packet._length; c++)
            b[c] = packet._data[c];
        if (this.ws != null && this.isConnected())
            this.ws.send(b.buffer);
    }
    leaveRoom() {
        this.send(new cmd.SendLeaveGame());
    }
    sendUserAction(_userAction: boolean) {
        this.send(new cmd.SendUserAction(_userAction))
    }
    getJackPot() {
        throw new Error("Method not implemented.");
    }
    seen() {
        this.send(new cmd.SendSeen())
    }
    bet(amount) {
        cc.log("send bet ", amount);
        this.send(new cmd.SendBet(amount));
    }
    draw() {
        cc.log("Draw");
        this.send(new cmd.SendDraw());
    }

    noDraw() {
        this.send(new cmd.SendNoDraw())
    }

    compare() {
        this.send(new cmd.SendCompare())
    }
    getUserInfo(userId: string, cb: any) {
        // this.send(new )
    }
    disconnect() {
        if (this.getState() != ConnectionState.NO_CONNECTION && this.getState() != ConnectionState.CLOSING)
            this.closeSocket();
        this.setState(ConnectionState.CLOSING);
    }
    closeSocket() {
        this.ws.close();
    }
}
