export  function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name.trim()}`).then(
    response => response.json()
  );
}
