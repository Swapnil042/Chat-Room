const socket= io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message',({message, createdAt})=>{
    const html = Mustache.render(messageTemplate,{
        message,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

socket.on('locationMessage', ({url, createdAt})=>{
    const html = Mustache.render(locationTemplate,{
        url,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message delivered!')
    })
})

$sendLocationButton.addEventListener('click',(e)=>{
    e.preventDefault()
    
    if(!navigator.geolocation){
        return alert('not supported')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('location', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })

})