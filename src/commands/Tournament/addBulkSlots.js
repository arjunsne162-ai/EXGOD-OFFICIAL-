import { addPlayerToSlot } from '../../utils/slotManager.js';

export default {
    name: 'bulk_add_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const list = interaction.fields.getTextInputValue('players_list');
        const lines = list.split('\n');
        let successCount = 0;
        let errorCount = 0;

        for (const line of lines) {
            if (!line.trim()) continue; // ഒഴിഞ്ഞ വരികൾ ഒഴിവാക്കുന്നു

            try {
                // അവസാനത്തെ ഹൈഫൻ വെച്ച് മാത്രം സ്പ്ലിറ്റ് ചെയ്യുന്നു (ഇത് കൂടുതൽ സേഫ് ആണ്)
                const lastHyphenIndex = line.lastIndexOf('-');
                if (lastHyphenIndex === -1) {
                    errorCount++;
                    continue;
                }

                const ign = line.substring(0, lastHyphenIndex).trim();
                const phone = line.substring(lastHyphenIndex + 1).trim();

                if (ign && phone) {
                    addPlayerToSlot('ManualPlayer', `manual_${Date.now()}_${successCount}`, ign, phone);
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (e) {
                errorCount++;
            }
        }

        await interaction.editReply({ 
            content: `✅ Successfully added **${successCount}** players!\n❌ Failed lines: **${errorCount}**` 
        });
    }
};