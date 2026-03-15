const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
 ]
});

client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {

 const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

 for (const file of commandFiles) {

  const command = require(`./commands/${folder}/${file}`);

  client.commands.set(command.name, command);

 }

}

client.once('ready', () => {

 console.log("🐺 Lonewolves Bot Online");

 // BOT STATUS
 client.user.setPresence({
  status: 'dnd',
  activities: [{
   name: 'Lonewolves Family',
   type: ActivityType.Watching
  }]
 });

});

client.on('messageCreate', async message => {

 if (!message.content.startsWith(config.prefix) || message.author.bot) return;

 const args = message.content.slice(config.prefix.length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();

 const command = client.commands.get(commandName);

 if (!command) return;

 try {
  command.execute(message, args);
 } catch (error) {
  console.error(error);
 }

});

client.login(config.token);