const SiloTemplate = {
    level: 0,
    capacity: 30,
    cost: 15
};

const Silo = {
    upgrade: {
        CAPACITY_FACTOR: 1.3,
        COST_FACTOR: 1.3
    },
    generate: (level) => {
        const silo = {...SiloTemplate}        
        silo.level = level
        for(let i =0 ; i < silo.level ; i++){
            silo.capacity = Math.round(silo.capacity * Silo.upgrade.CAPACITY_FACTOR)
            silo.cost = silo.cost * Silo.upgrade.COST_FACTOR
        }
        return silo
    }
};

module.exports = Silo;