import { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { addPlayerToSlot } from '../../utils/slotManager.js';

export default {
    data: new ContextMenuCommandBuilder()
        .setName('Add Bulk Slots')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        // ബോട്ടിന് മറുപടി തരാൻ കൂടുതൽ സമയം നൽകുന്നു
        await interaction.deferReply({ ephemeral: true });
        
        const content = interaction.targetMessage.content;
        const lines = content.split('\n');
        let successCount = 0;

        for (const line of lines) {
            if (!line.includes('-')) continue;
            
            const lastHyphenIndex = line.lastIndexOf('-');
            const ign = line.substring(0, lastHyphenIndex).trim();
            const phone = line.substring(lastHyphenIndex + 1).trim();

            if (ign && phone) {
                // ലൂപ്പിനുള്ളിൽ ഡാറ്റ ആഡ് ചെയ്യുന്നു
                addPlayerToSlot('ManualPlayer', `manual_${Date.now()}_${successCount}`, ign, phone);
                successCount++;
            }
        }

        // ഫൈനൽ മറുപടി
        await interaction.editReply({ content: `✅ Successfully added **${successCount}** players!` });
    }
};