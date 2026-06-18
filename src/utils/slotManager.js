import fs from 'fs';
import path from 'path';

const slotsFilePath = path.resolve('./slots.json');

const initSlotsFile = () => {
    if (!fs.existsSync(slotsFilePath)) {
        fs.writeFileSync(slotsFilePath, JSON.stringify([]));
    }
};

export const addPlayerToSlot = (discordUsername, userId, gameName, phone) => {
    initSlotsFile();
    
    const rawData = fs.readFileSync(slotsFilePath);
    const slots = JSON.parse(rawData);

    const existingPlayer = slots.find(player => player.userId === userId);
    if (existingPlayer) return existingPlayer.slot;

    // Change format to Slot 1, Slot 2 etc.
    const newSlotNumber = slots.length + 1;
    const formattedSlot = `Slot ${newSlotNumber}`;

    const newPlayer = {
        slot: formattedSlot,
        discordUsername: discordUsername,
        userId: userId,
        gameName: gameName,
        phone: phone,
        approvedAt: new Date().toISOString()
    };

    slots.push(newPlayer);
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));

    return formattedSlot;
};

export const getAllSlots = () => {
    initSlotsFile();
    const rawData = fs.readFileSync(slotsFilePath);
    return JSON.parse(rawData);
};

export const clearAllSlots = () => {
    initSlotsFile();
    fs.writeFileSync(slotsFilePath, JSON.stringify([]));
};
// ഇതാണ് പുതിയ ഫംഗ്ഷൻ (ഇത് താഴെ ആഡ് ചെയ്യുക)
export const addBulkPlayer = (ign, phone) => {
    const slots = getAllSlots();
    const newPlayer = {
        discordUsername: "ManualAdd",
        userId: null,
        gameName: ign,
        phone: phone,
        status: 'approved' // ഇത് ഓട്ടോമാറ്റിക് അപ്രൂവ്ഡ് ആക്കും
    };
    slots.push(newPlayer);
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));
};