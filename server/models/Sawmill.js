
// ce template sert de base pour générer n'importe quel niveau de bâtiment
const SawmillTemplate = {
    level: 0,
    yield: 0.2,
    cost: 4 // attention, il s'agit bien du coût pour acheter le niveau suivant
 }

const Sawmill = {
    // chaque niveau augmente la production de 30% (* 1.3)
    // et chaque niveau suivant coûte 40% de plus que le précédent (* 1.4)
    upgrade: {
        YIELD_FACTOR: 1.3,
        COST_FACTOR: 1.4
    },
    generate: (level) => {        
        // pour générer n'importe quel niveau, on va déjà cloner SawmillTemplate
        const sawmill = {...SawmillTemplate}        
        sawmill.level = level
        // puis boucler (level) fois
        for(let i = 0 ; i < sawmill.level ; i++ ){
            // et à chaque fois, multiplier yield par YIELD_FACTOR
            sawmill.yield = sawmill.yield * Sawmill.upgrade.YIELD_FACTOR
            // et cost par COST_FACTOR
            sawmill.cost = sawmill.cost * Sawmill.upgrade.COST_FACTOR
        }
        // avant de retourner le bâtiment au bon niveau
        return sawmill;
        
        
        
        
        
    }
};

module.exports = Sawmill;