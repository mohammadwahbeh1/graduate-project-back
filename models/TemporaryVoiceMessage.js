const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Relation with User

const TemporaryVoiceMessage = sequelize.define('TemporaryVoiceMessage', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    voice_message_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Temporary_Voice_Messages',
    timestamps: false
});

module.exports = TemporaryVoiceMessage;
