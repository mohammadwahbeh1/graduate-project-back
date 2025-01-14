
const User = require('../models/User');
const Messages= require('../models/Message');
const { sequelize } = require('../db');
const { Op } = require('sequelize');



exports.getMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [
        { model: User, as: 'sender', attributes: ['user_id', 'username'] },
        { model: User, as: 'receiver', attributes: ['user_id', 'username'] },
      ],
      order: [['timestamp', 'DESC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
exports.getMessageById = async (req, res) => {
  try {
    const supporterId = req.user.id;
    const userId = req.params.userId;

    const messages = await Messages.findAll({
      include: [
        { 
          model: User, 
          as: 'sender', 
          attributes: ['user_id', 'username'] 
        }
      ],
      where: {
        [Op.or]: [
          {
            sender_id: supporterId,
            receiver_id: userId
          },
          {
            sender_id: userId,
            receiver_id: supporterId
          }
        ]
      },
      order: [['timestamp', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports.postMessages = async(req,res)=>{
  try {
    const { receiverId, content, isImage = false } = req.body;
    const senderId = req.user.id;
    
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, is_image, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING 
        message_id,
        sender_id,
        receiver_id,
        content,
        is_image,
        timestamp,
        is_read
    `;
    
    const result = await pool.query(query, [senderId, receiverId, content, isImage]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Messages.findOne({
      where: {
        message_id: messageId,
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }

    await message.destroy();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};


