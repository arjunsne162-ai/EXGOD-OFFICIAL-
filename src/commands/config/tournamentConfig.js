export const tournamentConfig = {
    // 1. Roles & Settings
    tournamentRoleId: '1489190117666197534', // ⚠️ Replace with actual Role ID
    slotListChannelId: '1496862419568558192',

    // 2. Social Media & Sponsor Links (Easily changeable)
    links: {
        mainInstagram: 'https://instagram.com/your_page',
        partnerInstagram: 'https://instagram.com/partner_page',
        youtubeChannel: 'https://youtube.com/your_channel'
    },

    // 3. Custom Messages (Can be changed anytime without touching main code)
    messages: {
        panelDescription: '🏆 Welcome to the official eFootball Tournament! 🏆\n\n**To register, please follow our social media pages and click the button below.**\nA private channel will be created for you to submit your details.',
        
        registrationForm: 'Welcome {user}!\n\nPlease send the following details here:\n\n**1. In-Game Name (IGN)**\n**2. eFootball Owner ID**\n**3. WhatsApp Number**\n**4. Upload Screenshots** (Instagram & YouTube)\n\nOur staff will review and approve your registration shortly.',
        
        approvedDM: '🎉 Congratulations! Your registration for the eFootball Tournament has been **Approved**.',
        
        rejectedDM: '❌ Sorry, your registration for the eFootball Tournament has been **Rejected**. Please verify your details and screenshots.'
    }
};