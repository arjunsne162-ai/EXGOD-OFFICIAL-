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
                content: `<@${user.id}> ✅ **Details saved!**\n\n📸 **Action Required:Please upload your required **Screenshots** here.

**1 ] Follow The Below Given Instagram Page  And Upload Screenshot Here As Proof : **https://www.instagram.com/simplebrandpromotors/?utm_source=ig_web_button_share_sheet

**2 ] Subscribe The Below Given Youtube Channel  And Upload Screenshot Here As Proof :**
https://youtube.com/@gamerblack-yt?si=gi1W903yEDU3cCBp 

**3] Open this link to join my WhatsApp Group:**
 https://chat.whatsapp.com/KchuW8Qn925EVnLHkw7h1P?s=sh&p=i&ilr=0

Staff will **approve** your registration after verifying the images.`, 
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