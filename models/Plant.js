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
            rendered: {
                type: Boolean,
                default: false
            }
})

module.exports = mongoose.model('Plant', PlantSchema)
