import { tournamentConfig } from '../../config/tournamentConfig.js'; // Importing the config file

export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            // Check if the user is staff (Manage Channels permission)
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                // Find the player from the channel name
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // 1. Fetch Role ID from config and assign it
                    const roleId = tournamentConfig.tournamentRoleId; 
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role);

                    // 2. Send Approved DM from config
                    await targetMember.send(tournamentConfig.messages.approvedDM).catch(() => {});
                }

                // Delete the channel
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
            
            // Check if the user is staff
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to reject this!' });
            }

            try {
                // Find the player
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // Send Rejected DM from config
                    await targetMember.send(tournamentConfig.messages.rejectedDM).catch(() => {});
                }

                // Delete the channel
                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];