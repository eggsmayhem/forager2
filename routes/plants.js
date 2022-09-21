const express = require('express')
const router = express.Router()
const plantsController = require('../controllers/plants') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, plantsController.loadPlantsPage)
router.get('/getPlants', ensureAuth, plantsController.getPlants)
router.delete('/deleteLatest', plantsController.deleteNewestPlant)
// router.post('/createPlant', plantsController.createPlant)


module.exports = router