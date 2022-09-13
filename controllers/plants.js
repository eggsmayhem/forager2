// const { ConnectionPoolClosedEvent } = require('mongodb')
const Plant = require('../models/Plant')

module.exports = {
    loadPlantsPage: async (req,res)=>{
        console.log(req.user)
        try{
            //note the plant objects themselves seem to be returning to the Client just fine
            // const plants = await Plant.find({userId:req.user.id})
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            // console.log(plants)
            res.render('plants.ejs', { user: req.user })
        }catch(err){
            console.log(err)
        }
    },
    getPlants: async (req,res)=>{
        console.log(req.user)
        try{
            const plants = await Plant.find({userId:req.user.id})
    
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            // console.log(plants)
            // res.render('plants.ejs', { user: req.user })
            //this is returning all the plants, I am just struggling to get that state to actually render through Leaflet JS 
            res.status(200).json(plants)
        }catch(err){
            console.log(err)
        }
    },
    //change to userId: req.user.id
    createPlant: async (req, res) => {
        try {
            await Plant.create({scientificName: req.body.scientificName, coordinates: req.body.coordinates, img: req.body.img, userId: req.body.id})
            console.log('Plant has been added')
        }
        catch(err) {

        }
    }
}    