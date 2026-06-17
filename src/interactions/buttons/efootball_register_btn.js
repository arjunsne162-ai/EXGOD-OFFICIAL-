import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default [
    {
        name: 'efootball_register_btn', // customId എന്നത് മാറ്റി name ആക്കി!
        async execute(interaction, client) {
            // Loading ആവുന്ന സമയത്ത് bot crash ആവാതിരിക്കാൻ
            await interaction.deferReply({ ephemeral: true });

            const { guild, user } = interaction;

            try {
                // 1. പ്രൈവറ്റ് ചാനൽ ക്രിയേറ്റ് ചെയ്യുന്നു
                const regChannel = await guild.channels.create({
                    name: `reg-${user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel], // മറ്റാർക്കും കാണാൻ പറ്റില്ല
                        },
                        {
                            id: user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel, 
                                PermissionFlagsBits.SendMessages, 
                                PermissionFlagsBits.AttachFiles // സ്ക്രീൻഷോട്ട് ഇടാൻ
                            ],
                        },
                    ],
                });

                // 2. പുതിയ ചാനലിലേക്ക് അയക്കാനുള്ള മെസ്സേജ്
                const formEmbed = new EmbedBuilder()
                    .setTitle(`📝 Registration: ${user.username}`)
                    .setDescription(`Welcome <@${user.id}>!\n\nതാഴെ പറയുന്ന കാര്യങ്ങൾ ഇവിടെ മെസ്സേജ് ആയി അയക്കുക:\n\n**1. In-Game Name (IGN)**\n**2. eFootball Owner ID**\n**3. WhatsApp Number**\n**4. Upload Screenshots** (Instagram & YouTube)\n\nഡീറ്റെയിൽസ് എല്ലാം കൊടുത്തതിന് ശേഷം സ്റ്റാഫ് വെരിഫൈ ചെയ്ത് നിങ്ങളെ അപ്രൂവ് ചെയ്യുന്നതാണ്.`)
                    .setColor('#0099ff');

                // 3. സ്റ്റാഫിന് അപ്രൂവ്/റിജക്ട് ചെയ്യാനുള്ള ബട്ടണുകൾ
                const staffButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('efootball_approve_reg')
                        .setLabel('Approve')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('efootball_reject_reg')
                        .setLabel('Reject')
                        .setStyle(ButtonStyle.Danger)
                );

                // 4. മെസ്സേജ് ചാനലിലേക്ക് സെൻഡ് ചെയ്യുന്നു
                await regChannel.send({ 
                    content: `<@${user.id}>`, 
                    embeds: [formEmbed], 
                    components: [staffButtons] 
                });

                // 5. പ്ലെയർക്ക് ചാനൽ ലിങ്ക് റിപ്ലൈ ആയി കൊടുക്കുന്നു
                await interaction.editReply({ 
                    content: `✅ Your registration channel has been created: ${regChannel}` 
                });

            } catch (error) {
                console.error(error);
                await interaction.editReply({ 
                    content: '❌ Error creating your channel. Please check my permissions.' 
                });
            }
        }
    }
];