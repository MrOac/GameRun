import Configs from "../../Loading/src/Configs";
import App from "./Script/common/App";
import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";
import CardGameCmd from "./Script/networks/CardGame.Cmd";
import CardGameNetworkClient from "./Script/networks/CardGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";
import TienLenCmd from "./TienLenScript/TienLen.Cmd";
import TienLenGameLogic from "./TienLenScript/TienLen.GameLogic";


const { ccclass, property } = cc._decorator;

namespace Lobby {
    @ccclass
    export class CardRoom extends cc.Component {

        @property(cc.Node)
        roomContent: cc.Node = null;
        @property(cc.Prefab)
        roomItem: cc.Node = null;

        networkClient: CardGameNetworkClient = null;

        start() {
            this.networkClient.addListener(this.handleRoomRespone, this);
        }

        handleRoomRespone = (data) => {
            let inpacket = new InPacket(data);
             ////Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case CardGameCmd.Code.JOIN_ROOM_FAIL: {
                    let res = new CardGameCmd.ReceivedJoinRoomFail(data);
                    var e = "";
                    switch (res.error) {
                        case 1:
                            e = "កំហុសក្នុងការត្រួតពិនិត្យព័ត៌មាន!";
                            break;
                        case 2:
                            e = "មិនអាចស្វែងរកបន្ទប់សមរម្យបានទេ។ សូម​ព្យាយាម​ម្តង​ទៀត​នៅ​ពេល​ក្រោយ!";
                            break;
                        case 3:
                            e = "អ្នកមិនមានលុយគ្រប់គ្រាន់ដើម្បីចូលបន្ទប់លេងនេះទេ។!";
                            break;
                        case 4:
                            e = "មិនអាចស្វែងរកបន្ទប់សមរម្យបានទេ។ សូម​ព្យាយាម​ម្តង​ទៀត​នៅ​ពេល​ក្រោយ!";
                            break;
                        case 5:
                            e = "រាល់ពេលដែលចូលបន្ទប់ត្រូវតែនៅដាច់ពីគ្នា 10 វិនាទី!";
                            break;
                        case 6:
                            e = "ប្រព័ន្ធថែទាំ!";
                            break;
                        case 7:
                            e = "រកមិនឃើញបន្ទប់ហ្គេមទេ។!";
                            break;
                        case 8:
                            e = "ពាក្យសម្ងាត់បន្ទប់ហ្គេមមិនត្រឹមត្រូវទេ។!";
                            break;
                        case 9:
                            e = "បន្ទប់លេងពេញទៅដោយមនុស្ស!";
                            break;
                        case 10:
                            e = "ម្ចាស់​មិន​អនុញ្ញាត​ឱ្យ​អ្នក​ចូល​ក្នុង​បន្ទប់​ទេ។!"
                    }
                    App.instance.alertDialog.showMsg(e);
                    break;
                }
                case TienLenCmd.Code.JOIN_ROOM_SUCCESS: {
                    let res = new TienLenCmd.ReceivedJoinRoomSuccess(data);
                     ////Utils.Log(res);
                    TienLenGameLogic.getInstance().initWith(res);
                    App.instance.openGame("TienLen", "TienLen");
                    break;
                }
                case TienLenCmd.Code.AUTO_START: {
                    let res = new TienLenCmd.ReceivedAutoStart(data);
                     ////Utils.Log(res);
                    TienLenGameLogic.getInstance().autoStart(res);
                    break;
                }
            }
        };

        initRooms(rooms, client) {
            this.networkClient = client;

            this.roomContent.removeAllChildren();
            rooms.forEach(room => {
                var item = cc.instantiate(this.roomItem);
                var txts = item.getComponentsInChildren(cc.Label);
                Tween.numberTo(txts[2], room.moneyRequire, 0.3);
                Tween.numberTo(txts[3], room.moneyBet, 0.3);
                txts[4].string = room.nPersion + "/" + room.maxUserPerRoom;
                var progress = item.getComponentInChildren(cc.ProgressBar);
                progress.progress = room.nPersion / room.maxUserPerRoom;
                var btnJoin = item.getComponentInChildren(cc.Button);
                btnJoin.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                    this.networkClient.send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0, room.roomIndex));
                });
                item.parent = this.roomContent;
            });
        }
    }
}
export default Lobby.CardRoom;
