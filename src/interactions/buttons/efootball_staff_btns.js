import { tournamentConfig } from '../../config/tournamentConfig.js';
import { addPlayerToSlot } from '../../utils/slotManager.js'; // Importing the slot manager

export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            // Check if the user is staff
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                // Find the player
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // 1. Assign Role
                    const roleId = tournamentConfig.tournamentRoleId; 
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role);

                    // 2. Save player to database and get Slot Number
                    const assignedSlot = addPlayerToSlot(targetMember.user.username, targetMember.id);

                    // 3. Send Approved DM with Slot Number
                    const dmMessage = `${tournamentConfig.messages.approvedDM}\n\n🎫 **Your Assigned Slot:** ${assignedSlot}`;
                    await targetMember.send(dmMessage).catch(() => {});
                }

                // Delete channel
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
            
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to reject this!' });
            }

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    await targetMember.send(tournamentConfig.messages.rejectedDM).catch(() => {});
                }

                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];