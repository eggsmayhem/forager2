// const { ConnectionPoolClosedEvent } = require('mongodb')
const Plant = require('../models/Plant')
const User = require('../models/User')
const axios = require('axios')
const cloudinary = require("../middleware/cloudinary")
const encode = require('node-base64-image').encode
require('dotenv').config({path: '../config/.env'})
const isValidCoordinates = require('is-valid-coordinates')

module.exports = {
  //load id page to submit form 
    testRoute: async (req, res) => {
      try {
        res.render('displayPlant.ejs')
      }
      catch(err) {
        console.log(err)
      }
    },
    loadPage: async (req, res) => {
        try {
            console.log('render test')
            res.render('ids.ejs')
        }
        catch(err) {
            console.log(err)
        }
    },
    // idRedirect: async (req, res) => {
    //     try {
    //         console.log('redirect test')
    //         res.redirect('/id')

    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
    // },
    
    //change to userId: req.user.id
    //something in this controller is causing the MIMEtype/security issue 
    //identifies a new plant, gets its wiki info, sets that new plant in the database for the user, then directly renders just that new plant and its info. 
    idPlant: async (req, res) => {
        try {
            //upload original image to cloudinary
            const user = await User.findById({_id: req.user.id})
            //the coords here have already been validate before they were stored to the user object
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
            const wikiOptions = {
              method: 'GET',
              url: 'https://en.wikipedia.org/api/rest_v1/page/summary/'+plantDetails.suggestions[0].plant_name,
              headers: {
                'User-Agent': process.env.USER_AGENT,
              },
              data: data
            }

            const wikiResponse = await axios.request(wikiOptions)
            const article = wikiResponse.data
            // const article = JSON.stringify(wikiResponse)
            console.log(article)
            // const wikiData = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+plantDetails.suggestions[0].plant_name, {
            //     method: 'GET',
            //     headers: {'User-Agent': process.env.USER_AGENT}
            // })
            // const article = await wikiData.text()
            // const article = await wikiData.json()
            // console.log(article)

            //im getting the article, but all the below values are returning undefined, even though they do exist if you check postman

            
            const wikiPic = article.originalimage.source
            const description = article.description
            const link = article.content_urls.mobile.page
            const extract = article.extract
            const title = article.title
            console.log(article)
            
            //name and image are from PlantAPI
            //Wikipicture, description, link, extract, and title are from Wikipedia API 
            //should pick one image to save and render on display and map page rather than saving both 

            const plant = await Plant.create({
                scientificName: plantDetails.suggestions[0].plant_name,
                // img: plantDetails.images[0].url,
                coordinates: coords,
                userId: req.user.id,
                // article: article
                wikiPic : wikiPic,
                description: description,
                link: link,
                extract: extract,
                title: title
              })

              
              console.log('Plant has been created!')
              console.log(plant)
              res.render('displayPlant.ejs', {plant: plant})
        }
        catch(err) {
            console.log(err)
        }
    },

    getPlantFromMap: async(req, res) => {
      try {
        // const plantId = req.params.id
        const plant = await Plant.findById({_id: req.params.id})
        res.render('displayPlant.ejs', {plant: plant})

      }
      catch(err) {
        console.log(err)
      }
    },

      //potential security issue, as here client code is saved in the User document, and later it is rendered to the user 
      //could potentially just do a custom validator with regex or the like, check on speed and size difference 
    storeCoords: async(req, res) => {
      try {
        const coords = await req.body.coordinates
        if (isValidCoordinates(coords[0], coords[1])) {
          const userCoords = coords.map(x=>x.toString())
          await User.findOneAndUpdate({_id:req.user.id}, {
            tempCoords: userCoords
          })
        }
        else {
          const securityWarning = "Security Warning: Invalid Coordinates sent from client" 
          res.render('ids.ejs', {securityWarning: securityWarning})
        }
       
        console.log(coords)
      }
      catch(err) {
        console.log(err)
      }
      
    }
}    