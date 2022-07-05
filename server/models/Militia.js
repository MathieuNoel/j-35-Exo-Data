const MilitiaTemplate = {
  level: 0,
  nbr: 2,
  cost: 35
};

const Militia = {
  upgrade: {
      NBR_FACTOR: 1.5,
      COST_FACTOR: 1.3
      
  },
  generate: (level) => {
      const militia = {...MilitiaTemplate};        
      militia.level = level;
      for(let i =0 ; i < militia.level ; i++){
        militia.nbr = Math.round(militia.nbr * Militia.upgrade.NBR_FACTOR);
        militia.cost = Math.round(militia.cost * Militia.upgrade.COST_FACTOR);          
      }
      return militia;
  }
};

module.exports =  Militia;