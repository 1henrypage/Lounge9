const fs = require('fs');
const { Client, Collection, Intents, Interaction } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const { REPL_MODE_SLOPPY } = require('repl');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { resolve } = require('path');
const { getFips } = require('crypto');
const { readdir } = require('fs').promises;

const commands = [];

const client = new Client({ intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    //Intents.FLAGS.GUILD_MEMBERS,
    //Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_VOICE_STATES,
	]});
	
client.commands = new Collection();

const eventFiles = fs.readdirSync('./events').filter(file=>file.endsWith('.js'));

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const rest = new REST({ version: '9'}).setToken(token);

(async () => {
	try {
		console.log("Started refreshing / commands");
		await rest.put(
			Routes.applicationGuildCommands(clientId,guildId),
			{body: commands},
		);
		console.log("Refresh successful");
	} catch (error) {
		console.log("Refresh Error: " + error);
	}
})();

client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//Event handler
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply( { content: "Something went wrong, report this to Demensce#6723", ephemeral: true});
	}

})

client.login(token);