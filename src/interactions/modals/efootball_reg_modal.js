import { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';

export default {
    name: 'efootball_reg_modal',
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const gameName = interaction.fields.getTextInputValue('game_name');
        const phone = interaction.fields.getTextInputValue('phone_number');
        const { guild, user } = interaction;

        try {
            const regChannel = await guild.channels.create({
                name: `reg-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
                ],
            });

            const formEmbed = new EmbedBuilder()
                .setTitle(`📝 Registration: ${user.username}`)
                .setDescription('**Player Details Saved!**')
                .addFields(
                    { name: 'IGN', value: gameName, inline: true },
                    { name: 'Phone', value: phone, inline: true }
                )
                .setColor('#0099ff');

            const staffButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('efootball_approve_reg').setLabel('Approve').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('efootball_reject_reg').setLabel('Reject').setStyle(ButtonStyle.Danger)
            );

            await regChannel.send({ 
                content: `<@${user.id}> ✅ **Details saved!**\n\n📸 **Action Required:** Please upload your required **Screenshots** here. Staff will approve your registration after verifying the images.`, 
                embeds: [formEmbed], 
                components: [staffButtons] 
            });

            await interaction.editReply({ content: `✅ Details submitted! Please go to your channel to upload screenshots: ${regChannel}` });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Error processing your registration.' });
        }
    }
};