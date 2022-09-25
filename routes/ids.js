const express = require('express')
const router = express.Router()
const idsController = require('../controllers/ids') 
const { ensureAuth } = require('../middleware/auth')
const upload = require("../middleware/multer")

router.get('/', ensureAuth, idsController.loadPage)
router.get('/test', ensureAuth, idsController.testRoute)
router.post('/idPlant', upload.single("file"), idsController.idPlant)
router.post('/storeCoords', idsController.storeCoords)
router.get('/loadPlant/:id', idsController.getPlantFromMap)

// router.get('/redirect', ensureAuth, idsController.idRedirect)

module.exports = router