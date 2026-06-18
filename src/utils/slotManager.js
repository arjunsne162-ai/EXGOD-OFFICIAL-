import fs from 'fs';
const slotsFilePath = './slots.json';

export const getAllSlots = () => {
    if (!fs.existsSync(slotsFilePath)) {
        fs.writeFileSync(slotsFilePath, JSON.stringify([]));
        return [];
    }
    return JSON.parse(fs.readFileSync(slotsFilePath, 'utf8'));
};

export const addPlayer = (ign, phone, userId) => {
    const slots = getAllSlots();
    const cleanPhone = String(phone).trim();
    if (slots.find(p => String(p.phone).trim() === cleanPhone)) return false;
    
    slots.push({
        id: cleanPhone,
        gameName: ign,
        phone: cleanPhone,
        userId: userId,
        status: 'pending'
    });
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
    return true;
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