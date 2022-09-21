// event listener to delete most recent plant in database after it is displayed

document.querySelector('.delete-plant').addEventListener('click',  async () => {
    try{
      await fetch('plants/deleteLatest', {
          method: 'delete',
      })
    //   const data = await response.json()
    //   console.log(data)
    //   location.reload()
  }catch(err){
      console.log(err)
  }
  })