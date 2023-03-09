import {
  ActionRowBuilder,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates lobby for players.'),
  async execute(interaction: CommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId('lobbyCreation')
      .setTitle('Lobby creation');

    const gameInput = new TextInputBuilder()
      .setCustomId('game-input')
      .setLabel('Game you want to play:')
      .setStyle(TextInputStyle.Short);

    const nbPlayersInput = new TextInputBuilder()
      .setCustomId('nb-players-input')
      .setLabel('Numbers of players needed:')
      .setStyle(TextInputStyle.Short);

    const level = new TextInputBuilder()
      .setCustomId('level-players')
      .setLabel('Level needed:')
      .setStyle(TextInputStyle.Short);

    const lobbyInfo = new TextInputBuilder()
      .setCustomId('lobby-info')
      .setLabel('Info to join lobby (lobby ID, friend invite):')
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        gameInput
      );

    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        nbPlayersInput
      );

    const thirdActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        level
      );

    const fourthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        lobbyInfo
      );

    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow
    );

    await interaction.showModal(modal);
  },
};
