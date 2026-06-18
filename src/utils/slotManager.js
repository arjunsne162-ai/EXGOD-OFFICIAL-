import fs from 'fs';
const slotsFilePath = './slots.json';

import fs from 'fs';
import path from 'path';

// 4-ാം വരി മുതൽ 14-ാം വരി വരെ ഈ കോഡ് പേസ്റ്റ് ചെയ്യുക:
export const getAllSlots = () => {
    try {
        if (!fs.existsSync('./slots.json')) {
            console.log("⚠️ slots.json file missing! Creating new one...");
            fs.writeFileSync('./slots.json', JSON.stringify([]));
            return [];
        }
        const rawData = fs.readFileSync('./slots.json', 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("❌ Error reading slots.json:", error);
        return [];
    }
};
    
    slots.push({
        id: cleanPhone, 
        gameName: ign,
        phone: cleanPhone,
        status: 'approved'
    });
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
};

export const updatePlayerStatus = (phone, status) => {
    const slots = getAllSlots();
    // ഇവിടെയും String ആക്കി മാറ്റി ചെക്ക് ചെയ്യുന്നു
    const cleanPhone = String(phone).trim();
    const player = slots.find(p => String(p.phone).trim() === cleanPhone);
    
    if (player) {
        player.status = status;
        fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
    }
};