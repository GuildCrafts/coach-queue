describe( 'IDM integration', () => {
  it('redirects to idm login', function() {
    chai.request('http://coach-queue.learnersguild.dev')
      .get('/')
      .end( function(err, res) {
        expect( res ).to.redirectTo('http://idm.learnersguild.dev')
    })
  })
})
