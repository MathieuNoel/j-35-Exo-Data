const Sawmill = require('./Sawmill');
const Silo = require('./Silo');

const Game = {
    generate: () => {
        return {};
    },
    update: (game) => {
        // 1. récupérer le timestamp Unix actuel en secondes
        // ATTENTION : JS fournit l'information en millisecondes, il faut diviser le nombre obtenu par 1000
        // sinon, vous allez générer 0.2 bois par millisecondes, soit 200 unités par seconde :-D
        
        // 2. calculer le délai depuis la dernière demande
        
        // 3. mettre à jour la dernière demande
        
        // 4. augmenter le stock avec la production générée

        // 5. sans dépasser la capacité de l'entrepôt

        // un peu inutile, mais plus logique et souple
        return game;
    }
};

module.exports = Game;