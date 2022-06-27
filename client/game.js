const app = {
    baseUrl: 'http://localhost:8888',
    gameState: {},
    init: () => {
        app.bindElements();
        app.bindActions();
        app.loadGameState();

        setInterval(app.updateGameState, 500);
    },
    bindElements: () => {

        app.outputs = {
            yield: document.getElementById('stat-lumbering'),
            stock: document.getElementById('stat-lumber'),
            sawmill: document.getElementById('stat-sawmill-level'),
            silo: document.getElementById('stat-silo-level')/*,
            wave: document.getElementById('stat-next-wave'),
            enemies: document.getElementById('stat-enemies'),
            defense: document.getElementById('stat-defense-level'),
            militia: document.getElementById('stat-militia-level')*/
        };

        app.buttons = {
            sawmill: document.getElementById('action-upgrade-sawmill'),
            silo: document.getElementById('action-upgrade-silo')/*,
            defense: document.getElementById('action-upgrade-defense'),
            militia: document.getElementById('action-upgrade-militia')*/
        };
    },
    bindActions: () => {
        app.buttons.sawmill.addEventListener('click', app.handleSawmillClick);
        app.buttons.silo.addEventListener('click', app.handleSiloClick);
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

        app.buttons.sawmill.innerHTML = `${state.sawmill.level > 0?'Améliorer la scierie':'Construire une scierie'} pour ${state.sawmill.cost.toFixed(2)} <img src="./lumber.png">`;
        app.buttons.silo.innerHTML = `${state.silo.level > 0?'Améliorer l\'entrepôt':'Construire un entrepôt'} pour ${state.silo.cost.toFixed(2)} <img src="./lumber.png">`;

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
    },
    handleSawmillClick: async (e) => {
        const state = await fetch(app.baseUrl + '/sawmill/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;

        app.updateUI(state);
    },
    handleSiloClick: async () => {
        const state = await fetch(app.baseUrl + '/silo/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;

        app.updateUI(state);
    },
    updateGameState: () => {
        (t=>{const a=Math.round(Date.now()/1e3),s=a-t.lastUpdate;return t.lastUpdate=a,t.stock+=t.sawmill.yield*s,t.stock=Math.min(t.silo.capacity,t.stock),t})(app.gameState);

        app.updateUI(app.gameState);
    }
}

document.addEventListener('DOMContentLoaded', app.init);