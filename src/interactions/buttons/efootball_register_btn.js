import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
    name: 'efootball_register_btn', // നിന്റെ ബട്ടണിന്റെ customId ഇതാണെന്ന് ഉറപ്പാക്കുക
    async execute(interaction) {
        try {
            // ഇവിടെ ഒരിക്കലും deferReply() കൊടുക്കരുത്!

            // 1. മോഡൽ (ഫോം) ഉണ്ടാക്കുന്നു
            const modal = new ModalBuilder()
                .setCustomId('efootball_reg_modal') // ഇത് നമ്മൾ ശരിയാക്കിയ മോഡലിന്റെ പേരാണ്
                .setTitle('eFootball Registration');

            // 2. IGN ചോദിക്കുന്ന കളം
            const gameNameInput = new TextInputBuilder()
                .setCustomId('game_name')
                .setLabel("What is your In-Game Name (IGN)?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // 3. ഫോൺ നമ്പർ ചോദിക്കുന്ന കളം
            const phoneInput = new TextInputBuilder()
                .setCustomId('phone_number')
                .setLabel("What is your Phone Number?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // 4. കളങ്ങൾ ഫോമിലേക്ക് ചേർക്കുന്നു (ഓരോന്നും ഓരോ Row ആയിരിക്കണം)
            const firstActionRow = new ActionRowBuilder().addComponents(gameNameInput);
            const secondActionRow = new ActionRowBuilder().addComponents(phoneInput);

            modal.addComponents(firstActionRow, secondActionRow);

            // 5. ഫോം യൂസർക്ക് കാണിച്ചു കൊടുക്കുന്നു
            await interaction.showModal(modal);

        } catch (error) {
            console.error("❌ Error showing registration modal:", error);
        }
    }
};