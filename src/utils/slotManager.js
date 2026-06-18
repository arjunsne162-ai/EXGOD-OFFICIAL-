import fs from 'fs';
const slotsFilePath = './slots.json'; // നിന്റെ ഫയൽ പാത്ത് ശരിയാണെന്ന് ഉറപ്പാക്കുക

export const getAllSlots = () => {
    if (!fs.existsSync(slotsFilePath)) return [];
    const rawData = fs.readFileSync(slotsFilePath);
    return JSON.parse(rawData);
};

export const addBulkPlayer = (ign, phone) => {
    const slots = getAllSlots();
    // ഒരേ ഫോൺ നമ്പർ ഉള്ളവരെ ആഡ് ചെയ്യാതിരിക്കാൻ
    if (slots.find(p => p.phone === phone)) return;
    
    slots.push({
        id: phone, 
        gameName: ign,
        phone: phone,
        status: 'approved'
    });
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
};

export const updatePlayerStatus = (phone, status) => {
    const slots = getAllSlots();
    const player = slots.find(p => p.phone === phone);
    if (player) {
        player.status = status;
        fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
    }
};