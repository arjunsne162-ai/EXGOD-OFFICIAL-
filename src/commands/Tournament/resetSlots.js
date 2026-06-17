import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { clearAllSlots } from '../../utils/slotManager.js'; // Importing the clear function
import { tournamentConfig } from '../../config/tournamentConfig.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reset-slots')
        .setDescription('Clear all registered slots and reset the slot list.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Only staff can use this
        
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {
            // 1. Clear the slots database
            clearAllSlots();

            // 2. Update the slot list message in the channel to show it's empty
            const slotChannelId = tournamentConfig.slotListChannelId;
            if (slotChannelId) {
                const slotChannel = interaction.guild.channels.cache.get(slotChannelId);
                if (slotChannel) {
                    const slotEmbed = new EmbedBuilder()
                        .setTitle('🏆 eFootball Tournament - Slot List 🏆')
                        .setDescription('No players approved yet. The slot list has been reset.')
                        .setColor('#FFD700');

                    // Find the old message and edit it
                    const messages = await slotChannel.messages.fetch({ limit: 10 });
                    const oldMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title.includes('Slot List'));

                    if (oldMessage) {
                        await oldMessage.edit({ embeds: [slotEmbed] });
                    } else {
                        await slotChannel.send({ embeds: [slotEmbed] });
                    }
                }
            }

            // 3. Send success message to the staff
            await interaction.editReply({ content: '✅ Successfully reset all slots! The list is now empty.' });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Error resetting slots.' });
        }
    }
};