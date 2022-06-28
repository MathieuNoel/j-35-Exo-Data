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
        if(game.stock > game.sawmill.cost){
          // on retire le coût du stock
          game.stock = game.stock - game.sawmill.cost
          // et on remplace la scierie actuelle par celle du niveau supérieur
          
          game.sawmill = Sawmill.generate(game.sawmill.level)
          console.log('=========>>>>>CELUI Là',request.session);
          request.session.game = game
          
        }
        
          response.redirect('/status');
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
       
      if(!request.session.game){
        
        request.session.game = Game.generate();
         
      }          
         next()
    }
};

module.exports = GameController;