const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const ReminderSchema = new Schema({
        title: {type: 'string'},
        message: {type: 'string'},
        scheduledTime: {type: 'string'},
})

module.exports = moongoose.model('Reminder', ReminderSchema);