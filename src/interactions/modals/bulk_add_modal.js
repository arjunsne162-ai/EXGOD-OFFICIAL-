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
            if (!line.trim()) continue;

            try {
                // വരിയുടെ അവസാനത്തെ ഹൈഫൻ കണ്ടെത്തുന്നു (അതുകൊണ്ട് പേരിൽ underscore വന്നാലും പ്രശ്നമില്ല)
                const lastHyphenIndex = line.lastIndexOf('-');
                if (lastHyphenIndex === -1) {
                    errorCount++;
                    continue;
                }

                const ign = line.substring(0, lastHyphenIndex).trim();
                const phone = line.substring(lastHyphenIndex + 1).trim();

                if (ign && phone) {
                    // സ്ലോട്ട് ആഡ് ചെയ്യുന്നു
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