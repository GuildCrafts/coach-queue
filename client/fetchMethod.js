export default (method, path, values, callback) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const options = {
    method: method,
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    credentials: 'same-origin'
  }

  if (values) {
    options.body = JSON.stringify(values)
  }

  return fetch(path, options)
    .catch(error => console.log("There was an error 🐛", error))
    .then(response => response.json())
    .catch(error => console.log("There was an error 🐛", error))
    .then(callback)
}
