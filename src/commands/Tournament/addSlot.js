import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addPlayerToSlot } from '../../utils/slotManager.js';

export default {
    data: new SlashCommandBuilder()
        .setName('add-slot')
        .setDescription('Manually add a player to a slot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addUserOption(option => option.setName('user').setDescription('The player').setRequired(true))
        .addStringOption(option => option.setName('ign').setDescription('In-Game Name').setRequired(true))
        .addStringOption(option => option.setName('phone').setDescription('Phone Number').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const ign = interaction.options.getString('ign');
        const phone = interaction.options.getString('phone');

        // Slot മാനേജർ ഉപയോഗിച്ച് ആഡ് ചെയ്യുന്നു
        const slot = addPlayerToSlot(user.username, user.id, ign, phone);

        await interaction.reply({ content: `✅ Successfully added **${user.username}** to **${slot}** (IGN: ${ign}, Phone: ${phone}).`, ephemeral: true });
    }
};