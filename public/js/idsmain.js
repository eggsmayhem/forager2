(()=> {
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

    }

    function onError() {
      message.classList.add('error');
      message.textContent = `Failed to get your location!`;
    }
})()