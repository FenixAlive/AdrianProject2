const {Schema, model} = require('mongoose');

const estadoJuegoSchema = new Schema({
    gameBegin: {
        type: Boolean,
        default: false,
        required: true
    }, 
    timeBegin: {
        type: Number,
        default: new Date(2019, 09, 05).getTime(),
        required: true
    },
    gameRest: {
        type: Number,
        default: 0,
        required: true
    }, 
    gameEnd: { 
        type: Boolean,
        default: false,
        required:true
    },
    liberarDetalle: {
        type: Boolean,
        default: true,
        required: true
    },
    estadisticas: {
        type: Array,
        required: true,
    },
})

module.exports = model('estadoJuego', estadoJuegoSchema);