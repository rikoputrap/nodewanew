"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var baileys_1 = require("@adiwajshing/baileys");
var fs = require("fs");
var axios_1 = require("axios");
require('dotenv').config();
function connectToWhatsapp() {
    return __awaiter(this, void 0, void 0, function () {
        var conn, authInfo;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conn = new baileys_1.WAConnection();
                    conn.autoReconnect = baileys_1.ReconnectMode.onConnectionLost;
                    conn.logger.level = 'debug';
                    conn.connectOptions.maxRetries = 10;
                    fs.existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json');
                    return [4 /*yield*/, conn.connect()];
                case 1:
                    _a.sent();
                    authInfo = conn.base64EncodedAuthInfo();
                    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'));
                    conn.on('chat-update', function (chat) { return __awaiter(_this, void 0, void 0, function () {
                        var m, messageStubType, messageContent, sender, messageType, text, namaPel_1, domPel_1, noAwal, noPel_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (chat.presences) {
                                        Object.values(chat.presences).forEach(function (presence) { return console.log(presence.name + "'s presence is " + presence.lastKnownPresence + " in " + chat.jid); });
                                    }
                                    if (chat.imgUrl) {
                                        console.log('imgUrl of chat changed ', chat.imgUrl);
                                        return [2 /*return*/];
                                    }
                                    if (!chat.hasNewMessage) {
                                        if (chat.messages) {
                                            console.log('updated message: ', chat.messages.first);
                                        }
                                        return [2 /*return*/];
                                    }
                                    m = chat.messages.all()[0];
                                    messageStubType = baileys_1.WA_MESSAGE_STUB_TYPES[m.messageStubType] || 'MESSAGE';
                                    console.log('got notification of type: ' + messageStubType);
                                    messageContent = m.message;
                                    if (!messageContent)
                                        return [2 /*return*/];
                                    if (m.key.fromMe) {
                                        console.log('relayed my own message');
                                        return [2 /*return*/];
                                    }
                                    sender = m.key.remoteJid;
                                    messageType = Object.keys(messageContent)[0];
                                    if (!(messageType === baileys_1.MessageType.text)) return [3 /*break*/, 4];
                                    text = m.message.conversation;
                                    if (!(text == '!ping')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, conn.sendMessage(sender, '!pong', baileys_1.MessageType.text)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    if (!text.startsWith('!daftar')) return [3 /*break*/, 4];
                                    namaPel_1 = text.split("@")[1];
                                    domPel_1 = text.split("@")[2];
                                    noAwal = sender;
                                    noPel_1 = noAwal.split("@")[0];
                                    noPel_1 = noPel_1.replace("62", "0");
                                    return [4 /*yield*/, axios_1["default"]
                                            .post(process.env.APIMEMBER, JSON.stringify({
                                            token: process.env.APITOKEN,
                                            name: namaPel_1,
                                            phone: noPel_1,
                                            city: domPel_1
                                        }), {
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        })
                                            .then(function (res) {
                                            console.log(res.data);
                                            // cek data user sudah ada apa belum
                                            // res.data.status tergantung dari api
                                            // error = sudah terdaftar, success = belum terdaftar
                                            if (res.data.status == "error") {
                                                var reply = "Yth Bpk/Ibu\n" + res.data.name + "\nJangan khawatir!\nAnda sudah menjadi member kami!\nNantikan promo selanjutnya!\n\nBerikut data anda yg disimpan:\nNama: " + res.data.name + "\nNo Telepon: " + res.data.phone + "\nDomisili: " + res.data.city + "\n\nJangan khawatir!!\nKami sangat menjaga privasi anda!\n";
                                                conn.sendMessage(sender, reply, baileys_1.MessageType.text);
                                            }
                                            else if (res.data.status == "success") {
                                                var reply = "Yeah selamat!\nBerhasil menjadi member kami!\nNantikan promo selanjutnya!\n\nBerikut data anda yg disimpan:\nNama: " + namaPel_1 + "\nNo Telepon: " + noPel_1 + "\nDomisili: " + domPel_1 + "\n\nJangan khawatir!!\nKami sangat menjaga privasi anda!\n";
                                                conn.sendMessage(sender, reply, baileys_1.MessageType.text);
                                            }
                                        })["catch"](function (error) {
                                            console.error(error);
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    conn.on('close', function (_a) {
                        var reason = _a.reason, isReconnecting = _a.isReconnecting;
                        return (console.log('oh no got disconnected: ' + reason + ', reconnecting: ' + isReconnecting));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
connectToWhatsapp()["catch"](function (err) { return console.log(err); });
