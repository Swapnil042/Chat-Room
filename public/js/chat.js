const socket= io()

socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        if(error){
            return console.log(error)
        }
        console.log('message dekivered!')
    })
})

document.querySelector('#send-location').addEventListener('click',(e)=>{
    e.preventDefault()
    if(!navigator.geolocation){
        return alert('not supported')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('location', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, ()=>{
            console.log('Location Shared')
        })
    })

})