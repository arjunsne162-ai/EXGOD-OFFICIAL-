import { getAllSlots, updateSlotStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = interaction.message.embeds[0];
        const phoneField = embed.fields.find(f => f.name === 'Phone');
        const phone = phoneField ? phoneField.value : null;
        
        // പ്ലെയറുടെ യൂസർനെയിമും എടുക്കുന്നു
        const userName = interaction.message.interaction ? interaction.message.interaction.user.username : null;

        if (!phone) {
            return interaction.editReply({ content: '❌ Error: Phone number not found in registration details.' });
        }

        const allSlots = getAllSlots();
        
        // ഇവിടെ നമ്മൾ ഫോൺ നമ്പർ വെച്ചും, പ്ലെയറുടെ പേര് വെച്ചും തിരയുന്നു (ഏത് കിട്ടിയാലും മതി)
        const player = allSlots.find(p => p.phone === phone || (p.ign && p.ign.toLowerCase() === userName?.toLowerCase()));

        if (!player) {
            // ഡാറ്റാബേസിൽ ഇല്ലെങ്കിൽ എന്ത് ചെയ്യണമെന്ന് ഇവിടെ ലോഗ് ചെയ്യാം
            console.log('Searching for phone:', phone);
            return interaction.editReply({ content: '❌ Player not found in database! Ensure the phone number matches exactly.' });
        }

        try {
            // സ്റ്റാറ്റസ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
            updateSlotStatus(player.id, 'approved');
            await interaction.editReply({ content: `✅ Successfully approved registration for **${player.ign || 'Player'}**!` });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Error saving approval status. Check terminal logs.' });
        }
    }
};