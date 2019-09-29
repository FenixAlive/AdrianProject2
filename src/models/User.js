const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    user: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
    respuestas: {
        type: Array,
        required: true
    },
    puntajePP: {
        type: Array,
        required: true
    },
    puntajeTotalUser: {
        type: Number,
        default: 0,
        required: true
    }, 
    termino: { 
        type: Boolean,
        default: false,
        required:true
    }
})

module.exports = model('User', userSchema);