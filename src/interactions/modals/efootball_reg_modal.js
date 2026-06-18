import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { addPlayer } from '../../utils/slotManager.js';

export default {
    name: 'efootball_reg_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // നിന്റെ ഫോമിൽ നിന്നുള്ള ഡാറ്റ എടുക്കുന്നു
        const gameName = interaction.fields.getTextInputValue('game_name');
        const phone = interaction.fields.getTextInputValue('phone_number');
        const userId = interaction.user.id;

        try {
            // 1. പ്രൈവറ്റ് ചാനൽ ക്രിയേറ്റ് ചെയ്യുന്നു
            const regChannel = await interaction.guild.channels.create({
                name: `reg-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: userId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                    },
                ],
            });

            // 2. പ്ലെയറുടെ ഡാറ്റ സേവ് ചെയ്യുന്നു
            const success = addPlayer(gameName, phone, userId);
            
            if (!success) {
                return interaction.editReply({ content: '❌ You have already registered for this tournament!' });
            }

            // 3. അപ്രൂവ് / റിജക്ട് ബട്ടണുകൾ ഉണ്ടാക്കുന്നു
            const staffButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('efootball_approve_reg').setLabel('Approve').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('efootball_reject_reg').setLabel('Reject').setStyle(ButtonStyle.Danger)
            );

            // 4. എംബഡ് ഉണ്ടാക്കുന്നു
            const formEmbed = new EmbedBuilder()
                .setTitle('Registration Details Saved!')
                .setColor('#00ff00')
                .addFields(
                    { name: 'IGN', value: gameName, inline: true },
                    { name: 'Phone', value: phone, inline: true }
                );

            // 5. പുതിയ ചാനലിലേക്ക് മെസ്സേജ് അയക്കുന്നു
            await regChannel.send({
                content: `<@${userId}> ✅ **Details saved!**\n\n📸 **Action Required:** Please upload your required Screenshots here.

1 ] Follow The Below Given Instagram Page  And Upload Screenshot Here As Proof : https://www.instagram.com/simplebrandpromotors/?utm_source=ig_web_button_share_sheet

2 ] Subscribe The Below Given Youtube Channel  And Upload Screenshot Here As Proof : https://youtube.com/@gamerblack-yt?si=gi1W903yEDU3cCBp 

3 ] Join The Below Given Whatsapp Group And Upload Screenshot Here As Proof : https://chat.whatsapp.com/KchuW8Qn925EVnLHkw7h1P?s=sh&p=i&ilr=0

Staff will approve your registration after verifying the images.`,
                embeds: [formEmbed],
                components: [staffButtons]
            });

            // 6. റിപ്ലൈ കൊടുക്കുന്നു
            await interaction.editReply({ content: `✅ Details submitted! Please go to your channel to upload screenshots: <#${regChannel.id}>` });

        } catch (error) {
            console.error("❌ Registration Modal Error:", error);
            await interaction.editReply({ content: '❌ Error processing your registration.' });
        }
    }
};