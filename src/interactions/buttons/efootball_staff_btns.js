import { EmbedBuilder } from 'discord.js';
import { tournamentConfig } from '../../config/tournamentConfig.js';
import { addPlayerToSlot, getAllSlots } from '../../utils/slotManager.js'; 

export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply({ ephemeral: true }); // ephemeral: true ആക്കിയാൽ ബാക്കിയുള്ളവർക്ക് ഈ എറർ കാണില്ല
            
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                // ചാനൽ പേരിൽ നിന്ന് username എടുക്കുന്നു
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                // Embed-ൽ നിന്ന് ഡാറ്റ എടുക്കാൻ ശ്രമിക്കുന്നു (ഇവിടെ ഒരു സേഫ്റ്റി ചെക്ക് കൂടെ ചേർക്കുന്നു)
                const embed = interaction.message.embeds[0];
                if (!embed) return interaction.editReply({ content: '❌ Error: Could not find registration data.' });

                const gameName = embed.fields.find(f => f.name === 'IGN')?.value || 'N/A';
                const phone = embed.fields.find(f => f.name === 'Phone')?.value || 'N/A';

                if (targetMember) {
                    const roleId = tournamentConfig.tournamentRoleId; 
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role).catch(console.error);

                    // Slot മാനേജർ ഉപയോഗിക്കുന്നു
                    const assignedSlot = addPlayerToSlot(targetMember.user.username, targetMember.id, gameName, phone);

                    await targetMember.send(`✅ Your registration is approved!\n🎫 **Slot:** ${assignedSlot}`).catch(() => {});

                    // സ്ലോട്ട് ലിസ്റ്റ് അപ്ഡേറ്റ് ചെയ്യുന്നു
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

                await interaction.channel.delete().catch(console.error);
                await interaction.editReply({ content: '✅ Approved successfully!' });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error approving registration. Check console.' });
            }
        }
    },
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