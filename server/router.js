const GameController = require('./controllers/GameController');

const router = require('express').Router();

router.use(GameController.initGame);

router.get('/status', GameController.status);
router.get('/sawmill/upgrade', GameController.upgradeSawmill);
router.get('/silo/upgrade', GameController.upgradeSilo);
router.get('/defense/upgrade', GameController.upgradeDefense);
router.get('/wave', GameController.theWaveIsComming)
router.get('/militia', GameController.getMilitia)

module.exports = router;