
// ce template sert de base pour générer n'importe quel niveau de bâtiment
const DefenseTemplate = {
  level: 0,
  stamina: 10,
  cost: 7 // attention, il s'agit bien du coût pour acheter le niveau suivant
}

const Defense = {
  // chaque niveau augmente la production de 30% (* 1.3)
  // et chaque niveau suivant coûte 40% de plus que le précédent (* 1.4)
  upgrade: {
      STAMINA_FACTOR: 1.3,
      COST_FACTOR: 1.4
  },
  generate: (level) => {            
      // pour générer n'importe quel niveau, on va déjà cloner SawmillTemplate
      const defense = {...DefenseTemplate}        
      defense.level = level      
      // puis boucler (level) fois
      for(let i = 0 ; i < defense.level ; i++ ){
          // et à chaque fois, multiplier yield par YIELD_FACTOR
          defense.stamina = Math.round(defense.stamina * Defense.upgrade.STAMINA_FACTOR)
          // et cost par COST_FACTOR
          defense.cost = defense.cost * Defense.upgrade.COST_FACTOR
      }
      // avant de retourner le bâtiment au bon niveau
      return defense;      
  }
};
module.exports = Defense;