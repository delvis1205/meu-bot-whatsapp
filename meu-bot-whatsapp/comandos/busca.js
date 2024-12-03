const { buscarVideoScraper } = require('../helpers/scraper');

async function buscarVideo(msg, chat, args) {
    if (args.length < 2) {
        msg.reply('Uso correto: !video [nome] [categoria]');
        return;
    }

    const [nome, ...categoria] = args;
    msg.reply(`Buscando o vídeo "${nome}" na categoria "${categoria.join(' ')}"...`);

    try {
        const videoPath = await buscarVideoScraper(nome, categoria.join(' '));
        if (videoPath) {
            await chat.sendMessage('Aqui está o vídeo solicitado:', {
                media: require('fs').createReadStream(videoPath),
            });
        } else {
            msg.reply('Nenhum vídeo encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar vídeo:', error);
        msg.reply('Erro ao buscar o vídeo.');
    }
}

module.exports = { buscarVideo };
