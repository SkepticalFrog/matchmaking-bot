import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getClient } from '../redis_api/init';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-channel')
    .setDescription('Replies with Pong!')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to use for matchmaking.')
    ),
  async execute(interaction: CommandInteraction) {
    const perms = interaction.memberPermissions;
    const guildId = interaction.guildId;
    const channel = interaction.options.get('channel')?.channel;

    if (!(perms && guildId && channel)) {
      await interaction.reply({ ephemeral: true, content: 'Missing parameter.' });
      return;
    }

    if (!perms?.has('ManageChannels')) {
      await interaction.reply({
        ephemeral: true,
        content: "You don't have the permissions needed to use this command.",
      });
      return;
    }

    const redis = await getClient();
    if (!redis) throw new Error("Redis couldn't connect.");

    console.log(`Saving channel ${channel.id} in redis at ${'default-channel:' + guildId}`)
    const res = await redis.set('default-channel:' + guildId, channel.id);
    if (res !== 'OK') 
      if (!redis) throw new Error("Redis error.");

    await interaction.reply({
      ephemeral: true,
      content: `Channel <#${channel.id}> now used for matchmaking.`
    });
  },
};
