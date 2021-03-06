const TelegramBot = require('node-telegram-bot-api');
const gracefulShutdown = require('http-graceful-shutdown');
const axios = require('axios');

const TELEGRAM_API_KEY = '5253160548:AAHgYe2ZSHzevteKwNmKmHYaerAZsOc****';
const YA_API_KEY = 'AQVN2zCbDWhnbp-Pcfx14-yYn1ORi8k3VDq****';

const bot = new TelegramBot(TELEGRAM_API_KEY, {polling: true});

bot.on('voice', (msg) => {
    const stream = bot.getFileStream(msg.voice.file_id);

    let chunks = [];
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => {

        const axiosConfig = {
            method: 'POST',
            url: "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize",
            headers: {
                Authorization: 'Api-Key ' + YA_API_KEY
            },
            data: Buffer.concat(chunks),
        }

        axios(axiosConfig)
        .then((response) => {
            const command = response.data.result;
            if (command == 'Выключи компьютер')
                  
                bot.sendMessage(msg.chat.id, 'Компьютер сейчас будет выключен!')

                    exec('shutdown /s') 
            
            }
        })

    })

});
