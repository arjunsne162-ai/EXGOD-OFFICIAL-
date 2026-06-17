export default [
    {
        name: 'efootball_approve_reg',
        async execute(interaction, client) {
            await interaction.deferReply();
            
            // 1. സ്റ്റാഫ് ആണോ എന്ന് ചെക്ക് ചെയ്യാൻ (Manage Channels പെർമിഷൻ ഉള്ളവർക്ക് മാത്രം)
            if (!interaction.member.permissions.has('ManageChannels')) {
                return interaction.editReply({ content: '❌ ഇത് അപ്രൂവ് ചെയ്യാൻ നിങ്ങൾക്ക് പെർമിഷൻ ഇല്ല!' });
            }

            try {
                // ചാനലിന്റെ പേരിൽ നിന്നും പ്ലെയറെ കണ്ടുപിടിക്കുന്നു (eg: reg-arjun)
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // 2. പ്ലെയർക്ക് ടൂർണമെന്റ് റോൾ കൊടുക്കുന്നു
                    const roleId = '1489190117666197534'; // ⚠️ നിന്റെ ടൂർണമെന്റ് റോളിന്റെ ID ഇവിടെ കൊടുക്കണം!
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) await targetMember.roles.add(role);

                    // 3. പ്ലെയർക്ക് DM അയക്കുന്നു
                    await targetMember.send(`🎉 Congratulations! Your registration for the eFootball Tournament has been **Approved**.`).catch(() => {});
                }

                // 4. രജിസ്ട്രേഷൻ ചാനൽ ഡിലീറ്റ് ചെയ്യുന്നു
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
                return interaction.editReply({ content: '❌ ഇത് റിജക്ട് ചെയ്യാൻ നിങ്ങൾക്ക് പെർമിഷൻ ഇല്ല!' });
            }

            try {
                const targetUsername = interaction.channel.name.replace('reg-', '');
                await interaction.guild.members.fetch();
                const targetMember = interaction.guild.members.cache.find(m => m.user.username === targetUsername);

                if (targetMember) {
                    // റിജക്ട് ആയ വിവരം DM ആയി അയക്കുന്നു
                    await targetMember.send(`❌ Sorry, your registration for the eFootball Tournament has been **Rejected**. സ്ക്രീൻഷോട്ടും കാര്യങ്ങളും കറക്റ്റ് ആണോ എന്ന് ഒന്നൂടെ ചെക്ക് ചെയ്യുക.`).catch(() => {});
                }

                // ചാനൽ ഡിലീറ്റ് ചെയ്യുന്നു
                await interaction.channel.delete();

            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: '❌ Error rejecting registration.' });
            }
        }
    }
];