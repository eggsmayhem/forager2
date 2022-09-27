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
            const plants = await Plant.find({userId:req.user.id}).lean()

            //remove any plants that don't have coordinages as this kind of object breaks the front end 
    
         
            res.status(200).json(plants)
        }catch(err){
            console.log(err)
        }
    },
    deleteNewestPlant: async (req, res) => {
        try {
            // const latest = await Plant.findOne({userId: req.user.id}).sort({ date: -1})
            // await latest.remove()
           
            const plant = await Plant.findByIdAndDelete({_id: req.params.id})
            console.log(plant)
            console.log("Plant Removed!")
            // res.render('ids.ejs')
            // res.render('ids.ejs')
            // req.method = 'GET'
            res.redirect('/plants')
        }
        catch(err) {
            console.log(err)
        }
    }
    //change to userId: req.user.id
    // createPlant: async (req, res) => {
    //     try {
    //         await Plant.create({scientificName: req.body.scientificName, coordinates: req.body.coordinates, img: req.body.img, userId: req.body.id})
    //         console.log('Plant has been added')
    //     }
    //     catch(err) {

    //     }
    // }
}    