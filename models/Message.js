const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Message = sequelize.define('Message', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_image: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'Messages',
    timestamps: true,
});

// Associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' });

module.exports = Message;
