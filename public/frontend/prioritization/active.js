const active = ( requests, coachId ) =>
  requests.map( request => Object.assign( {}, request, { active: isActive( request, coachId ) }))

const isActive = ( request, coachId ) => request.events.some( ({ data }) => data.claimed_by === coachId )

// module.exports = {
//   active, isActive
// }
