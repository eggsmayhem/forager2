const mongoose = require('mongoose')

const PlantSchema = new mongoose.Schema({
            // coordinates: [{
            //     userId: {
            //         type: String,
            //     },
            //     coords: {
            //         lat: {
            //             type: String
            //         },
            //         long: {
            //             type: String
            //         }
            //     }
            // }],
            coordinates: {
                type: Array
            },
            img: {
                type: String
            },
            userId: {
                type: String
            },
            scientificName: {
                type: String
            },
            cloudinaryId: {
                type: String
            },
            // article: {
            //     type: String
            // },
            wikiPic: {
                type: String
            },
            description: {
                type: String
            },
            link: {
                type: String
            },
            extract: {
                type: String
            },
            title: {
                type: String
            },
            rendered: {
                type: Boolean,
                default: false
            },
            commonName: {
                type: String
            },
            edibleParts: {
                type: Array
            },
            propMethods: {
                type: Array
            },
            
})

module.exports = mongoose.model('Plant', PlantSchema)
