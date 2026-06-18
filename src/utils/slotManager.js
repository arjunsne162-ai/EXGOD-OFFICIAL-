import fs from 'fs';
import path from 'path';

const slotsFilePath = './slots.json';

export const getAllSlots = () => {
    try {
        if (!fs.existsSync(slotsFilePath)) {
            fs.writeFileSync(slotsFilePath, JSON.stringify([]));
            return [];
        }
        const rawData = fs.readFileSync(slotsFilePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("❌ Error reading slots.json:", error);
        return [];
    }
};

export const addBulkPlayer = (ign, phone) => {
    const slots = getAllSlots();
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
    const cleanPhone = String(phone).trim();
    const player = slots.find(p => String(p.phone).trim() === cleanPhone);
    
    if (player) {
        player.status = status;
        fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
    }
};