// const { ConnectionPoolClosedEvent } = require('mongodb')
const Plant = require('../models/Plant')
const User = require('../models/User')
const axios = require('axios')
const cloudinary = require("../middleware/cloudinary")
const encode = require('node-base64-image').encode
require('dotenv').config({path: '../config/.env'})

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
    idPlant: async (req, res) => {
        try {
            //upload original image to cloudinary
            const user = await User.findById({_id: req.user.id})
            const coords = user.tempCoords
            console.log('coords from user' + coords)
            const plantImg = await cloudinary.uploader.upload(req.file.path)
            const plantUrl = plantImg.secure_url
            console.log(plantImg.secure_url)

            const options = {
                string: true,
                headers: {
                  "User-Agent": "plantfinder",
                },
              }
            //encode image to base64 for plantApi
            const encodedPlant = await encode(plantUrl, options)

            const data = JSON.stringify({"images": [encodedPlant]})
            const plantOptions = {
                method: 'POST',
                url: 'https://api.plant.id/v2/identify',
                headers: {
                  'Api-key': process.env.PLANT_API_KEY,
                },
                data: data
              }
            const plantData = await axios.request(plantOptions)
            const plantDetails = plantData.data
            console.log(plantDetails)
              //currently saving the PlantAPI reference image to limit the cloudinary storage space I require. I might eventually offer the user's image so they can more easily identify locations and how others where to forage
              //gets full article
            // const wikiData = await fetch('https://en.wikipedia.org/api/rest_v1/page/html/'+plantDetails.suggestions[0].plant_name, {
            //     method: 'GET',
            //     headers: {'User-Agent': 'https://spyles.netlify.app/'}
            // })
            //gets partial article
            const wikiData = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+plantDetails.suggestions[0].plant_name, {
                method: 'GET',
                headers: {'User-Agent': 'https://spyles.netlify.app/'}
            })
            const article = await wikiData.text()

            //im getting the article, but all the below values are returning undefined, even though they do exist if you check postman

            
            // const wikiPic = article.originalimage.source
            // const description = await article.description
            // const link = await article.content_urls.mobile.page
            // const extract = await article.extract
            console.log(article)
            

            const plant = await Plant.create({
                scientificName: plantDetails.suggestions[0].plant_name,
                img: plantDetails.images[0].url,
                coordinates: coords,
                userId: req.user.id,
                // article: article
                // wikiPic : wikiPic,
                // description: description,
                // link: link,
                // extract: extract
              })

              
              console.log('Plant has been created!')
              console.log(plant)
              res.render('ids.ejs', {plant: plant})
        }
        catch(err) {
            console.log(err)
        }
    },

    storeCoords: async(req, res) => {
      try {
        const coords = await req.body.coordinates.map(x=>x.toString())
        await User.findOneAndUpdate({_id:req.user.id}, {
          tempCoords: coords
        })
        console.log(coords)
      }
      catch(err) {
        console.log(err)
      }
      
    }
}    