import { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import { getAllSlots } from '../../utils/slotManager.js'; // ഇത് കൂടെ ആഡ് ചെയ്യുക

export default {
    name: 'efootball_reg_modal',
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { guild, user } = interaction;
        
        // 1. ഒരാൾ ഓൾറെഡി രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടോ എന്ന് ചെക്ക് ചെയ്യുന്നു
        const allSlots = getAllSlots();
        const existingPlayer = allSlots.find(p => p.userId === user.id);
        
        if (existingPlayer) {
            return interaction.editReply({ content: '❌ You have already registered for this tournament!' });
        }

        const gameName = interaction.fields.getTextInputValue('game_name');
        const phone = interaction.fields.getTextInputValue('phone_number');

        try {
            // 2. ചാനൽ ക്രിയേറ്റ് ചെയ്യുന്നു (ബാക്കി കോഡ് പഴയത് പോലെ)
            const regChannel = await guild.channels.create({
                name: `reg-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
                ],
            });

            // ... (ബാക്കി കോഡ് പഴയത് പോലെ തന്നെ - Embed ഉം Buttons ഉം)
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
                content: `<@${user.id}> ✅ **Details saved!**\n\n📸 **Action Required:** Please upload your required **Screenshots** here.

1 ] Follow The Below Given Instagram Page  And Upload Screenshot Here As Proof : https://www.instagram.com/simplebrandpromotors/?utm_source=ig_web_button_share_sheet

2 ] Subscribe The Below Given Youtube Channel  And Upload Screenshot Here As Proof : https://youtube.com/@gamerblack-yt?si=gi1W903yEDU3cCBp 

3 ] Join The Below Given Whatsapp Group And Upload Screenshot Here As Proof : https://chat.whatsapp.com/KchuW8Qn925EVnLHkw7h1P?s=sh&p=i&ilr=0

Staff will approve your **registration** after verifying the images.`, 
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