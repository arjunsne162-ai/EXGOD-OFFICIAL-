import fs from 'fs';
import path from 'path';

// Path to store the slots data
const slotsFilePath = path.resolve('./slots.json');

// Function to initialize the file if it doesn't exist
const initSlotsFile = () => {
    if (!fs.existsSync(slotsFilePath)) {
        fs.writeFileSync(slotsFilePath, JSON.stringify([]));
    }
};

// Function to add a new approved player and assign a slot
export const addPlayerToSlot = (username, userId) => {
    initSlotsFile();
    
    // Read existing data
    const rawData = fs.readFileSync(slotsFilePath);
    const slots = JSON.parse(rawData);

    // Check if player is already registered
    const existingPlayer = slots.find(player => player.userId === userId);
    if (existingPlayer) return existingPlayer.slot;

    // Assign new slot number (e.g., Slot 001)
    const newSlotNumber = slots.length + 1;
    const formattedSlot = `Slot ${String(newSlotNumber).padStart(3, '0')}`;

    // Save player data
    const newPlayer = {
        slot: formattedSlot,
        username: username,
        userId: userId,
        approvedAt: new Date().toISOString()
    };

    slots.push(newPlayer);
    fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 4));

    return formattedSlot;
};

// Function to get all registered players
export const getAllSlots = () => {
    initSlotsFile();
    const rawData = fs.readFileSync(slotsFilePath);
    return JSON.parse(rawData);
};