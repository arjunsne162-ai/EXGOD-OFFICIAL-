export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            // 1. Check if the user is staff (Only those with Manage Channels permission)
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ You do not have permission to approve this!' });
            }

            try {
                // Find the player from the channel name (eg: reg-arjun)
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // 2. Assign the tournament role to the player
                    const roleId = '1489190117666197534'; // ⚠️ Insert your tournament role ID here!
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role);

                    // 3. Send a DM to the player
                    await targetMember.send(`🎉 Congratulations! Your registration for the eFootball Tournament has been **Approved**.`).catch(() => {});
                }

                // 4. Delete the registration channel
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
                // Find the player from the channel name
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // Send rejection notification via DM
                    await targetMember.send(`❌ Sorry, your registration for the eFootball Tournament has been **Rejected**. Please double-check if your screenshots and provided details are correct.`).catch(() => {});
                }

                // Delete the registration channel
                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];