import { getAllSlots, addBulkPlayer } from '../../utils/slotManager.js'; // getAllSlots കൂടെ ഇംപോർട്ട് ചെയ്യുക

export default {
    name: 'bulk_add_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const list = interaction.fields.getTextInputValue('players_list');
        const lines = list.split('\n');
        
        // 1. നിലവിലുള്ള എല്ലാ പ്ലെയേഴ്സിനെയും എടുക്കുന്നു
        const currentSlots = getAllSlots(); 
        let successCount = 0;
        let errorCount = 0;

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const lastHyphenIndex = line.lastIndexOf('-');
                if (lastHyphenIndex === -1) {
                    errorCount++;
                    continue;
                }

                const ign = line.substring(0, lastHyphenIndex).trim();
                const phone = line.substring(lastHyphenIndex + 1).trim();

                // 2. നിലവിലുള്ള ലിസ്റ്റിൽ ഈ ഫോൺ നമ്പർ ഉണ്ടോ എന്ന് നോക്കുന്നു
                const exists = currentSlots.find(p => p.phone === phone);

                if (ign && phone && !exists) {
                    addBulkPlayer(ign, phone); 
                    successCount++;
                } else {
                    errorCount++; // ഓൾറെഡി ഉള്ളവരെ ആഡ് ചെയ്യുന്നില്ല
                }
            } catch (e) {
                errorCount++;
            }
        }

        await interaction.editReply({ 
            content: `✅ Successfully added **${successCount}** new players!\n❌ Skipped/Failed: **${errorCount}**` 
        });
    }
};