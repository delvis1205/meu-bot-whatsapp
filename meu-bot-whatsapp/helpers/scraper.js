const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function buscarVideoScraper(nome, categoria) {
    const pesquisaUrl = `https://xvideos.com/search?q=${encodeURIComponent(nome)}+${encodeURIComponent(categoria)}`;
    const pastaDownload = path.join(__dirname, '../downloads');
    await fs.ensureDir(pastaDownload);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(pesquisaUrl);
        const videoUrl = await page.evaluate(() => {
            const link = document.querySelector('a.video-link'); // Ajuste para o site
            return link ? link.href : null;
        });

        if (!videoUrl) {
            await browser.close();
            return null;
        }

        const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const videoPath = path.join(pastaDownload, `${nome}.mp4`);
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await browser.close();
        return videoPath;
    } catch (err) {
        console.error('Erro ao buscar vídeo:', err);
        await browser.close();
        return null;
    }
}

module.exports = { buscarVideoScraper };
