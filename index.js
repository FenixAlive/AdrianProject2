const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const bdquestions = require(path.join(__dirname, 'questions'))
const bdanswers = require(path.join(__dirname, 'answers'))
const app = express();
//mongoose
const mongoose = require('mongoose');
//modelos
const userModel = require('./src/models/User');
const estadoJuegoModel = require('./src/models/estadoJuego');

/*
//webpack
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
app.use(webpackDevMiddleware(webpack(config)));
*/

//conectar a base de datos
const contra = 'znkSIzCpN0nYMfSp';
const user = 'aifenix';
const uri = `mongodb+srv://${user}:${contra}@cluster0-zejxg.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("conectado a MongoDb")
});


//creo variables de estado
//variables de estado
var estadoJuego = {
    baseId: undefined,
    gameBegin: false, 
    //año, mes, dia - el mes comienza en 0
    timeBegin: new Date(2019, 09, 05).getTime(),
    totalTime: 36*60*60*1000, //milisegundos, aqui son 36 horas de juego
    pasoTiempo: 7000, //aumentar el tiempo al final
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
//inicializo las estadisticas en cero
for(let i = 0; i < estadoJuego.totpreg; i++){
    estadoJuego.estadisticas[i] = 0;
}

const estadoJuegoBd = async ()=> {
    if(!estadoJuego.baseId){
        var estado = await estadoJuegoModel.find();
        if(estado.length > 0){
            estadoJuego.baseId = estado[0]._id;
            estadoJuego.gameBegin = estado[0].gameBegin;
            estadoJuego.timeBegin = estado[0].timeBegin;
            estadoJuego.gameEnd = estado[0].gameEnd;
            estadoJuego.liberarDetalle = estado[0].liberarDetalle;
            estadoJuego.estadisticas = estado[0].estadisticas;
            estadoJuego.gameRest = tiempoRestante(estadoJuego.timeBegin);
        }else{
            estadoJuego.gameRest = tiempoRestante(estadoJuego.timeBegin);
            const nuevoEstado = new estadoJuegoModel({
                gameBegin: estadoJuego.gameBegin,
                timeBegin: estadoJuego.timeBegin,
                gameRest: estadoJuego.gameRest,
                gameEnd: estadoJuego.gameEnd,
                liberarDetalle: estadoJuego.liberarDetalle,
                estadisticas: estadoJuego.estadisticas,
            });
            estadoJuego.baseId = nuevoEstado._id
            nuevoEstado.save((err)=>{
                if(err){
                    console.log('error al guardar estado: ',err)
                }
            });
        }
        if(estadoJuego.gameBegin){
            estadoJuego.juegoId= setInterval(juegoPreguntas, estadoJuego.pasoTiempo);
        }
    }else{
        estadoJuego.gameRest = tiempoRestante(estadoJuego.timeBegin);
        //solo actualizo la base de datos
        const nuevoEstado = {
            gameBegin: estadoJuego.gameBegin,
            timeBegin: estadoJuego.timeBegin,
            gameRest: estadoJuego.gameRest,
            gameEnd: estadoJuego.gameEnd,
            liberarDetalle: estadoJuego.liberarDetalle,
            estadisticas: estadoJuego.estadisticas,
        };
        await estadoJuegoModel.findByIdAndUpdate(estadoJuego.baseId, nuevoEstado);
    }
}

estadoJuegoBd();

//base de datos usuario
//traer base de datos de usuario al estado (listar usuarios)
const listarUsuariosBd= async () => {
    var usuarios = await userModel.find();
    usuarios.map((val,idx)=>{
        estadoJuego.usuarios[val.user] = val;
    })
    estadoJuego.numUsers = usuarios.length;
};
//se corre al reiniciar el servidor
listarUsuariosBd();

//crear usuario bd
const crearUsuarioBd = async (userData) => {
    const nuevoUsuario = new userModel(userData);
    nuevoUsuario.save(err=>{
        if(err != null){
            console.log("error al crear usuario: ", err);
        }
    })
    estadoJuego.usuarios[userData['user']]['id'] = nuevoUsuario._id;
    estadoJuego.numUsers ++;
};

// editar usuario Bd
const editarUsuarioBd = async (userData) => {
    await userModel.findByIdAndUpdate(userData['id'], userData);
};

// eliminar usuario bd
const eliminarUsuarioBd = async (id) => {
    var hola = await userModel.findByIdAndDelete(id);
    estadoJuego.numUsers--;
    io.sockets.emit('estadoJuego', estadoActualJuego());
}

//app
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
io = socketIo(server);

//inicia servidor
server.listen(app.get('port'), ()=>{
    console.log("Server Running", app.get('port'));
})

//socket
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
    estadoJuego.usuarios[user['user']]['user'] = user['user'];
    estadoJuego.usuarios[user['user']]['pass'] = user['pass'];
    estadoJuego.usuarios[user['user']]['respuestas'] = [];
    estadoJuego.usuarios[user['user']]['puntajePP'] = [];
    estadoJuego.usuarios[user['user']]['puntajeTotalUser'] = 0;
    estadoJuego.usuarios[user['user']]['termino'] = false;
    crearUsuarioBd(estadoJuego.usuarios[user['user']]);
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
                eliminarUsuarioBd(estadoJuego.usuarios[user['user']]['id'])
                delete estadoJuego.usuarios[user['user']];
            }
        }
}

function iniciarCuestionario(user) {
    user['user'] = user['user'].toLowerCase();
    var ok = estadoJuego.usuarios.hasOwnProperty(user['user']);
    if (ok && user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
        console.log("inicie cuestionario")
        estadoJuego.gameBegin= true;
        estadoJuego.timeBegin = new Date().getTime();
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
    estadoJuegoBd()
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
    estadoJuego.timeBegin = new Date(2019, 09, 05).getTime();
    estadoJuego.gameRest=tiempoRestante(estadoJuego.timeBegin);
    estadoJuego.gameEnd= false;
    estadoJuego.estadisticas = [];
    for(let i = 0; i < estadoJuego.totpreg; i++){
        estadoJuego.estadisticas[i] = 0;
    }
    estadoJuegoBd()
    Object.keys(estadoJuego.usuarios).map((key, idx)=>{
        estadoJuego.usuarios[key]['respuestas'] = [];
        estadoJuego.usuarios[key]['puntajePP'] = [];
        estadoJuego.usuarios[key]['puntajeTotalUser'] = 0;
        estadoJuego.usuarios[key]['termino'] = false;
        editarUsuarioBd(estadoJuego.usuarios[key]);
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
        estadoJuegoBd()
        //Agregar sus respuestas a su estadoJuego
        estadoJuego.usuarios[user['user']]['respuestas'] = resultados;
        //regresarle su resultado
        socket.emit('misResultados', estadoJuego.usuarios[user['user']]);
        socket.emit('adminCorrectAns', bdanswers);
        //actualizar Bd de usuario
        editarUsuarioBd(estadoJuego.usuarios[user['user']]);
        //si es el administrador enviarle todas las respuestas hasta el momento
        if(user['user'] === estadoJuego.userAdmin && estadoJuego.passAdmin === user['pass']){
            socket.emit('usuarios', estadoJuego.usuarios);
        }
    }
}
function tiempoRestante(inicio) {
    const total = estadoJuego.totalTime;
    const now = new Date().getTime();
    if(inicio < now && inicio+total > now){
        estadoJuego.gameBegin= true;
        return total - (inicio-now);
    }
    return 0;
}