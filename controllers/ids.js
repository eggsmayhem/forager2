// const { ConnectionPoolClosedEvent } = require('mongodb')
const Plant = require('../models/Plant')

module.exports = {
    loadPage: async (req, res) => {
        try {
            console.log('render test')
            res.render('ids.ejs')
        }
        catch(err) {
            console.log(err)
        }
    },
    idRedirect: async (req, res) => {
        try {
            console.log('redirect test')
            res.redirect('/id')

        }
        catch(err) {
            console.log(err)
        }
    },
    
    //change to userId: req.user.id
    createPlant: async (req, res) => {
        try {
            await Plant.create({scientificName: req.body.scientificName, coordinates: req.body.coordinates, img: req.body.img, userId: req.user.id})
            console.log('Plant has been added')
        }
        catch(err) {
            console.log(err)
        }
    }
}    