describe('database connection', () => {
  it('adds and reads an item to the Players table', () => {
    return db.one("INSERT INTO players (id, handle) VALUES ('blarg', 'olaf') RETURNING *")
      .then( result => expect(result.handle).to.equal('olaf'))
  })
})
