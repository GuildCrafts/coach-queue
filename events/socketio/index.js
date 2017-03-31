const events = require( '../' )
const io = require( 'socket.io' )()

io.on( 'connection', socket => {
  socket.on( 'join', room => socket.join( room ))

  socket.on( 'client-test', data =>
    io.to( '/tests' ).emit( 'test-pingback', data )
  )

  for( let event in events ) {
    socket.on( event, events[ event ])
    socket.on( event, data => {
      io.to( '/tests' ).emit( 'test-pingback', { message: `Received event ${event}` } )
    })
  }
})

module.exports = io