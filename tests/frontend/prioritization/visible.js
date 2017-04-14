const { Factory, minutesAgo, DEFAULT_COACH_ID, OTHER_ID } = require( '../../fixtures/requests' )
const { THRESHOLD, isMyGoal, isUnclaimed, isPastThreshold,
  isEscalated, lastEventIsNot, notEscalatedByMe
  } = require( '../../../frontend/prioritization/visible' )
const { CLAIM, ESCALATE } = require( '../../../events/requests/constants' )

describe( 'isMyGoal', () => {
  describe( 'when request goal.coach_id matches my id', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({ coach_id: DEFAULT_COACH_ID })

      expect( isMyGoal( testRequest, DEFAULT_COACH_ID )).to.be.true
    })
  })

  describe( 'when request goal.coach_id does not match my id', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({ coach_id: OTHER_ID })

      expect( isMyGoal( testRequest, DEFAULT_COACH_ID )).to.be.false
    })
  })
})

describe( 'isUnclaimed', () => {
  describe( 'when request does not contain any claim events', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({})

      expect( isUnclaimed( testRequest )).to.be.true
    })
  })

  describe( 'when request has been claimed', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({
        events: [ { name: CLAIM } ]
      })

      expect( isUnclaimed( testRequest )).to.be.false
    })
  })
})

describe( 'isPastThreshold', () => {
  describe( 'when request is past the threshold', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({ created_at: minutesAgo( THRESHOLD + 61 )})

      expect( isPastThreshold( testRequest )).to.be.true
    })
  })

  describe( 'when request is under the threshold', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({ created_at: minutesAgo( THRESHOLD - 1 )})

      expect( isPastThreshold( testRequest.created_at )).to.be.false
    })
  })
})

describe( 'isEscalated', () => {
  describe( 'when request has been escalated', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({ events: [
        { name: CLAIM },
        { name: ESCALATE }
      ] })

      expect( isEscalated( testRequest )).to.be.true
    })
  })

  describe( 'when request has not been escalated', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({ events: [ { name: CLAIM } ] })

      expect( isEscalated( testRequest )).to.be.false
    })
  })
})

describe( 'lastEventIsNot', () => {
  describe( 'when the last event was escalate', () => {
    it( 'lastEventIsNot( request, "claim" ) returns true', () => {
      const testRequest = Factory.request({ events: [
        { name: CLAIM },
        { name: ESCALATE }
      ] })

      expect( lastEventIsNot( testRequest, CLAIM )).to.be.true
    })
  })

  describe( 'when the last event was claim', () => {
    it( 'lastEventIsNot( request, "claim" ) returns false', () => {
      const testRequest = Factory.request({ events: [
        { name: ESCALATE },
        { name: CLAIM }
      ] })

      expect( lastEventIsNot( testRequest, CLAIM )).to.be.false
    })
  })
})

describe( 'notEscalatedByMe', () => {
  describe( 'when the request was escalated by me', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({ events: [
        { name: ESCALATE, data: { escalated_by: DEFAULT_COACH_ID } },
        { name: ESCALATE, data: { escalated_by: OTHER_ID } }
      ] })

      expect( notEscalatedByMe( testRequest, DEFAULT_COACH_ID )).to.be.false
    })
  })

  describe( 'when the request was escalated by another coach', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({ events: [
        { name: ESCALATE, data: { escalated_by: OTHER_ID } }
      ] })

      expect( notEscalatedByMe( testRequest, DEFAULT_COACH_ID )).to.be.true
    })
  })

  describe( 'when the request has not been escalated', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({})

      expect( notEscalatedByMe( testRequest, DEFAULT_COACH_ID )).to.be.true
    })
  })
})
