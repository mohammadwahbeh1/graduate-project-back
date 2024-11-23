const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Terminal = require('./Terminal');
const User = require('./User');

const Line = sequelize.define('Line', {
    line_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    line_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    terminal_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Terminal,
            key: 'terminal_id'
        }
    },
    line_manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    current_vehicles_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Lines',
    timestamps: false
});

Line.belongsTo(User, { foreignKey: 'line_manager_id', as: 'lineManager' });

module.exports = Line;
