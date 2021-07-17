import {
    WAConnection,
    MessageType,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
} from "@adiwajshing/baileys"
import * as fs from 'fs'
import axios from 'axios'

require('dotenv').config()

async function connectToWhatsapp() {
    const conn = new WAConnection() 
    conn.autoReconnect = ReconnectMode.onConnectionLost 
    conn.logger.level = 'debug' 
    conn.connectOptions.maxRetries = 10

    fs.existsSync('./auth_info.json') && conn.loadAuthInfo ('./auth_info.json')
    
    await conn.connect()

    const authInfo = conn.base64EncodedAuthInfo() 
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) 


    conn.on('chat-update', async chat => {
        if (chat.presences) {
            Object.values(chat.presences).forEach(presence => console.log( `${presence.name}'s presence is ${presence.lastKnownPresence} in ${chat.jid}`))
        }
        if(chat.imgUrl) {
            console.log('imgUrl of chat changed ', chat.imgUrl)
            return
        }
        if (!chat.hasNewMessage) {
            if(chat.messages) {
                console.log('updated message: ', chat.messages.first)
            }
            return
        } 
        
        const m = chat.messages.all()[0] 
        const messageStubType = WA_MESSAGE_STUB_TYPES[m.messageStubType] ||  'MESSAGE'
        console.log('got notification of type: ' + messageStubType)

        const messageContent = m.message
        if (!messageContent) return
        
        if (m.key.fromMe) {
            console.log('relayed my own message')
            return
        }

        let sender = m.key.remoteJid
        const messageType = Object.keys (messageContent)[0] 
        if (messageType === MessageType.text) {
            const text = m.message.conversation
            if(text == '!ping') {
                await conn.sendMessage(sender, '!pong', MessageType.text)
            } else if(text.startsWith('!daftar')) {
                let namaPel = text.split("@")[1];
                let domPel = text.split("@")[2];
                let noAwal = sender;
                let noPel = noAwal.split("@")[0]
                noPel = noPel.replace("62", "0")
                await axios
                    .post(
                        process.env.APIMEMBER,
                        JSON.stringify({
                        token: process.env.APITOKEN,
                        name: namaPel,
                        phone: noPel,
                        city: domPel,
                        }),
                        {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        }
                    )
                    .then((res) => {
                        console.log(res.data);
                        // cek data user sudah ada apa belum
                        // res.data.status tergantung dari api
                        // error = sudah terdaftar, success = belum terdaftar
                        if (res.data.status == "error") {
                        let reply =
`Yth Bpk/Ibu
${res.data.name}
Jangan khawatir!
Anda sudah menjadi member kami!
Nantikan promo selanjutnya!

Berikut data anda yg disimpan:
Nama: ${res.data.name}
No Telepon: ${res.data.phone}
Domisili: ${res.data.city}

Jangan khawatir!!
Kami sangat menjaga privasi anda!
`
                        ;
                        conn.sendMessage(sender, reply, MessageType.text);
                    } else if (res.data.status == "success") {
                        let reply = 
`Yeah selamat!
Berhasil menjadi member kami!
Nantikan promo selanjutnya!

Berikut data anda yg disimpan:
Nama: ${namaPel}
No Telepon: ${noPel}
Domisili: ${domPel}

Jangan khawatir!!
Kami sangat menjaga privasi anda!
`
                        ;
                        conn.sendMessage(sender, reply, MessageType.text);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    })
    conn.on('close', ({reason, isReconnecting}) => (
        console.log ('oh no got disconnected: ' + reason + ', reconnecting: ' + isReconnecting)
    ))
}

connectToWhatsapp().catch((err) => console.log(err))
