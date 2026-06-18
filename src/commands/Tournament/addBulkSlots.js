import { addPlayerToSlot } from '../../utils/slotManager.js';

export default {
    name: 'bulk_add_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const list = interaction.fields.getTextInputValue('players_list');
        const lines = list.split('\n');
        let count = 0;

        for (const line of lines) {
            const [ign, phone] = line.split('-').map(s => s.trim());
            if (ign && phone) {
                // സ്ലോട്ട് ആഡ് ചെയ്യുന്നു
                const assignedSlot = addPlayerToSlot('ManualPlayer', `manual_${Date.now()}_${count}`, ign, phone);
                
                // പ്ലെയറിന് DM അയക്കാൻ ശ്രമിക്കുന്നു 
                // ശ്രദ്ധിക്കുക: manual entry ആയതുകൊണ്ട് Discord ID കിട്ടാൻ ബുദ്ധിമുട്ടാണ്. 
                // എന്നാൽ, നീ സ്ലോട്ട് ലിസ്റ്റിൽ ഇവരെ കാണുന്നതുകൊണ്ട്, സ്ലോട്ട് ലിസ്റ്റ് ചാനലിൽ 
                // എല്ലാവർക്കും കാണാൻ പറ്റുന്ന രീതിയിൽ ഒരു മെസ്സേജ് ഇടുന്നതാണ് നല്ലത്.
                
                count++;
            }
        }

        await interaction.editReply({ content: `✅ Successfully added **${count}** players! All slots have been updated in the Slot List channel.` });
    }
};