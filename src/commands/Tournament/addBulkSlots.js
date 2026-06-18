import { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { addPlayerToSlot } from '../../utils/slotManager.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('Add Bulk Slots')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        // റൈറ്റ് ക്ലിക്ക് ചെയ്ത മെസ്സേജിലെ ടെക്സ്റ്റ് എടുക്കുന്നു
        const content = interaction.targetMessage.content;
        const lines = content.split('\n');
        let successCount = 0;

        for (const line of lines) {
            if (!line.includes('-')) continue;
            
            const lastHyphenIndex = line.lastIndexOf('-');
            const ign = line.substring(0, lastHyphenIndex).trim();
            const phone = line.substring(lastHyphenIndex + 1).trim();

            if (ign && phone) {
                addPlayerToSlot('ManualPlayer', `manual_${Date.now()}_${successCount}`, ign, phone);
                successCount++;
            }
        }

        await interaction.editReply({ content: `✅ Successfully added **${successCount}** players from this message!` });
    }
};