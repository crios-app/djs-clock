require('dotenv').config()
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

// cron
const cron = require('node-cron');

// discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

const getTimeEmoji = (now) => {
  if (now.hour() === 0 || now.hour() === 12) return '🕛';
  else if (now.hour() === 1 || now.hour() === 13) return '🕐';
  else if (now.hour() === 2 || now.hour() === 14) return '🕑';
  else if (now.hour() === 3 || now.hour() === 15) return '🕒';
  else if (now.hour() === 4 || now.hour() === 16) return '🕓';
  else if (now.hour() === 5 || now.hour() === 17) return '🕔';
  else if (now.hour() === 6 || now.hour() === 18) return '🕕';
  else if (now.hour() === 7 || now.hour() === 19) return '🕖';
  else if (now.hour() === 8 || now.hour() === 20) return '🕗';
  else if (now.hour() === 9 || now.hour() === 21) return '🕘';
  else if (now.hour() === 10 || now.hour() === 22) return '🕙';
  else if (now.hour() === 11 || now.hour() === 23) return '🕚';
  else return ''
}

cron.schedule('*/10 * * * *', () => {
  client.emit('customClockUpdate')
}).start()

const getTime = (time, zone) => `${getTimeEmoji(time)} ${time.format('HH:mm')} ${zone}`

function getBothTimes() {
  const now = dayjs()
  const time1 = dayjs(now).tz(process.env.TZ_ONE)
  const time2 = dayjs(now).tz(process.env.TZ_TWO)
  return `${getTime(time1, process.env.TZ_ONE_NAME)}•${time2.format('HH:mm')} ${process.env.TZ_TWO_NAME}`
}

function renameChannel(client, channel, data) {
  client.channels.cache.get(channel).setName()
    .then(channel => channel.setName(data))
}

client.on('ready', () => { console.log("Ready") });
client.on('customClockUpdate', () => {
  const data = getBothTimes()
  console.log(data);
  renameChannel(client, process.env.CHANNELID, data)
})
client.on('message', message => {
  const prefix = process.env.PREFIX 
  if (!message.author.bot && message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase()
    if (command === 'update') client.emit('customClockUpdate')
    else message.channel.send('did you mean update?')
}})
