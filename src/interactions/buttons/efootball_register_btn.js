import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { tournamentConfig } from '../../config/tournamentConfig.js'; // Importing the config file

export default [
    {
        name: 'efootball_register_btn',
        async execute(interaction, client) {
            await interaction.deferReply({ ephemeral: true });

            const { guild, user } = interaction;

            try {
                // 1. Create Private Channel
                const regChannel = await guild.channels.create({
                    name: `reg-${user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel, 
                                PermissionFlagsBits.SendMessages, 
                                PermissionFlagsBits.AttachFiles
                            ],
                        },
                    ],
                });

                // 2. Get the message from config and replace {user} with user mention
                const formMessage = tournamentConfig.messages.registrationForm.replace('{user}', `<@${user.id}>`);

                const formEmbed = new EmbedBuilder()
                    .setTitle(`📝 Registration: ${user.username}`)
                    .setDescription(formMessage) // Uses the config message here
                    .setColor('#0099ff');

                // 3. Staff Buttons
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

                // 4. Send Message to the new channel
                await regChannel.send({ 
                    content: `<@${user.id}>`, 
                    embeds: [formEmbed], 
                    components: [staffButtons] 
                });

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