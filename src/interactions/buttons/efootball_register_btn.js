import { getAllSlots, updateSlotStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // രജിസ്ട്രേഷൻ പാനലിൽ നിന്ന് പ്ലെയറുടെ ഫോൺ നമ്പർ എടുക്കുന്നു (സാധാരണയായി എംബഡിൽ നിന്ന്)
        const embed = interaction.message.embeds[0];
        const phoneField = embed.fields.find(f => f.name === 'Phone');
        const phone = phoneField ? phoneField.value : null;

        if (!phone) {
            return interaction.editReply({ content: '❌ Error: Could not find phone number in registration details.' });
        }

        const allSlots = getAllSlots();
        // ഫോൺ നമ്പർ വെച്ച് പ്ലെയറെ കണ്ടുപിടിക്കുന്നു (userId ഇല്ലെങ്കിലും കുഴപ്പമില്ല)
        const player = allSlots.find(p => p.phone === phone);

        if (!player) {
            return interaction.editReply({ content: '❌ Player not found in database! Please ensure the registration details match the bulk add list.' });
        }

        // പ്ലെയർ സ്റ്റാറ്റസ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        updateSlotStatus(player.id, 'approved');

        await interaction.editReply({ content: `✅ Successfully approved registration for **${player.ign}**!` });
    }
};