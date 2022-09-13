// document.getElementById('weathermap').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>"

// const { response } = require("express");

//this function just renders a map with all a user's previous plants on load
document.getElementById('load-map').addEventListener('click', loadMap)
async function loadMap() {
  try {
    console.log('test function run')
    const map = L.map('map').setView([39.0047, -77.3602], 13)

    const response = await fetch('/plants/getPlants', {
      method: 'GET',
    })
    
    const plantHolder = await response.json()

    //hardcode test since map won't load at all, but should
    const plant = {
      url: "https://plant.id/media/images/fb4120879ae04199821cce79b6fd60c8.jpg",
      scientificName: "Magnolia virginiana",
      coords: [39.0047, -77.3600]
    }

     
    // .then(function(data) {
    //   const plantHolder = data
    //   console.log(plantHolder);
    //   return plantHolder;
    // })
    // .then(function(plantHolder) {
    //     //within this function we need to render everything
    //     console.log(plantHolder[1])
    // })
   
        console.log(plantHolder[0])

        const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
     
        osm.addTo(map)

        const nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
            layers: 'nexrad-n0r-900913',
            format: 'image/png',
            transparent: true,
            attribution: "Weather data © 2012 IEM Nexrad"
        })
        
        const watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              subdomains: 'abcd',
              minZoom: 1,
              maxZoom: 16,
              ext: 'jpg'
        })
        
        watercolor.addTo(map)
        
        const googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        })
        
        googleSat.addTo(map)

        const mandrakeIcon = L.icon({
            iconUrl: '../img/mandrake1croppednobg.png',
            iconSize: [38, 95],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            // shadowUrl: 'my-icon-shadow.png',
            // shadowSize: [68, 95],
            // shadowAnchor: [22, 94]
        })

        //lets try to get two of these suckers, then go back through and worry about looping through all of them
        // const singleMarker = L.marker(plantHolder[0].coordinates, {icon: mandrakeIcon})
        // console.log(plant.coords)
        // const singleMarker = L.marker(plantHolder[0].coordinates, {icon: mandrakeIcon})
        // const popup = singleMarker.bindPopup(plantHolder[0].scientificName + '<br>' + '<img src='+ '"'+plantHolder[0].img+'"'+'style="width: 100%; height: 100%">')
        // popup.addTo(map)
    
        // const secondMarker = L.marker([39.0047, -77.3602], {icon: mandrakeIcon})
        // secondMarker.addTo(map) 
        const cards = {}
        const pops = {}
        for (let i = 0; i < plantHolder.length; i++) {
          cards['card'+i] = L.marker(plantHolder[i].coordinates, {icon: mandrakeIcon})
          pops['pop' + i] = cards['card'+i].bindPopup(plantHolder[i].scientificName + '<br>' + '<img src='+ '"'+plantHolder[i].img+'"'+'style="width: 100%; height: 100%">')
          pops['pop'+i].addTo(map)
        }

        const baseMaps = {
            "OSM": osm,
            "Watercolor": watercolor,
            "Google Satelitte": googleSat,
            
        }
        
        const overlayMaps = {
            // "Marker": singleMarker,
            // "Second Marker": secondMarker,
            "Weather": nexrad
        }
        
    L.control.layers(baseMaps, overlayMaps).addTo(map)
  }
  catch(err) {
    console.log(err)
  }
            
}