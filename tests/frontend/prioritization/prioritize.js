const { Factory, minutesAgo } = require( '../../fixtures/requests' )
const { calculatePriority, prioritize
} = require( '../../../frontend/prioritization/prioritize' )
const { CREATE, ESCALATE } = require( '../../../events/requests/constants' )


describe( 'calculatePriority', () => {
  describe( 'comparing one older and one newer request', () => {
    it( 'gives higher priority to an older request', () => {
      const newerRequest = Factory.request({
        events: [{ created_at: minutesAgo( 3 ) }]
      })

      const olderRequest = Factory.request({
        events: [{ created_at: minutesAgo( 60 ) }]
      })

      expect( calculatePriority( olderRequest ))
        .to.be.above( calculatePriority( newerRequest))
    })
  })

  describe( 'comparing a recently escalated request with an older unescalated request', () => {
    it( 'gives higher prioirty to the older unescalated request', () => {
      const recentlyEscalated = Factory.request( {
        events: [
          { name: CREATE, created_at: minutesAgo( 61 ) },
          { name: ESCALATE, created_at: minutesAgo( 3 ) }
        ]
      })

      const olderUnescalated = Factory.request({
        events: [{ name: CREATE, created_at: minutesAgo( 60 ) }]
      })

      expect( calculatePriority( olderUnescalated ))
        .to.be.above( calculatePriority( recentlyEscalated ))
    })
  })
})

describe( 'prioritize', () => {
  describe( 'given a series of requests', () => {
    it( 'orders them by most recent event created_at, descending', () => {
      const priorityOneEvent = Factory.request({
        events: [{ name: CREATE, created_at: minutesAgo( 60 ) }]
      })

      const priorityTwoEvent = Factory.request( {
        events: [
          { name: CREATE, created_at: minutesAgo( 61 ) },
          { name: ESCALATE, created_at: minutesAgo( 3 ) }
        ]
      })

      const priorityThreeEvent = Factory.request( {
        events: [{ name: CREATE, created_at: minutesAgo( 2 ) }]
      })

      const testRequests = [ priorityThreeEvent, priorityOneEvent, priorityTwoEvent ]
      const sortedRequests = prioritize(testRequests)

      expect( sortedRequests.map( request => request.events[ request.events.length - 1 ].created_at ))
        .to.deep.equal([
          priorityOneEvent.events[ priorityOneEvent.events.length - 1 ].created_at,
          priorityTwoEvent.events[ priorityTwoEvent.events.length - 1 ].created_at,
          priorityThreeEvent.events[  priorityThreeEvent.events.length - 1 ].created_at
        ])
    })
  })
})
