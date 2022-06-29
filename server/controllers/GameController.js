const Game = require('../models/Game');
const Sawmill = require('../models/Sawmill');
const Silo = require('../models/Silo');

const GameController = {
    status: (request, response) => {        
        let { game } = request.session; 
                       
        // mettre à jour la partie        
        game = Game.update(game)
        
        // renvoyer le nouvel état de la partie
        request.session.game = game  
         
        response.json(game)
    },

    upgradeSawmill: (request, response) => {
        let { game } = request.session;
        // mettre à jour la partie, sinon on ne sera pas certain que le coût puisse être payé
        game = Game.update(game)
        // si le stock permet de payer le coût
        if(game.stock >= game.sawmill.cost){
          // on retire le coût du stock
          game.stock = game.stock - game.sawmill.cost
          // et on remplace la scierie actuelle par celle du niveau supérieur          
          game.sawmill = Sawmill.generate(game.sawmill.level)          
          request.session.game = game          
        }        
          response.redirect('/status');
    },

    upgradeSilo: (request, response) => {
        let { game } = request.session;
        // mettre à jour la partie
        game = Game.update(game)
        // si la scierie 3 n'est pas construite, on redirige directement vers /status
        if(game.sawmill.level < 3 ) return response.redirect('/status');
        // sinon on vérifie si le joueur a le stock nécessaire
        if(game.stock >= game.silo.cost){
          // et on construit son entrepôt
          game.stock = game.stock - game.silo.cost
          game.silo = Silo.generate(game.silo.level)
          request.session.game = game
        }
        return response.redirect('/status');
    },
    initGame: (request, response, next) => {        
      if(!request.session.game){        
        request.session.game = Game.generate();         
      }          
         next()
    }
};

module.exports = GameController;