const TelegramBot = require('node-telegram-bot-api');
const gracefulShutdown = require('http-graceful-shutdown');
const axios = require('axios');

const TELEGRAM_API_KEY = '5253160548:AAHgYe2ZSHzevteKwNmKmHYaerAZsOcXow4';
const YA_API_KEY = 'AQVN2zCbDWhnbp-Pcfx14-yYn1ORi8k3VDq4x-gX';

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
            if (command == 'Выключи компьютер') {

                function shutdownFunction(signal) {
                    return new ((resolve) => {
                      console.log('... called signal: ' + signal);
                      console.log('... in cleanup')
                      setTimeout(function() {
                        console.log('... cleanup finished');
                        resolve();
                      }, 1000)
                    });
                  }
                  
                
                bot.sendMessage(msg.chat.id, 'Компьютер сейчас будет выключен!')
            }
        })

    })

});