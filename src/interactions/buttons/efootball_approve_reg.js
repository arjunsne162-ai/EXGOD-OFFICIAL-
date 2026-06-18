import { getAllSlots } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // രജിസ്ട്രേഷൻ എംബഡിൽ നിന്ന് ഫോൺ നമ്പർ എടുക്കുന്നു
        const embed = interaction.message.embeds[0];
        const phoneField = embed.fields.find(f => f.name === 'Phone');
        const phone = phoneField ? phoneField.value : null;

        if (!phone) {
            return interaction.editReply({ content: '❌ Error: Phone not found.' });
        }

        const allSlots = getAllSlots();
        
        // ഇവിടെയാണ് പ്രധാന മാറ്റം: 
        //userId നോക്കുന്നതിന് പകരം ഫോൺ നമ്പർ വെച്ച് ഡാറ്റാബേസിൽ തിരയുന്നു
        const player = allSlots.find(p => p.phone === phone);

        if (!player) {
            return interaction.editReply({ content: '❌ Player not found in database!' });
        }

        // ഇനി ഇവിടുത്തെ അപ്രൂവൽ ലോജിക് വർക്ക് ആകും
        await interaction.editReply({ content: `✅ Registration for **${player.gameName}** is approved!` });
    }
};