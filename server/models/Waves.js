const WavesTemplate = {
  level: 0,
  nextWave: 2,
  currentEnemies: 1
};

const Wave = {
  upgrade: {
      NEXTWAVE_FACTOR: 1.5,
      
  },
  generate: (level) => {
      const wave = {...WavesTemplate};        
      wave.level = level;
      for(let i =0 ; i < wave.level ; i++){
        wave.currentEnemies = wave.nextWave + wave.currentEnemies;
        wave.nextWave = Math.round(wave.nextWave * Wave.upgrade.NEXTWAVE_FACTOR);          
      }
      return wave
  }
};

module.exports = Wave;