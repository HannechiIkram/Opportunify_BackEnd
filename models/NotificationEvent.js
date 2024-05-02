const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationEventSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'ProfileJobSeeker',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationEvent = mongoose.model('NotificationEvent', notificationEventSchema);

module.exports = NotificationEvent;
