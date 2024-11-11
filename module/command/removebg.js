module.exports.config = {
  name: 'removebg',
  version: '1.1.1',
  hasPermssion: 0,
  credits: '𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓',
  description: 'Edit photo',
  commandCategory: 'Tools',
  usages: 'Reply images or url images',
  cooldowns: 2,
  dependencies: {
       'form-data': '',
       'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.run = async function({ api, event, args }) {
    try {
        if (event.type !== "message_reply") return api.sendMessage("𝙔𝙤𝙪 𝙈𝙪𝙨𝙩 𝙍𝙚𝙥𝙡𝙮 𝙏𝙤 𝙖 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("𝙍𝙚𝙥𝙡𝙮 𝙏𝙤 𝘼 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("𝙏𝙝𝙞𝙨 𝙄𝙨 𝙉𝙤𝙩 𝘼 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);

        const content = event.messageReply.attachments[0].url;
        const MtxApi = ["hWqjRNy9nZKERcCSrG8iMsmL", "e5xLruu9JdxAHvAcvkhmBLg3"];
        const inputPath = path.resolve(__dirname, 'cache', 'photo.png');

        await image({ url: content, dest: inputPath });

        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), 'photo.png');

        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': MtxApi[Math.floor(Math.random() * MtxApi.length)],
            },
            encoding: null
        })
        .then((response) => {
            if (response.status != 200) return console.error('Error:', response.status, response.statusText);
            fs.writeFileSync(inputPath, response.data);
            return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
        })
        .catch((error) => {
            console.error('𝙈𝙏𝙓-𝙎𝙚𝙧𝙫𝙚𝙧 𝙁𝙖𝙞𝙡:', error);
            api.sendMessage("Error processing the image. Please try again.", event.threadID, event.messageID);
        });
    } catch (e) {
        console.log(e);
        api.sendMessage("An error occurred while processing the image.", event.threadID, event.messageID);
    }
};