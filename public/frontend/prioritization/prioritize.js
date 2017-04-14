// const moment = require( 'moment' )

const calculatePriority = ({ events }) => moment( ).diff( moment( events[ events.length - 1 ].created_at ) )

const prioritize = requests =>
  requests.map( request =>
    Object.assign( {}, request, { priority: calculatePriority( request ) })
  ).sort( comparePriority )

const comparePriority = ( requestA, requestB ) => requestB.priority - requestA.priority

// module.exports = {
//   calculatePriority, prioritize
// }
