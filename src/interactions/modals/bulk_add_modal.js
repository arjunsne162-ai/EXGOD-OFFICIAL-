import { addBulkPlayer } from '../../utils/slotManager.js'; // 1. പുതിയ ഫംഗ്‌ഷൻ ഇംപോർട്ട് ചെയ്യുന്നു

export default {
    name: 'bulk_add_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const list = interaction.fields.getTextInputValue('players_list');
        const lines = list.split('\n');
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

                if (ign && phone) {
                    // 2. പഴയ addPlayerToSlot മാറ്റി, പുതിയ addBulkPlayer ഉപയോഗിക്കുന്നു
                    addBulkPlayer(ign, phone); 
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