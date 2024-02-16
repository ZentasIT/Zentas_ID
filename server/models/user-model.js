const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    refreshToken: { type: String },
    tempCode: { type: String }, // Добавляем поле для временного кода
    firstName: { type: String, required: true, minlength: 3 },
    lastName: { type: String, required: true, minlength: 3 },
    middleName: { type: String, required: true, minlength: 3 }
});

module.exports = model('User', UserSchema);
