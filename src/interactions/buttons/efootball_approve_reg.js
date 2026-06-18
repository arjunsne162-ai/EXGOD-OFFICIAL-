import { getAllSlots, updatePlayerStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // രജിസ്ട്രേഷൻ പാനലിൽ രജിസ്റ്റർ ചെയ്ത യൂസറുടെ ഐഡി വെച്ച് നോക്കുന്നു
        const userId = interaction.message.interaction ? interaction.message.interaction.user.id : null;
       // രജിസ്ട്രേഷൻ എംബഡിൽ നിന്ന് വാല്യൂ എടുക്കുന്ന രീതി ഇങ്ങനെയാക്കുക
        const embed = interaction.message.embeds[0];
        
        // 'Phone' എന്നുള്ളത് കൃത്യമായി എംബഡിൽ ഉണ്ടോ എന്ന് നോക്കുന്നു
        const phoneField = embed?.fields.find(f => f.name && f.name.toLowerCase() === 'phone');
        const phone = phoneField ? String(phoneField.value).trim() : null;

        // പ്ലെയറെ കണ്ടുപിടിക്കാൻ നോക്കുന്നു (ലോഗ് വഴി എറർ ഉണ്ടോ എന്ന് പരിശോധിക്കാം)
        const allSlots = getAllSlots();
        const player = allSlots.find(p => String(p.phone).trim() === phone);

        if (!player) {
            console.log("Database slots:", JSON.stringify(allSlots)); // ടെർമിനലിൽ ഇത് പ്രിന്റ് ആകും
            return interaction.editReply({ content: `❌ Player with phone ${phone} not found! Check terminal logs.` });
        }
        if (!finalPlayer) {
            return interaction.editReply({ 
                content: `❌ Player not found! \nDebug Info: \nUser ID: ${userId}\nPhone: ${phone}` 
            });
        }

        // സ്റ്റാറ്റസ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        updatePlayerStatus(finalPlayer.phone, 'approved');

        await interaction.editReply({ content: `✅ Registration for **${finalPlayer.gameName}** is approved!` });
    }
};