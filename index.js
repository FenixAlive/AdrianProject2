const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sockete = require(path.join(__dirname, 'sockete'))
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

//socket

//variables de estado
var estadoJuego = {
    gameBegin: false,
    totalTime: 3, //segundos
    gameInitial: 0,
    gameRest: 0,
    gameEnd: false,
    juegoId: 0,
    liberarDetalle: false,
    totpreg: bdquestions.length,
    numUsers: 1,
    estadisticas: [],
    userAdmin: 'admin',
    passAdmin: '1234',
    usuarios: {
    }
}
io.on('connection', socket => {
    console.log('socket connected: ', socket.id);
    socket.on('newUser', user =>{
        user['user'] = user['user'].toLowerCase();
        if(user.hasOwnProperty('user') && user.hasOwnProperty('pass') && user['user'] !== '' && user['pass'] !== ''){
            var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
            if(!ok){
                //administrador
                if(user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
                    agregarUsuario(user, socket.id);
                    socket.emit('ImAdmin', '');
                }else if (user['user'] == userAdmin){
                    console.log("contra incorrecta admin")
                    socket.emit('userNotValid', '');
                }else {
                    agregarUsuario(user, socket.id);
                }
            }else{
                checkUser(user, socket);
            }
        }
    });
    socket.on('deleteUser', user => {
        user['user'] = user['user'].toLowerCase();
        var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
        if (ok) {
            if(estadoJuego.usuarios[user['user']]['pass'] == user['pass']) {
                delete estadoJuego.usuarios[user['user']]
            }
        }
    });
    socket.on('checkUser', user => {
        checkUser(user, socket);
    })
    socket.on('iniciarCuestionario', user =>{
        user['user'] = user['user'].toLowerCase();
        var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
        if (ok && user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
            //inicializar contador, set tiempo de inicio e ir revisando cada 10 segundos hasta que se termine el tiempo
        }
    })
    //socket.on contestePregunta, ver si hay tiempo para registrar su respuesta, registrar y regresarle actualizado su estado
})//finaliza socket

function agregarUsuario(user, id){
    estadoJuego.usuarios[user['user']] = {};
    estadoJuego.usuarios[user['user']]['pass'] = user['pass'];
    estadoJuego.usuarios[user['user']]['id'] = id;
    estadoJuego.usuarios[user['user']]['respuestas'] = {};
    estadoJuego.usuarios[user['user']]['puntajePP'] = [];
    estadoJuego.usuarios[user['user']]['puntajeTotalUser'] = [];
    estadoJuego.usuarios[user['user']]['termino'] = false;
    //enviarle al usuario el estado actual del juego
}

function checkUser(user, socket) {
    user['user'] = user['user'].toLowerCase();
    var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
        if (ok) {
            if(estadoJuego.usuarios[user['user']]['pass'] == user['pass']) {
                //si es el administrador
                if(user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
                    socket.emit('ImAdmin', '');
                    socket.emit('usuarios', estadoJuego.usuarios);
                    socket.emit('adminCorrectAns', bdanswers);
                    //cambiar como se reciben las passwords en el front y los resultados ahora todo va en usuarios
                }else{
                    if(liberarDetalle){
                        socket.emit('adminCorrectAns', bdanswers);
                    }
                    socket.emit('misResultados', estadoJuego.usuarios[user['user']]);
                }
                socket.emit('allQuestion', bdquestions);
                socket.emit('estadisticas', estadoJuego.estadisticas);
                socket.emit('detalleLiberado', estadoJuego.liberarDetalle)
            }else{
                socket.emit('userNotValid', '');
            }
        }else{
            socket.emit('userNotValid', '');
        }
}
