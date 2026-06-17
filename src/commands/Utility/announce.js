import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to send the announcement')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');

      const embed = createEmbed({
        title: '📢 Announcement',
        description: message
      });

      await channel.send({
        embeds: [embed]
      });

      await InteractionHelper.safeReply(interaction, {
        content: `✅ Announcement sent to ${channel}`
      });

      logger.info('Announcement command executed', {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        channelId: channel.id
      });

    } catch (error) {
      logger.error('Announcement command execution failed', {
        error: error.message,
        stack: error.stack,
        userId: interaction.user.id,
        guildId: interaction.guildId
      });

      await handleInteractionError(interaction, error, {
        commandName: 'announce',
        source: 'announce_command'
      });
    }
  }
};