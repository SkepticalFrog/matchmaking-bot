import { ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, ModalSubmitInteraction, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Command } from './types';
import * as actions from './modals';

dotenv.config();
const token = process.env.DISCORD_TOKEN;

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async interaction => {


  if (interaction.isChatInputCommand())
    await handleChatInputCommand(interaction);
  
  if (interaction.isModalSubmit())
    await handleModalSubmit(interaction);
  });

const handleChatInputCommand = async (interaction: ChatInputCommandInteraction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}

const handleModalSubmit = async (interaction: ModalSubmitInteraction) => {
  console.log('interaction.customId', interaction.customId)
  console.log('actions', actions)

  const action: Function = actions[interaction.customId];
  await action(interaction);
}

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
