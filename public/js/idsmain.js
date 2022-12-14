(async ()=> {
    const message = document.querySelector('#message')
    //check if user has access to geolocation, add to localstorage
    if (!navigator.geolocation) {
      message.textContent = `Your browser doesn't support Geolocation`;
      message.classList.add('error');
      // return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError)

    function onSuccess(position) {
      const {
        latitude,
        longitude
      } = position.coords;

    localStorage.setItem('plantCoords', [latitude, longitude])

    message.classList.add('success');
    message.innerText = `your coordinates are: ${latitude} lat ${longitude} lon`
    //rewrite this callback as async? But nested? 
    sendCoords([latitude, longitude])
    }

    //clear local storage so mobile Safari asks for coords every time, preventing plant overwriting
    localStorage.removeItem('plantCoords');
    
    function onError() {
      message.classList.add('error');
      message.textContent = `Failed to get your location!`;
    }
    

    //temporarily store created coordinates
    
})()

async function sendCoords(coordArray) {
  const sendCoords = await fetch('/id/storeCoords', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({
      'coordinates': coordArray
    })
  })
  // const data = await sendCoords
  // console.log(data)
}

//trigger click event from upload/take picture button skin to override default styling 

document.querySelector('.button-skin').addEventListener('click', ()=> {
  document.getElementById('imageUpload').click()
  document.querySelector('.btn').classList.add('uploadColor')
})

