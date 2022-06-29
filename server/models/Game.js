const session = require('express-session');
const Sawmill = require('./Sawmill');
const Silo = require('./Silo');

const Game = {
    generate: () => {
      
      return { 
            stock: 0,
            sawmill: {
              level: 0,
              yield: 0.2,
              cost: 4
            },
            silo: {
              level: 0,
              capacity: 30,
              cost: 15
            },            
            lastUpdate: Date.now(),
          };
          
        
    },
    update: (game) => {
      // 1. récupérer le timestamp Unix actuel en secondes        
      // ATTENTION : JS fournit l'information en millisecondes, il faut diviser le nombre obtenu par 1000
      // sinon, vous allez générer 0.2 bois par millisecondes, soit 200 unités par seconde :-D
      
      const currentTime = Date.now()
      
      // 2. calculer le délai depuis la dernière demande
      const timeSpend = ((currentTime - game.lastUpdate)/1000)
      
        
        // 3. mettre à jour la dernière demande
        game.lastUpdate = currentTime

        // 4. augmenter le stock avec la production générée
        const addWood = timeSpend * game.sawmill.yield
        
        // 5. sans dépasser la capacité de l'entrepôt
        if(addWood >= game.silo.capacity){
          game.stock = game.silo.capacity          
        } else {
          game.stock = Math.round(game.stock + addWood)
        }
        // un peu inutile, mais plus logique et souple
         return game;
    }
};

module.exports = Game;