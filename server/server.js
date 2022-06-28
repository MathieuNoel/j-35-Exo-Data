const express = require('express');
const cors = require('cors')
const app = express();
const session = require('express-session');

const router = require('./router');
app.use(express.static('client'));
app.use(express.json({extended: true}))


// on va utiliser la session d'un joueur pour sauvegarder sa progression
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'odle',
    cookie: {
        secure: false,
        maxAge: (1000*60*60)
        }
}));

// et puisqu'on utilise les sessions (et donc les cookies), la communication front <> API va être un peu plus complexe
// ajouter ici un moyen pour le client d'être disponible sur le même domaine que l'API
app.use(cors())
app.use(router);

app.listen(8888, _ => console.log('game server running','http://localhost:8888'));
// --experimental-modules dans le terminal pour pouvoir traiter les modules js dans le REPL de node