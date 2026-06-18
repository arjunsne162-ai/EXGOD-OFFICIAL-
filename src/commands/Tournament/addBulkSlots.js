import { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('add-bulk-slots')
        .setDescription('Add multiple players at once using a list.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('bulk_add_modal')
            .setTitle('Add Multiple Players');

        const playersInput = new TextInputBuilder()
            .setCustomId('players_list')
            .setLabel("Enter Players (IGN - Phone)")
            .setPlaceholder("Arjun - 9876543210\nSmars - 9988776655")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(playersInput));
        await interaction.showModal(modal);
    }
};