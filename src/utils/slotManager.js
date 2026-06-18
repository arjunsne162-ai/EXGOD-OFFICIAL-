import fs from 'fs';
const slotsFilePath = './slots.json';

import fs from 'fs';
import path from 'path';

// 4-ാം വരി മുതൽ 14-ാം വരി വരെ ഈ കോഡ് പേസ്റ്റ് ചെയ്യുക:
export const getAllSlots = () => {
    const absolutePath = path.resolve('./slots.json');
    if (!fs.existsSync(absolutePath)) {
        console.log("❌ File not found at:", absolutePath);
        return [];
    }
    const rawData = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(rawData);
    console.log("✅ Current Data in JSON:", data);
    return data;
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