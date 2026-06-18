import { getAllSlots, updatePlayerStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // രജിസ്ട്രേഷൻ പാനലിൽ രജിസ്റ്റർ ചെയ്ത യൂസറുടെ ഐഡി വെച്ച് നോക്കുന്നു
        const userId = interaction.message.interaction ? interaction.message.interaction.user.id : null;
       // രജിസ്ട്രേഷൻ എംബഡിൽ നിന്ന് വാല്യൂ എടുക്കുന്ന രീതി ഇങ്ങനെയാക്കുക
        const embed = interaction.message.embeds[0];
        
      const allSlots = getAllSlots();

        // എംബഡിൽ നിന്ന് ഫോൺ നമ്പർ എടുക്കുന്നു
        const phoneField = embed?.fields.find(f => f.name && f.name.toLowerCase() === 'phone');
        const rawPhone = phoneField ? String(phoneField.value).trim() : null;
        const phoneDigits = rawPhone ? rawPhone.replace(/\D/g, '') : null;

        // ഡാറ്റാബേസിൽ പ്ലെയറെ തിരയുന്നു
        const player = allSlots.find(p => {
            const dbDigits = String(p.phone).replace(/\D/g, '');
            return dbDigits === phoneDigits;
        });

        if (!player) {
            console.log("Searching for digits:", phoneDigits);
            console.log("Database contents:", JSON.stringify(allSlots));
            return interaction.editReply({ content: `❌ Player not found in database! (Phone: ${rawPhone})` });
        }

        // സ്റ്റാറ്റസ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        updatePlayerStatus(player.phone, 'approved');

        await interaction.editReply({ content: `✅ Registration for **${player.gameName}** is approved!` });

        await interaction.editReply({ content: `✅ Registration for **${finalPlayer.gameName}** is approved!` });
    }
};