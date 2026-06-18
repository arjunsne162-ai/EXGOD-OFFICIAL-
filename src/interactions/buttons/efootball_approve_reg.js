import { getAllSlots, updatePlayerStatus } from '../../utils/slotManager.js';

export default {
    name: 'efootball_approve_reg',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = interaction.message.embeds[0];
        if (!embed) return interaction.editReply({ content: '❌ No embed found!' });

        // ലോഗ് ചെയ്ത് നോക്കാം ഫീൽഡുകൾ എന്തൊക്കെയാണെന്ന്
        console.log("Fields found:", embed.fields.map(f => f.name));

        // കൃത്യമായ ഫീൽഡ് നെയിം വെച്ച് തിരയുന്നു (കേസ് സെൻസിറ്റീവ് അല്ലാതാക്കി)
        const phoneField = embed.fields.find(f => f.name.toLowerCase() === 'phone');
        const phone = phoneField ? phoneField.value : null;

        if (!phone) {
            return interaction.editReply({ content: '❌ Error: Phone field not found in embed. Check the field name.' });
        }

        const allSlots = getAllSlots();
        const player = allSlots.find(p => p.phone === phone);

        if (!player) {
            return interaction.editReply({ content: `❌ Player with phone ${phone} not found in database!` });
        }

        updatePlayerStatus(phone, 'approved');
        await interaction.editReply({ content: `✅ Registration for **${player.gameName}** is approved!` });
    }
};