const path = require('path');
//importar base de datos
const bdquestions = require(path.join(__dirname, 'questions'))
const bdanswers = require(path.join(__dirname, 'answers'))

//game
var userAdmin = 'admin';
var passAdmin = '1234';
var gameBegin = false;
var vgameOver = false;
var juegoId = 0;
var ttime = 1; //cambiar a 60
var qtime = ttime;
var numPreg = 0;
var liberarDetalle = false;
const totpreg = bdquestions.length;
var users = {};
var respuestas = {};
var respuestasOk = {};


var socketes = function (io, socket) {
    console.log('socket connected: ', socket.id);
    socket.emit('myId', socket.id);
    socket.on('beginGame', user => {
        user['user'] = user['user'].toLowerCase();
        if (user['user'] == userAdmin && user['pass'] == passAdmin) {
            console.log("let's the games begin");
            gameBegin = true;
            io.sockets.emit('beginGame', gameBegin);
            //ir emitiendo las preguntas
            juegoId = setInterval(function(){juegoPreguntas(io)}, 1000);
        }else {
            socket.emit('beginGame', gameBegin);
        }
    });
    socket.on('amIAdmin', user => {
        user['user'] = user['user'].toLowerCase();
        if(user['user'] == userAdmin && user['pass'] == passAdmin){
            socket.emit('ImAdmin', '');
        }
    });
    socket.on('reboot', user => {
        user['user'] = user['user'].toLowerCase();
        if (user['user'] == userAdmin && user['pass'] == passAdmin) {
            limpiarJuego(io);
        }
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
        answer['id'] = answer['id'].toLowerCase();
        if ( !respuestas.hasOwnProperty(answer['id']) ) {
            respuestas[answer['id']] = {};
            respuestasOk[answer['id']] = [];
        }
        respuestas[answer['id']][answer['q']]=answer['ans'];
        checkAnswer(answer)
        console.log('respOk: ', respuestasOk)
    });
    socket.on('newUser', user =>{
        user['user'] = user['user'].toLowerCase();
        if(user.hasOwnProperty('user') && user.hasOwnProperty('pass') && user['user'] !== '' && user['pass'] !== ''){
            var ok = users.hasOwnProperty(user['user']);
            if(!ok){
                //administrador
                if(user['user'] == userAdmin && user['pass'] == passAdmin){
                    users[user['user']] = user['pass'];
                    respuestas[user['user']] = {};
                    respuestasOk[user['user']] = [];
                    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
                    socket.emit('ImAdmin', '');
                }else if (user['user'] == userAdmin){
                    console.log("contra incorrecta admin")
                    socket.emit('userNotValid', '');
                }else {
                    users[user['user']] = user['pass'];
                    respuestas[user['user']] = {};
                    respuestasOk[user['user']] = [];
                    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
                }
            }else{
                checkUser(user, socket);
            }
        }
    });
    socket.on('deleteUser', user => {
        user['user'] = user['user'].toLowerCase();
        var ok = users.hasOwnProperty(user['user']);
        if (ok) {
            if(users[user['user']] == user['pass']) {
                delete users[user['user']]
                delete respuestas[user['user']];
                delete respuestasOk[user['user']];
                io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
            }
        }
    });
    socket.on('checkUser', user => {
        checkUser(user, socket);
    })
    socket.on("whichQuestion", ()=>{
        var question = emitQuestion();
        io.sockets.emit('question', question)
    })
    socket.on('liberarDetalle', user => {
        user['user'] = user['user'].toLowerCase();
        if(user['user'].toLowerCase() == userAdmin && user['pass'] == passAdmin){
            liberarDetalle = true;
            io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
            io.sockets.emit('allQuestion', bdquestions);
            io.sockets.emit('adminCorrectAns', bdanswers);
            io.sockets.emit('detalleLiberado', liberarDetalle)
        }
    })

}


//funciones adicionales para juego

function checkUser(user, socket) {
    user['user'] = user['user'].toLowerCase();
    var ok = users.hasOwnProperty(user['user']);
        if (ok) {
            if(users[user['user']] == user['pass']) {
                if(user['user'].toLowerCase() == userAdmin && user['pass'] == passAdmin){
                    socket.emit('ImAdmin', '');
                    socket.emit('allQuestion', bdquestions);
                    //socket.emit('resultados', {ans: respuestas, res: respuestasOk});
                    socket.emit('adminCorrectAns', bdanswers);
                    socket.emit('passwords', users);
                    if(liberarDetalle){
                        socket.emit('detalleLiberado', liberarDetalle);
                    }
                }//cambiar adminCorrectAns para que solo admin vea respuestas hasta que las libere
                else{
                    //para poder implementar resultados personales debo cambiar las estadisticas
                    //socket.emit('resultados', {ans: respuestas[user['user']], res: respuestasOk[user['user']]});
                    if(liberarDetalle){
                        socket.emit('adminCorrectAns', bdanswers);
                    }
                }
                socket.emit('allQuestion', bdquestions);
                socket.emit('resultados', {ans: respuestas, res: respuestasOk});
                socket.emit('detalleLiberado', liberarDetalle)
            }else{
                socket.emit('userNotValid', '');
            }
        }else{
            socket.emit('userNotValid', '');
        }
}

function checkAnswer(answer) {
    var isequal = answer['q'] - respuestasOk[answer['id']].length;
    if (isequal !== 0) {
        //si se envio información doble
        if(isequal < 0) {
            return;
        }
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

function checkCompleteAns(io, npregActual){
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

function juegoPreguntas(io){
    if(qtime == ttime){
        var question = emitQuestion();
        io.sockets.emit('question', question)
        checkCompleteAns(io, numPreg);
    }
    io.sockets.emit('time', qtime);
    if(--qtime == 0){
        qtime = ttime;
        numPreg++;
    }
    if (numPreg >= totpreg) {
        checkCompleteAns(io, numPreg);
        gameOver(io);
        return;
    }
    
}

function emitQuestion(){
    //emitir pregunta a frontend
    var question = {
        nq: numPreg,
        ...bdquestions[numPreg]
    }
    return question;
}

function gameOver(io){
    clearInterval(juegoId);
    vgameOver = true;
    io.sockets.emit('gameOver', '');
    console.log(respuestas);
    console.log(respuestasOk);
}

function limpiarJuego(io){
    clearInterval(juegoId);
    gameBegin = false;
    vgameOver = false;
    juegoId = 0;
    numPreg = 0;
    qtime = ttime;
    users = {};
    respuestas = {};
    respuestasOk = {};
    io.sockets.emit('reboot', '');
    io.sockets.emit('resultados', {ans: respuestas, res: respuestasOk});
}

module.exports = socketes;