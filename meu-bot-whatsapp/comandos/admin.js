const fs = require('fs-extra');
const path = require('path');
const adminFilePath = path.join(__dirname, '../admins.json');

async function registrarAdmin(msg, chat) {
    const adminData = await fs.readJSON(adminFilePath).catch(() => ({}));
    const adminNumber = msg.from;

    if (adminData[adminNumber]) {
        msg.reply('Você já está registrado como administrador.');
        return;
    }

    adminData[adminNumber] = true;
    await fs.writeJSON(adminFilePath, adminData, { spaces: 2 });
    msg.reply('Você foi registrado como administrador do bot.');
}

module.exports = { registrarAdmin };
