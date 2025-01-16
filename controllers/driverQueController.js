const DriverQue = require('../models/DriverQue');
const moment = require("moment");
const axios = require('axios');


exports.createDriver = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            phone_number,
            date_of_birth,
            gender,
            address
        } = req.body;

        const license_image_path = req.file ? req.file.path : null;

        if (!username || !email || !password || !license_image_path) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const newDriver = await DriverQue.create({
            username,
            email,
            password,
            phone_number,
            date_of_birth,
            gender,
            address,
            license_image_path,
        });

        res.status(201).json(newDriver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await DriverQue.findAll();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





exports.deleteDriver = async (req, res) => {
    try {
        const driver = await DriverQue.findByPk(req.params.id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        await driver.destroy();
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.acceptDriver = async (req, res) => {
    try {
        const driver = await DriverQue.findByPk(req.params.id);

        if (!driver) {
            return res.status(404).json({ status: 'error', message: 'Driver not found in Driver_Que.' });
        }

        const driverData = {
            username: driver.username,
            email: driver.email,
            password: driver.password,
            phone_number: driver.phone_number,
            role: 'driver',
            date_of_birth: driver.date_of_birth,
            gender: driver.gender,
            address: driver.address,
            license_number: driver.license_number
        };

        const response = await axios.post('http://localhost:3000/api/v1/register', driverData);

        if (response.status === 201) {
            await driver.destroy();
            res.status(201).json({ status: 'success', message: 'Driver accepted and registered successfully.' });
        } else {
            res.status(400).json({ status: 'error', message: 'Error registering driver.' });
        }
    } catch (err) {
        console.error('Error accepting driver:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};