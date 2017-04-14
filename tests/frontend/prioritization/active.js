const { Factory, DEFAULT_COACH_ID, OTHER_ID } = require( '../../fixtures/requests' )
const { active, isActive } = require( '../../../frontend/prioritization/active' )

describe( 'active', () => {
  describe( 'when no requests are active', () => {
    it( 'returns array with no active requests', () => {
      const input = [{}].map( item => Factory.request( item ))

      expect( active( input ).filter( request => request.active ).length ).to.equal( 0 )
    })
  })

  describe( 'when a request is active', () => {
    it( 'returns array with one active request', () => {
      const input = [{
        events: [{ data: { claimed_by: DEFAULT_COACH_ID }}]
      }].map( item => Factory.request( item ))

      expect( active( input, DEFAULT_COACH_ID ).filter( request => request.active ).length ).to.equal( 1 )
    })
  })
})

describe( 'isActive', () => {
  describe( 'when request is claimed by me', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({
        events: [{ data: { claimed_by: DEFAULT_COACH_ID } }]
      })

      expect( isActive( testRequest, DEFAULT_COACH_ID )).to.be.true
    })
  })

  describe( 'when request was escalated by me', () => {
    it( 'returns true', () => {
      const testRequest = Factory.request({
        events: [
          { data: { escalated_by: DEFAULT_COACH_ID } },
          { data: { claimed_by: DEFAULT_COACH_ID } }
        ]
      })

      expect( isActive( testRequest, DEFAULT_COACH_ID )).to.be.true
    })
  })

  describe( 'when request is not claimed by me and not escalated by me', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({})

      expect( isActive( testRequest, DEFAULT_COACH_ID )).to.be.false
    })
  })

  describe( 'when request is claimed by another coach', () => {
    it( 'returns false', () => {
      const testRequest = Factory.request({
        events: [{ data: { claimed_by: OTHER_ID }}]
      })

      expect( isActive( testRequest, DEFAULT_COACH_ID )).to.be.false
    })
  })
})