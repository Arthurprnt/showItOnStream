const express = require("express");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const path = require('path');
const { token, channelId } = require("./config.json");
const axios = require("axios");
const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require("canvas");
const sharp = require("sharp")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.use(express.static('static'));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

const client = new Client({
    intents: [
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.Guilds
    ],
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.channel.id === channelId) {
        var legende = message.content;
        var fichiers = message.attachments;
        let ind = 0;
        let fichier;
        let type;
        fichiers.forEach (function(value, key) {
            if(ind === 0) {
                fichier = value.attachment;
                type = value.contentType;
                ind += 1;
            }
        })
        var pdp = message.author.avatarURL();
        var pseudo = message.author.globalName;

        const canvas = createCanvas(1900, 155);
        const ctx = canvas.getContext("2d");
        registerFont('./static/Montserrat-ExtraBold.ttf', { family: 'Mont' })
        ctx.font = '35px Mont';
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 1;
        var txtSize = ctx.measureText(pseudo).width;
        let dx;
        if(txtSize > 100) {
            dx = 0;
        } else {
            dx = 50-txtSize/2;
        }
        ctx.fillText(pseudo, dx, 140);
        ctx.strokeText(pseudo, dx, 140);

        const imageResponse = await axios.get(pdp, {
            responseType: 'arraybuffer',
        });
        const img = await sharp(imageResponse.data).toFormat('png').toBuffer();
        loadImage(img).then((canvasImage) => {
            let dx;
            if(100 > txtSize) {
                dx = 0;
            } else {
                dx = txtSize/2-50;
            }
            const circle = {
                x: dx+50,
                y: 50,
                radius: 50,
            }
            
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const hsx = circle.radius;
            const hsy = circle.radius;
            ctx.drawImage(canvasImage, circle.x - hsx,circle.y - hsy,hsx * 2, hsy * 2);

            let newJSON;
            if (ind > 0) {
                newJSON = {
                    txt: legende,
                    atta: fichier,
                    pdp: canvas.toDataURL(),
                    pseudo: pseudo,
                    type: type,
                    date: Date.now()
                };
            } else {
                newJSON = {
                    txt: legende,
                    pdp: canvas.toDataURL(),
                    pseudo: pseudo,
                    date: Date.now()
                };
            }
            delay(10);
            fs.writeFile('./static/liste.json', JSON.stringify(newJSON), err => {
                if (err) {
                    console.log("Erreur lors de l'ajout de l'element à la liste", err)
                } else {
                    console.log('Element ajouté à la liste avec succès')
                }
            })
        })
    }
})

client.login(token);