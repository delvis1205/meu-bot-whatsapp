const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');
const { buscarVideo } = require('./helpers/scraper');

const bot = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Configuração inicial
bot.on('qr', (qr) => {
    console.log('QR Code recebido. Escaneie com o WhatsApp!');
});

bot.on('ready', () => {
    console.log('Bot está online e pronto!');
});

// Escutando mensagens
bot.on('message', async (msg) => {
    const chat = await msg.getChat();
    const comando = msg.body.toLowerCase().split(' ')[0]; // Primeiro comando
    const argumentos = msg.body.split(' ').slice(1);      // Argumentos restantes

    if (comando === '!video') {
        if (argumentos.length < 2) {
            msg.reply('Uso: !video [nome do vídeo] [categoria]');
            return;
        }
        const nome = argumentos[0];
        const categoria = argumentos[1];
        msg.reply(`Procurando o vídeo "${nome}" na categoria "${categoria}"...`);

        try {
            const videoPath = await buscarVideo(nome, categoria);
            if (videoPath) {
                chat.sendMessage('Aqui está o vídeo solicitado:', {
                    media: fs.createReadStream(videoPath)
                });
            } else {
                msg.reply('Desculpe, não consegui encontrar o vídeo.');
            }
        } catch (err) {
            console.error(err);
            msg.reply('Ocorreu um erro ao tentar buscar o vídeo.');
        }
    }

    if (comando === '!menu') {
        msg.reply(`
Comandos disponíveis:
- !video [nome] [categoria]: Buscar vídeos.
- !admin: Registrar o administrador do bot.
- !abrirgrupo / !fechargrupo: Alterar configurações do grupo.
        `);
    }
});

// Inicializando o bot
bot.initialize();
