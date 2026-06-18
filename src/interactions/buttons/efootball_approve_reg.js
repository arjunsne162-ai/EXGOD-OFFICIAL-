import { getAllSlots, updatePlayerStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = interaction.message.embeds[0];
        const phoneField = embed.fields.find(f => f.name === 'Phone');
        const phone = phoneField ? phoneField.value : null;

        if (!phone) return interaction.editReply({ content: '❌ Error: Phone number not found.' });

        const allSlots = getAllSlots();
        const player = allSlots.find(p => p.phone === phone);

        if (!player) {
            return interaction.editReply({ content: '❌ Player not found in database!' });
        }

        // സ്റ്റാറ്റസ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        updatePlayerStatus(phone, 'approved');

        await interaction.editReply({ content: `✅ Registration for **${player.gameName}** is successfully approved!` });
    }
};