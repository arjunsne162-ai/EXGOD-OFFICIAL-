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
                // ഇവിടെ നമുക്ക് കൃത്യമായ Discord ID ഇല്ലാത്തതുകൊണ്ട് 
                // IGN നെ തന്നെ ID ആയി ഉപയോഗിക്കുന്നു
                addPlayerToSlot('ManualPlayer', `manual_${Date.now()}_${count}`, ign, phone);
                count++;
            }
        }

        await interaction.editReply({ content: `✅ Successfully added **${count}** players to slots!` });
    }
};