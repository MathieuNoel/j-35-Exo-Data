const GameController = require('./controllers/GameController');

const router = require('express').Router();

router.use(GameController.initGame);

router.get('/status', GameController.status);
router.get('/sawmill/upgrade', GameController.upgradeSawmill);
router.get('/silo/upgrade', GameController.upgradeSilo);

module.exports = router;