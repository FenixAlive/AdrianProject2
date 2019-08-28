const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//importar base de datos
const bdquestions = require(path.join(__dirname, 'questions'))
const bdanswers = require(path.join(__dirname, 'answers'))

const app = express();

//webpack
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
app.use(webpackDevMiddleware(webpack(config)));

//app
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev')); //quitar en producción o ver documentación
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
io = socketIo(server);

//inicia servidor
server.listen(app.get('port'), ()=>{
    console.log("Server Running", app.get('port'));
})

//game
var userAdmin = 'admin';
var passAdmin = '1234';
var gameBegin = false;
var vgameOver = false;
var juegoId = 0;
var ttime = 10; //cambiar a 60
var qtime = ttime;
var numPreg = 0;
const totpreg = bdquestions.length;
var users = [];
var respuestas = {};
var respuestasOk = {};

//socket
io.on('connection', socket => {
    console.log('socket connected: ', socket.id);
    socket.emit('myId', socket.id);
    socket.on('beginGame', data => {
        if (data['user'] == userAdmin && data['pass'] == passAdmin) {
            console.log("let's the games begin");
            gameBegin = true;
            io.sockets.emit('beginGame', gameBegin);
            //ir emitiendo las preguntas
            juegoId = setInterval(juegoPreguntas, 1000);
        }else {
            socket.emit('beginGame', gameBegin);
        }
    });
    socket.on('amIAdmin', user => {
        if(user['user'] == userAdmin && user['pass'] == passAdmin){
            socket.emit('ImAdmin', '');
        }
    });
    socket.on('reboot', data => {
        if (data['user'] == userAdmin && data['pass'] == passAdmin) {
            limpiarJuego();
        }
    });
    socket.on('rebootGameOver', () => {
        limpiarJuego();
    });
    socket.on('isGameBegin', () => {
        socket.emit('beginGame', gameBegin);
    });
    socket.on('isGameOver', () => {
        if(vgameOver){
            io.sockets.emit('gameOver', '');
        }
    });
    socket.on('answer', answer => {
        console.log('Answer: ', answer)
        if ( !respuestas.hasOwnProperty(answer['id']) ) {
            respuestas[answer['id']] = {};
            respuestasOk[answer['id']] = [];
        }
        respuestas[answer['id']][answer['q']]=answer['ans'];
        checkAnswer(answer)
        console.log('respOk: ', respuestasOk)
    });
    socket.on('newUser', user =>{
        if(user.hasOwnProperty('user') && user.hasOwnProperty('pass') && user['user'] !== '' && user['pass'] !== ''){
            var ok = users.indexOf(user);
            if(ok === -1){
                //administrador
                if(user['user'].toLowerCase() == userAdmin && user['pass'] == passAdmin){
                    users.push(user);
                    respuestas[user['user']] = {};
                    respuestasOk[user['user']] = [];
                    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
                    socket.emit('ImAdmin', '');
                }else if (user['user'].toLowerCase() == userAdmin){
                    console.log("contra incorr")
                    socket.emit('userNotValid', '');
                }else {
                    users.push(user);
                    respuestas[user['user']] = {};
                    respuestasOk[user['user']] = [];
                    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
                }
            }else{
                socket.emit('userNotValid', '');
            }
        }
    });
    socket.on('deleteUser', user => {
        var i = users.indexOf(user);
        if (i !== -1) {
            users.splice(i , 1);
            delete respuestas[user['user']];
            delete respuestasOk[user['user']];
            io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
        }

    });
})

//funciones adicionales para juego

function checkAnswer(answer) {
    var isequal = answer['q'] - respuestasOk[answer['id']].length;
    if (isequal !== 0) {
        for(let i = 0; i < isequal; i++){
            respuestasOk[answer['id']].push(0);
        }
    }
    if (answer['ans'] === bdanswers[answer['q']]){
        respuestasOk[answer['id']].push(1);
    }
    else {
        respuestasOk[answer['id']].push(0);
    }
}
function checkCompleteAns(npregActual){
    for(var key in respuestasOk){
        let isequal = npregActual - respuestasOk[key].length;
        if (isequal !== 0) {
            for(let i = 0; i < isequal; i++){
                respuestasOk[key].push(0);
            }
        }
    }
    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
}

function juegoPreguntas(){
    if(qtime == ttime){
        //emitir pregunta a frontend
        var question = {
            nq: numPreg,
            ...bdquestions[numPreg]
        }
        io.sockets.emit('question', question)
        checkCompleteAns(numPreg);
    }
    io.sockets.emit('time', qtime);
    if(--qtime == 0){
        qtime = ttime;
        numPreg++;
    }
    if (numPreg >= totpreg) {
        checkCompleteAns(numPreg);
        gameOver();
        return;
    }
    
}

function gameOver(){
    clearInterval(juegoId);
    vgameOver = true;
    io.sockets.emit('gameOver', '');
    console.log(respuestas);
    console.log(respuestasOk);
}

function limpiarJuego(){
    clearInterval(juegoId);
    gameBegin = false;
    vgameOver = false;
    juegoId = 0;
    numPreg = 0;
    qtime = ttime;
    users = [];
    respuestas = {};
    respuestasOk = {};
    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
    io.sockets.emit('reboot', '');
}