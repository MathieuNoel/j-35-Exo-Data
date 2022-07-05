const Game = require('../models/Game');
const Sawmill = require('../models/Sawmill');
const Silo = require('../models/Silo');
const Defense = require('../models/Defense');
const Waves = require('../models/Waves');
const Militia = require('../models/Militia');

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
          game.sawmill = Sawmill.generate(game.sawmill.level += 1)          
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
          game.silo = Silo.generate(game.silo.level + 1)
          request.session.game = game
        }
        return response.redirect('/status');
    },

    upgradeDefense: (request, response) => {
      let {game} = request.session;      
      game = Game.update(game)
      if(game.silo.level < 4 ) return response.redirect('/status');
      if(game.stock >= game.defense.cost) {
        game.stock = game.stock - game.defense.cost;
        game.defense = Defense.generate(game.defense.level + 1)
        request.session.game = game
      }
      return response.redirect('/status');
    },

    theWaveIsComming: (request, response) => {
      let {game} = request.session;            
      if(game.defense < 1 ) return response.redirect('/status');      
      game.defense.stamina = game.defense.stamina - game.wave.currentEnemies;
      if(game.defense.stamina < 0) game.defense.stamina = 0           
      game.wave = Waves.generate(game.wave.level + 1 )
      game = Game.update(game)
      if(game.defense.stamina == 0) {        
        game.stock = game.stock - game.stock
        game.wave.currentEnemies = game.wave.currentEnemies - game.wave.currentEnemies
      } 
      request.session.game = game
      return response.redirect('/status');
    },

    getMilitia: (request, response) => {
      let {game} = request.session;
      if(game.defense.stamina < 20) return response.redirect('/status');
      if(game.stock > game.militia.cost){
        game.stock = game.stock - game.militia.cost;
      
        game.militia = Militia.generate(game.militia.level + 1)
        if(game.wave.currentEnemies > game.militia.nbr){
          game.wave.currentEnemies = game.wave.currentEnemies - game.militia.nbr;        
        } else {
          game.wave.currentEnemies = 0
        }
        if(game.militia.nbr > game.wave.currentEnemies) {
          game.militia.nbr = game.militia.nbr - game.wave.currentEnemies
        } else {
          game.militia.nbr = 0
        } 
      } else {
        return response.redirect('/status');
      }     
      game = Game.update(game);
      request.session.game = game;
      return response.redirect('/status');
    },

    initGame: (request, response, next) => {        
      if(!request.session.game){        
        request.session.game = Game.generate(0);         
      }              
      next()
    }
};

module.exports = GameController;