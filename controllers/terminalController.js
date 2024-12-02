// controllers/terminalController.js

const { Op } = require('sequelize');
const Line = require('../models/Line');
const Vehicle = require('../models/Vehicle');
const Terminal = require('../models/Terminal');
const User = require('../models/User');
const sequelize = require('../db');

module.exports.getAllTerminals = async (req, res) => {
    try {
        const terminals = await Terminal.findAll();

        res.status(200).json({
            status: 'success',
            results: terminals.length,
            data: terminals
        });

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching terminals: ${err.message}`
        });
    }
};

module.exports.getATerminal = async (req, res) => {
    try {
        const terminal = await Terminal.findOne({
            where: {
                terminal_id: req.params.id
            }
        });
        if (terminal) {
            res.status(200).json({
                status: 'success',
                data: terminal
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Terminal not found'
            });
        }

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching terminal: ${err.message}`
        });
    }
};

module.exports.getLinesByTerminal = async (req, res) => {
    try {
        const lines = await Line.findAll({
            where: {
                terminal_id: req.params.id
            },
            attributes: ['line_name', 'last_updated', 'current_vehicles_count']
        });

        res.status(200).json({
            status: 'success',
            results: lines.length,
            data: lines
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching lines for terminal: ${error.message}`
        });
    }
};

module.exports.getAllTerminalsManager = async (req, res) => {
    try {
        const lineManagers = await User.findAll({
            where: {
                role: 'line_manager'
            },
            attributes: ['username', 'phone_number']
        });

        if (lineManagers.length > 0) {
            res.status(200).json({
                status: 'success',
                results: lineManagers.length,
                data: lineManagers
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'No line managers found'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: `Error fetching line managers: ${error.message}`
        });
    }
};

exports.createTerminal = async (req, res) => {
    try {
        const { terminal_name, latitude, longitude, total_vehicles, user_id } = req.body;

        const newTerminal = await Terminal.create({
            terminal_name,
            latitude,
            longitude,
            total_vehicles,
            user_id,
        });

        res.status(201).json({ success: true, data: newTerminal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create terminal', error: error.message });
    }
};

exports.updateTerminal = async (req, res) => {
    try {
        const { id } = req.params;
        const { terminal_name, latitude, longitude, total_vehicles, user_id } = req.body;

        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ success: false, message: 'Terminal not found' });
        }

        const updatedTerminal = await terminal.update({
            terminal_name,
            latitude,
            longitude,
            total_vehicles,
            user_id,
        });

        res.status(200).json({ success: true, data: updatedTerminal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update terminal', error: error.message });
    }
};

// Delete a terminal
exports.deleteTerminal = async (req, res) => {
    try {
        const { id } = req.params;

        const terminal = await Terminal.findByPk(id);
        if (!terminal) {
            return res.status(404).json({ success: false, message: 'Terminal not found' });
        }

        await terminal.destroy();
        res.status(200).json({ success: true, message: 'Terminal deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete terminal', error: error.message });
    }
};
