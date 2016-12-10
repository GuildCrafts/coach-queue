const list = require('../../io/database/seeds/static_data')
const {
  expect,
  mount,
  shallow,
  React,
  App,
  ListCoaches
} = require('../setup')

describe('Testing components', () => {
  describe('<App /> render', () => {
    it('checks if elements in App component render', () => {
      const wrapper = mount(<App />)
      expect(wrapper.find('ul')).to.have.length(1)
      expect(wrapper.find('li')).to.have.length(5)
    })
  })
  describe('<ListCoaches /> render', () => {
    it('tests setting props', () => {
      const wrapper = mount(<ListCoaches list={list} />)
      expect(wrapper.props().list).to.be.defined
      expect(wrapper.props().list).to.eql(list)
      expect(wrapper.find('ul')).to.have.length(1)
      expect(wrapper.find('li')).to.have.length(5)
    })
  })
})
