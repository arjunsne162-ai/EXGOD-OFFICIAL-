import { 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    ChannelType, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder 
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('efootball-registration')
        .setDescription('Manages the eFootball tournament registration system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Sets up the tournament registration panel in a specified channel.')
                .addChannelOption(option =>
                    option.setName('panel_channel')
                        .setDescription('The channel where the registration panel will be sent.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        // Checking if the setup command was used
        if (interaction.options.getSubcommand() === 'setup') {
            const targetChannel = interaction.options.getChannel('panel_channel');

            // 1. Create the Registration Embed
            const registrationEmbed = new EmbedBuilder()
                .setTitle('🏆 eFootball Tournament Registration 🏆')
                .setDescription('Welcome to the official eFootball Tournament!\n\n**To register, please click the button below.**\nA private channel will be created for you to submit your details and screenshots.')
                .setColor('#FFD700') // Gold Color
                .setFooter({ text: 'Powered by ExGoD eSports' });

            // 2. Create the Register Button
            const registerButton = new ButtonBuilder()
                .setCustomId('efootball_register_btn') // This ID is important for the next step!
                .setLabel('Register Now')
                .setEmoji('📝')
                .setStyle(ButtonStyle.Success);

            const actionRow = new ActionRowBuilder().addComponents(registerButton);

            try {
                // 3. Send the panel to the selected channel
                await targetChannel.send({ embeds: [registrationEmbed], components: [actionRow] });

                // 4. Acknowledge the command privately to the admin
                await interaction.reply({ 
                    content: `✅ Registration panel has been successfully set up in ${targetChannel}!`, 
                    ephemeral: true 
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: '❌ There was an error sending the panel to that channel. Please check my permissions.', 
                    ephemeral: true 
                });
            }
        }
    }
};