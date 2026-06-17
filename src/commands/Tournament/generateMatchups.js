import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getAllSlots } from '../../utils/slotManager.js'; 

export default {
    data: new SlashCommandBuilder()
        .setName('generate-matchups')
        .setDescription('Randomly generate matches (Slot vs Slot) from approved players.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), 
        
    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const slots = getAllSlots();

            if (slots.length < 2) {
                return interaction.editReply({ content: '❌ Not enough players approved to generate matchups.' });
            }

            const shuffled = [...slots].sort(() => Math.random() - 0.5);
            const matches = [];
            
            for (let i = 0; i < shuffled.length; i += 2) {
                if (i + 1 < shuffled.length) {
                    const p1 = shuffled[i];
                    const p2 = shuffled[i + 1];
                    // Required Format: slot 1 arjun phone number 738733998877 vs slot 2 smars phone number 7766556788
                    matches.push(`🥊 **${p1.slot}** ${p1.gameName} Phone: ${p1.phone}  🆚  **${p2.slot}** ${p2.gameName} Phone: ${p2.phone}`);
                } else {
                    const p1 = shuffled[i];
                    matches.push(`🎁 **${p1.slot}** ${p1.gameName} Phone: ${p1.phone}  🆚  **[BYE - Advances to next round]**`);
                }
            }

            const matchEmbed = new EmbedBuilder()
                .setTitle('🏆 Random Matchups Generated 🏆')
                .setDescription(matches.join('\n\n'))
                .setColor('#FF4500')
                .setFooter({ text: 'Good luck to all players!' });

            await interaction.editReply({ embeds: [matchEmbed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Error generating matchups.' });
        }
    }
};