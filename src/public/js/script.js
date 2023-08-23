const socket = io()

socket.emit('mensaje', "Hola servidor")

socket.on('respuesta', (info) => {
    if (info) {
        socket.on('')
    }
})