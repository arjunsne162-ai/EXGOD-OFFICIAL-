import { EmbedBuilder } from 'discord.js';
import { tournamentConfig } from '../../config/tournamentConfig.js';
import { addPlayerToSlot, getAllSlots } from '../../utils/slotManager.js'; 

export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            // ആദ്യം ഒരു മറുപടി അയക്കുന്നു (Interaction Failed ഒഴിവാക്കാൻ)
            await interaction.reply({ content: '✅ Approving registration, please wait...', ephemeral: true });
            
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                const embed = interaction.message.embeds[0];
                if (!embed) return interaction.editReply({ content: '❌ Error: Could not find registration data.' });

                const gameName = embed.fields.find(f => f.name === 'IGN')?.value || 'N/A';
                const phone = embed.fields.find(f => f.name === 'Phone')?.value || 'N/A';

                if (targetMember) {
                    const roleId = tournamentConfig.tournamentRoleId; 
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role).catch(console.error);

                    const assignedSlot = addPlayerToSlot(targetMember.user.username, targetMember.id, gameName, phone);
                    await targetMember.send(`✅ Your registration is approved!\n🎫 **Slot:** ${assignedSlot}`).catch(() => {});

                    const slotChannel = interaction.guild.channels.cache.get(tournamentConfig.slotListChannelId);
                    if (slotChannel) {
                        const allSlots = getAllSlots();
                        const slotText = allSlots.map(p => `**${p.slot}** : ${p.gameName} (Phone: ${p.phone})`).join('\n');
                        
                        const slotEmbed = new EmbedBuilder()
                            .setTitle('🏆 eFootball Tournament - Slot List 🏆')
                            .setDescription(slotText || 'No players approved yet.')
                            .setColor('#FFD700');

                        const messages = await slotChannel.messages.fetch({ limit: 10 });
                        const oldMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title.includes('Slot List'));

                        if (oldMessage) await oldMessage.edit({ embeds: [slotEmbed] });
                        else await slotChannel.send({ embeds: [slotEmbed] });
                    }
                }

                // ചാനൽ ഡിലീറ്റ് ചെയ്യുന്നു
                await interaction.channel.delete().catch(console.error);
                // ഫൈനൽ മെസ്സേജ്
                await interaction.editReply({ content: '✅ Approved successfully!' });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error approving registration.' });
            }
        }
    },
    {
        name: 'efootball_reject_reg',
        async execute(interaction, client) {
            await interaction.reply({ content: '❌ Rejecting...', ephemeral: true });
            
            if (!interaction.member.permissions.has('ManageChannels')) return interaction.editReply({ content: '❌ No permission!' });

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) await targetMember.send(tournamentConfig.messages.rejectedDM).catch(() => {});
                await interaction.channel.delete();
                await interaction.editReply({ content: '✅ Rejected successfully!' });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];