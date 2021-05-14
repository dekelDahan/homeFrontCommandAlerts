const discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');
const express =  require('express')
const app = express()


const webhookClient = new discord.WebhookClient(config.webhookId,config.webhookToken);

var lastAlarm = undefined

const checkAlerts = () => {
    axios.default.get(config.homeFrontCommandApi,{headers: {'X-Requested-With': 'XMLHttpRequest',Referer: config.referer}}).then((response) => {
        if(response.data && response.data.id !== lastAlarm.id){
            const embed = new discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Missile Attack Alert')
            .setAuthor('IDF Spokesperson Officer 🗣',config.authorIcon)
            .setThumbnail(config.thumbnailIcon)
            .addField('Where',response.data.data.join(','))
            .setFooter(response.data.id)
            .setTimestamp()
            webhookClient.send(embed)
            lastAlarm = response.data
        }
    }).catch((reason) => undefined)
}

app.get('/',(req,res) => {
    res.json(lastAlarm)
})

app.listen(() => {
    console.log('Start web server')
})

setInterval(checkAlerts,2000)