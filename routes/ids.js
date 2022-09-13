const express = require('express')
const router = express.Router()
const idsController = require('../controllers/ids') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, idsController.loadPage)
router.get('/idPlant', ensureAuth, idsController.createPlant)
router.get('/redirect', ensureAuth, idsController.idRedirect)

module.exports = router