import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
    name: 'efootball_register_btn',
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('efootball_reg_modal')
            .setTitle('Tournament Registration');

        const gameNameInput = new TextInputBuilder()
            .setCustomId('game_name')
            .setLabel("In-Game Name (IGN)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const phoneInput = new TextInputBuilder()
            .setCustomId('phone_number')
            .setLabel("Phone Number")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(gameNameInput),
            new ActionRowBuilder().addComponents(phoneInput)
        );

        await interaction.showModal(modal);
    }
};