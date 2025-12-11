const Shift = require('../models/Shift');

const getDateTime = (dateStr, timeStr) => new Date(`${dateStr}T${timeStr}`);

const createShift = async (req, res) => {
    const { userId, date, startTime, endTime } = req.body;

    const start = getDateTime(date, startTime);
    const end = getDateTime(date, endTime);

    const duration = (end - start) / (1000 * 60 * 60); 
    if (duration < 4) {
        return res.status(400).json({ message: 'Shift must be at least 4 hours.' });
    }
    if (end <= start) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }

    const existingShifts = await Shift.find({ userId, date });
    
    const isOverlapping = existingShifts.some(shift => {
        const sStart = getDateTime(shift.date, shift.startTime);
        const sEnd = getDateTime(shift.date, shift.endTime);
        return start < sEnd && end > sStart;
    });

    if (isOverlapping) {
        return res.status(400).json({ message: 'Shift overlaps with an existing shift.' });
    }

    const shift = await Shift.create({ userId, date, startTime, endTime });
    res.status(201).json(shift);
};

const getShifts = async (req, res) => {
    if (req.user.role === 'user') {
        const shifts = await Shift.find({ userId: req.user._id }).populate('userId', 'name employeeCode');
        return res.json(shifts);
    } 
    
    const { employee, date } = req.query;
    
    let query = {};
    if (employee) {
        query.userId = employee; 
    }
    if (date) {
        query.date = date; 
    }

    const shifts = await Shift.find(query).populate('userId', 'name employeeCode department');
    res.json(shifts);
};

const deleteShift = async (req, res) => {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    
    await shift.deleteOne();
    res.json({ message: 'Shift removed' });
};

module.exports = { createShift, getShifts, deleteShift };