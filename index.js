const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const bdquestions = require(path.join(__dirname, 'questions'))
const bdanswers = require(path.join(__dirname, 'answers'))
const app = express();

/*
//webpack
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
app.use(webpackDevMiddleware(webpack(config)));
*/
//app
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
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
    gameBegin: true, //poner en falso cuando pueda arreglar la base de datos
    totalTime: 36*60*60*1000, //milisegundos, aqui son 36 horas de juego
    pasoTiempo: 3000, //aumentar el tiempo al final
    gameRest: 0, 
    gameEnd: false,
    juegoId: 0,
    liberarDetalle: true, //ver si el administrador lo libera hasta el final
    totpreg: bdquestions.length,
    numUsers: 0,
    estadisticas: [],
    userAdmin: 'admin',
    passAdmin: '1234',
    usuarios: {
    }
}

//quitar cuando arregle base de datos o cambiar 
iniciarCuestionario({user: estadoJuego.userAdmin, pass: estadoJuego.passAdmin});


//inicializo las estadisticas en cero
for(let i = 0; i < estadoJuego.totpreg; i++){
    estadoJuego.estadisticas[i] = 0;
}

io.on('connection', socket => {
    console.log('socket connected: ', socket.id);
    socket.emit('estadoJuego', estadoActualJuego());
    socket.on('newUser', user =>{
        newUser(user, socket);
    });
    socket.on('deleteUser', user => {
        deleteUser(user);
    });
    socket.on('checkUser', user => {
        checkUser(user, socket);
    })
    socket.on('iniciarCuestionario', user =>{
        iniciarCuestionario(user);
    })
    socket.on('liberarDetalle', user => {
        user['user'] = user['user'].toLowerCase();
        if(user['user'].toLowerCase() == estadoJuego.userAdmin && user['pass'] == estadoJuego.passAdmin){
            estadoJuego.liberarDetalle = true;
            io.sockets.emit('allQuestion', bdquestions);
            io.sockets.emit('adminCorrectAns', bdanswers);
            io.sockets.emit('estadoJuego', estadoActualJuego());
        }
    })
    socket.on('reboot', user => {
        reiniciarJuego(user);
    })
    socket.on('termine', data => {
        terminoUsuario(data, socket);
    })
    socket.on('adminEstado', user => {
        if(user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
            socket.emit('usuarios', estadoJuego.usuarios);
        }
    })
})//finaliza socket

function estadoActualJuego(){
    return {
        gameBegin: estadoJuego.gameBegin,
        gameRest: estadoJuego.gameRest,
        gameEnd: estadoJuego.gameEnd,
        liberarDetalle: estadoJuego.liberarDetalle,
        totpreg: estadoJuego.totpreg,
        numUsers: estadoJuego.numUsers,
        estadisticas: estadoJuego.estadisticas,
    }
}

function newUser(user, socket) {
    user['user'] = user['user'].toLowerCase();
        if(user.hasOwnProperty('user') && user.hasOwnProperty('pass') && user['user'] !== '' && user['pass'] !== ''){
            var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
            if(!ok){
                //administrador
                if(user['user'] == estadoJuego.userAdmin){
                    if(estadoJuego.passAdmin === user['pass']){
                        socket.emit('ImAdmin', estadoJuego.passAdmin);
                        agregarUsuario(user, socket);
                    }else{
                        socket.emit('userNotValid', {error: "Usuario reservado al administrador, contraseña incorrecta"});
                    }
                }else if(!estadoJuego.gameEnd){
                    agregarUsuario(user, socket);
                }else{
                    socket.emit('userNotValid', {error: "El tiempo para registrarse y realizar el examen se ha terminado"});
                }
            }else {
                checkUser(user, socket);
            }
        }
}

function agregarUsuario(user, socket){
    estadoJuego.usuarios[user['user']] = {};
    estadoJuego.usuarios[user['user']]['pass'] = user['pass'];
    estadoJuego.usuarios[user['user']]['id'] = socket.id;
    estadoJuego.usuarios[user['user']]['respuestas'] = [];
    estadoJuego.usuarios[user['user']]['puntajePP'] = [];
    estadoJuego.usuarios[user['user']]['puntajeTotalUser'] = 0;
    estadoJuego.usuarios[user['user']]['termino'] = false;
    estadoJuego.numUsers++;
    io.sockets.emit('estadoJuego', estadoActualJuego());
    socket.emit('misResultados', estadoJuego.usuarios[user['user']]);
    socket.emit('allQuestion', bdquestions);
}

function checkUser(user, socket) {
    user['user'] = user['user'].toLowerCase();
    if(user.hasOwnProperty('user') && user.hasOwnProperty('pass') && user['user'] !== '' && user['pass'] !== ''){
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
                    if(estadoJuego.liberarDetalle){
                        socket.emit('adminCorrectAns', bdanswers);
                    }
                }
                socket.emit('misResultados', estadoJuego.usuarios[user['user']]);
                socket.emit('allQuestion', bdquestions);
                io.sockets.emit('estadoJuego', estadoActualJuego());
                return;
            }else{
                socket.emit('userNotValid', {error: "Contraseña incorrecta"});
            }
        }else{
            socket.emit('userNotValid', {error: "El usuario no existe"});
        }
    }
}

function deleteUser(user) {
    user['user'] = user['user'].toLowerCase();
        var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
        if (ok) {
            if(estadoJuego.usuarios[user['user']]['pass'] == user['pass']) {
                delete estadoJuego.usuarios[user['user']];
                estadoJuego.numUsers--;
            }
        }
}

function iniciarCuestionario(user) {
    console.log(user)
    user['user'] = user['user'].toLowerCase();
    var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
    if (ok && user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
        console.log("inicie cuestionario")
        estadoJuego.gameBegin= true;
        estadoJuego.gameRest= estadoJuego.totalTime;
        estadoJuego.juegoId= setInterval(juegoPreguntas, estadoJuego.pasoTiempo);
    }
}

function juegoPreguntas() {
    if(estadoJuego.gameRest > estadoJuego.pasoTiempo){
        estadoJuego.gameRest-=estadoJuego.pasoTiempo;
    }else{
        limpiarJuego();
    }
    io.sockets.emit('estadoJuego', estadoActualJuego());
}

function limpiarJuego() {
    clearInterval(estadoJuego.juegoId);
    console.log("Se terminó el tiempo del juego");
    estadoJuego.juegoId = 0;
    estadoJuego.gameBegin= false;
    estadoJuego.gameRest=estadoJuego.totalTime;
    estadoJuego.gameEnd= true;
}

function reiniciarJuego() {
    clearInterval(estadoJuego.juegoId);
    io.sockets.emit('reboot', '');
    console.log("Reinicie Juego");
    estadoJuego.juegoId = 0;
    estadoJuego.gameBegin= false;
    estadoJuego.gameRest=estadoJuego.totalTime;
    estadoJuego.gameEnd= false;
    estadoJuego.estadisticas = [];
    for(let i = 0; i < estadoJuego.totpreg; i++){
        estadoJuego.estadisticas[i] = 0;
    }
    Object.keys(estadoJuego.usuarios).map((key, idx)=>{
        estadoJuego.usuarios[key]['respuestas'] = [];
        estadoJuego.usuarios[key]['puntajePP'] = [];
        estadoJuego.usuarios[key]['puntajeTotalUser'] = 0;
        estadoJuego.usuarios[key]['termino'] = false;
    });
}

function terminoUsuario(data, socket){
    const user = data.usuario;
    const resultados = data.res;
    user['user'] = user['user'].toLowerCase();
    var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
    if(ok && estadoJuego.usuarios[user['user']]['pass'] == user['pass']) {
        estadoJuego.usuarios[user['user']].termino=true;
        //calificar las respuestas

        for(let i = 0; i < estadoJuego.totpreg; i++){
            if(resultados[i] != undefined){
                if(resultados[i].hasOwnProperty('opt')){
                    if(bdanswers[i] == resultados[i].opt){
                        estadoJuego.usuarios[user['user']]['puntajePP'][i] = 1;
                        estadoJuego.usuarios[user['user']]['puntajeTotalUser']++;
                        estadoJuego.estadisticas[i]++;
                    }else{
                        estadoJuego.usuarios[user['user']]['puntajePP'][i] = 0;
                    }
                }else{
                    estadoJuego.usuarios[user['user']]['puntajePP'][i] = 0;
                }
            }else{
                estadoJuego.usuarios[user['user']]['puntajePP'][i] = 0;
            }
        }
        //Agregar sus respuestas a su estadoJuego
        estadoJuego.usuarios[user['user']]['respuestas'] = resultados;
        //regresarle su resultado
        socket.emit('misResultados', estadoJuego.usuarios[user['user']]);
        socket.emit('adminCorrectAns', bdanswers);
        //si es el administrador enviarle todas las respuestas hasta el momento
        if(user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
            socket.emit('usuarios', estadoJuego.usuarios);
        }
    }
}