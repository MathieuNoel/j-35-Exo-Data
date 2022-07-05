const app = {
    baseUrl: 'http://localhost:8888',
    gameState: {},
    init: () => {
        app.bindElements();
        app.bindActions();
        app.loadGameState();

        setInterval(app.updateGameState, 500);
        setInterval(app.theWaveIsComing, 120000)      
    },
    bindElements: () => {

        app.outputs = {
            yield: document.getElementById('stat-lumbering'),
            stock: document.getElementById('stat-lumber'),
            sawmill: document.getElementById('stat-sawmill-level'),
            silo: document.getElementById('stat-silo-level'),
            wave: document.getElementById('stat-next-wave'),
            enemies: document.getElementById('stat-enemies'),
            defense: document.getElementById('stat-defense-level'),
            stamina: document.getElementById('stat-defense-stamina'),
            militia: document.getElementById('stat-militia-level')
        };

        app.buttons = {
            sawmill: document.getElementById('action-upgrade-sawmill'),
            silo: document.getElementById('action-upgrade-silo'),
            defense: document.getElementById('action-upgrade-defense'),
            militia: document.getElementById('action-upgrade-militia')
        };
    },
    bindActions: () => {
        app.buttons.sawmill.addEventListener('click', app.handleSawmillClick);
        app.buttons.silo.addEventListener('click', app.handleSiloClick);
        app.buttons.defense.addEventListener('click', app.handleDefenseClick);
        app.buttons.militia.addEventListener('click', app.handleMilitiaClick)
    },
    loadGameState: async () => {
        const state = await fetch(app.baseUrl + '/status', {            
               credentials: 'include'
        }).then(response => response.json());        
        app.gameState = state;        

        // si l'heure locale et celle du serveur ne coïncident pas, on peut afficher des informations fausses
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);

        app.updateUI(state);
    },
    updateUI: (state) => {
        app.outputs.stock.textContent = state.stock.toFixed(2) + "/" + state.silo.capacity;
        app.outputs.yield.textContent = state.sawmill.yield.toFixed(2) + "/s";
        app.outputs.sawmill.textContent = state.sawmill.level;
        app.outputs.silo.textContent = state.silo.level;
        app.outputs.defense.textContent = state.defense.level;
        app.outputs.stamina.textContent = state.defense.stamina;
        app.outputs.wave.textContent = state.wave.nextWave;
        app.outputs.enemies.textContent = state.wave.currentEnemies;
        app.outputs.militia.textContent = state.militia.nbr;

        app.buttons.sawmill.innerHTML = `${state.sawmill.level > 0?'Améliorer la scierie':'Construire une scierie'} pour ${state.sawmill.cost.toFixed(2)} <img src="./lumber.png">`;
        app.buttons.silo.innerHTML = `${state.silo.level > 0?'Améliorer l\'entrepôt':'Construire un entrepôt'} pour ${state.silo.cost.toFixed(2)} <img src="./lumber.png">`;
        app.buttons.defense.innerHTML = `${state.defense.level > 0?'Améliorer les fortifications':'Construire des fortifications'} pour ${state.defense.cost.toFixed(2)}<img src="./lumber.png">`;
        app.buttons.militia.innerHTML = `${state.militia.level > 0?'Améliorer la milice':'Payer des miliciens'} pour ${state.militia.cost.toFixed(2)}<img src="./lumber.png">`;

        if (state.stock >= state.sawmill.cost) {
            app.buttons.sawmill.removeAttribute('disabled');
        } else {
            app.buttons.sawmill.setAttribute('disabled', 'disabled');
        }

        if (state.sawmill.level > 2) {
            app.buttons.silo.classList.add('available');
        }

        if (state.stock >= state.silo.cost) {
            app.buttons.silo.removeAttribute('disabled');
        } else {
            app.buttons.silo.setAttribute('disabled', 'disabled');
        }

        if (state.silo.level > 4) {
            app.buttons.defense.classList.add('available')
            document.querySelector('#stat-defense-level').classList.remove('soon');
            document.querySelector('#stat-next-wave').classList.remove('soon');
            document.querySelector('#stat-enemies').classList.remove('soon');
            document.querySelector('#stat-defense-stamina').classList.remove('soon');
        }

        if (state.stock >= state.defense.cost) {
            app.buttons.defense.removeAttribute('disabled')
        } else {
            app.buttons.defense.setAttribute('disabled', 'disabled');
        }

        if (state.defense.stamina > 10 ) {            
            app.buttons.militia.classList.add('available')
            document.querySelector('#stat-militia-level').classList.remove('soon');            
        }     

        if (state.stock >= state.militia.cost){
            app.buttons.militia.removeAttribute('disabled')
        } else {
            app.buttons.militia.setAttribute('disabled', 'disabled');
        }
         
    },
    handleSawmillClick: async (e) => {        
        const response = await fetch(app.baseUrl + '/sawmill/upgrade', {
             credentials: 'include'
        } )
        const state = await response.json()       
        app.gameState = state;
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);
        app.updateUI(state);
    },

    handleSiloClick: async () => {
        const state = await fetch(app.baseUrl + '/silo/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);
        app.updateUI(state);
    },

    handleDefenseClick: async () => {
        const state = await fetch(app.baseUrl + '/defense/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;        
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);        
        app.updateUI(state);
    },

    theWaveIsComing: async () => {
        const state = await fetch(app.baseUrl + '/wave', {
            credentials : 'include'
        }).then(response => response.json());
        app.gameState = state;                
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);
        app.updateUI(state);
    },

    handleMilitiaClick: async () => {
        const state = await fetch(app.baseUrl + '/militia', {
            credentials : 'include'
        }).then(response => response.json());
        app.gameState = state;
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);
        app.updateUI(state);
    },

    updateGameState: () => {
        (t=>{
            const a=Math.round(Date.now()/1e3),
            s=a-t.lastUpdate;
            return t.lastUpdate=a, t.stock+=t.sawmill.yield*s, t.stock=Math.min(t.silo.capacity,t.stock), t
            }
        )(app.gameState);

        app.updateUI(app.gameState);
    }
}

document.addEventListener('DOMContentLoaded', app.init);