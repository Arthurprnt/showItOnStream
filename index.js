const express = require("express");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const path = require('path');
const { token, channelId } = require("./config.json");
const axios = require("axios");
const fs = require("fs");

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
        const jsonString = fs.readFileSync("./static/liste.json");
        const file_liste = JSON.parse(jsonString);
        let newJSON;
        if (ind > 0) {
            newJSON = {
                txt: legende,
                atta: fichier,
                pdp: pdp,
                pseudo: pseudo,
                type: type,
                date: Date.now()
            };
        } else {
            newJSON = {
                txt: legende,
                pdp: pdp,
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
    }
})

client.login(token);