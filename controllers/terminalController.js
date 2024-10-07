// controllers/terminalController.js

const { Op } = require('sequelize');
const Line = require('../models/Line'); // نموذج اللاين
const Vehicle = require('../models/Vehicle'); // نموذج الفيلكلز
const sequelize = require('../db');

