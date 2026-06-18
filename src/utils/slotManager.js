import fs from 'fs';
const slotsFilePath = './slots.json';

export const getAllSlots = () => {
    if (!fs.existsSync(slotsFilePath)) return [];
    const rawData = fs.readFileSync(slotsFilePath);
    return JSON.parse(rawData);
};

export const addBulkPlayer = (ign, phone) => {
    const slots = getAllSlots();
    // രണ്ടിനെയും String ആക്കി മാറ്റി സ്പേസ് കളഞ്ഞു ചെക്ക് ചെയ്യുന്നു
    const cleanPhone = String(phone).trim();
    if (slots.find(p => String(p.phone).trim() === cleanPhone)) return;
    
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