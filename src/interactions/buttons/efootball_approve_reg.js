import { getAllSlots, updatePlayerStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // രജിസ്ട്രേഷൻ പാനലിൽ രജിസ്റ്റർ ചെയ്ത യൂസറുടെ ഐഡി വെച്ച് നോക്കുന്നു
        const userId = interaction.message.interaction ? interaction.message.interaction.user.id : null;
        
        const allSlots = getAllSlots();
        // ഡിസ്‌കോർഡ് യൂസർ ഐഡി വെച്ച് തിരയുന്നു
        const player = allSlots.find(p => p.userId === userId);

        // അത് കിട്ടിയില്ലെങ്കിൽ, എംബഡിലെ ഫോൺ നമ്പർ വെച്ച് നോക്കുന്നു
        const embed = interaction.message.embeds[0];
        const phoneField = embed?.fields.find(f => f.name.toLowerCase() === 'phone');
        const phone = phoneField ? phoneField.value : null;

        const playerByPhone = phone ? allSlots.find(p => p.phone === phone) : null;

        const finalPlayer = player || playerByPhone;

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