const Game = require('../models/Game');
const Sawmill = require('../models/Sawmill');
const Silo = require('../models/Silo');

const GameController = {
    status: (request, response) => {
        const { game } = request.session;

        // mettre à jour la partie
        
        // renvoyer le nouvel état de la partie
    },

    upgradeSawmill: (request, response) => {
        const { game } = request.session;

        // mettre à jour la partie, sinon on ne sera pas certain que le coût puisse être payé

        // si le stock permet de payer le coût
          // on retire le coût du stock
          // et on remplace la scierie actuelle par celle du niveau supérieur

        return response.redirect('/status');
    },

    upgradeSilo: (request, response) => {
        const { game } = request.session;

        // mettre à jour la partie

        // si la scierie 3 n'est pas construite, on redirige directement vers /status
        
        // sinon on vérifie si le joueur a le stock nécessaire
          // et on construit son entrepôt

        return response.redirect('/status');
    },

    initGame: (request, response, next) => {

      // ce MW ne répond pas, donc il doit passer la main au suivant
      next();
    }
};

module.exports = GameController;