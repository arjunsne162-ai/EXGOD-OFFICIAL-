import { EmbedBuilder } from 'discord.js';
import { tournamentConfig } from '../../config/tournamentConfig.js';
import { addPlayerToSlot, getAllSlots } from '../../utils/slotManager.js'; 

export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                // Extract Details from Embed
                const embed = interaction.message.embeds[0];
                const gameName = embed.fields.find(f => f.name === 'IGN')?.value || 'Unknown';
                const phone = embed.fields.find(f => f.name === 'Phone')?.value || 'Unknown';

                if (targetMember) {
                    const roleId = tournamentConfig.tournamentRoleId; 
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role);

                    // Save with IGN and Phone
                    const assignedSlot = addPlayerToSlot(targetMember.user.username, targetMember.id, gameName, phone);

                    const dmMessage = `${tournamentConfig.messages.approvedDM}\n\n🎫 **Your Assigned Slot:** ${assignedSlot}`;
                    await targetMember.send(dmMessage).catch(() => {});

                    const slotChannelId = tournamentConfig.slotListChannelId;
                    if (slotChannelId) {
                        const slotChannel = interaction.guild.channels.cache.get(slotChannelId);
                        if (slotChannel) {
                            const allSlots = getAllSlots();
                            const slotText = allSlots.map(p => `**${p.slot}** : ${p.gameName} (Phone: ${p.phone})`).join('\n');
                            
                            const slotEmbed = new EmbedBuilder()
                                .setTitle('🏆 eFootball Tournament - Slot List 🏆')
                                .setDescription(slotText || 'No players approved yet.')
                                .setColor('#FFD700');

                            const messages = await slotChannel.messages.fetch({ limit: 10 });
                            const oldMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title.includes('Slot List'));

                            if (oldMessage) {
                                await oldMessage.edit({ embeds: [slotEmbed] });
                            } else {
                                await slotChannel.send({ embeds: [slotEmbed] });
                            }
                        }
                    }
                }

                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error approving registration.' });
            }
        }
    },
    {
        name: 'efootball_reject_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            if (!interaction.member.permissions.has('ManageChannels')) return interaction.editReply({ content: '❌ No permission!' });

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) await targetMember.send(tournamentConfig.messages.rejectedDM).catch(() => {});
                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];