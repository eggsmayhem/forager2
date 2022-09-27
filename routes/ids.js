const express = require('express')
const router = express.Router()
const idsController = require('../controllers/ids') 
const { ensureAuth } = require('../middleware/auth')
const upload = require("../middleware/multer")

router.get('/', ensureAuth, idsController.loadPage)
//test route for dummy displayPlant info page that doesn't make any API calls
router.get('/test', ensureAuth, idsController.testRoute)
router.get('/loadPlant/:id', idsController.getPlantFromMap)

router.post('/idPlant', upload.single("file"), idsController.idPlant)
router.post('/storeCoords', idsController.storeCoords)


// router.get('/redirect', ensureAuth, idsController.idRedirect)

module.exports = router