import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './js/fetchCountries';


Notify.init({
  position: 'center-top',
  distance: '50px',
  showOnlyTheLastOne: 'true',
});

const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.querySelector('#search-box'),
  listEL: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(e) {
  let countrySearch = e.target.value;

  fetchCountries(countrySearch)
    .then(data => {
      console.log(data)
      checkData(data);
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
}

function checkData(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length == 1) {
    insertFullInfo(data);
  } else insertShortInfo(data);
}

function createCountryList(item) {
  return `<li class="flag">
             <img src="${item.flags.svg}"></img>
             <h2>${item.name.official}</h2>
          </li>`;
}

function createCountryFullMarkUp(item) {
  return `<li style=" list-style: none;">
        <div class="flag">
            <img src="${
              item.flags.svg
            }" style= "width: 26px; height: 26px;"></img> 
            <h1>${item.name.official}</h1> 
        </div>
        <h4>Capital: ${item.capital}</h4>
        <h4>Population: ${item.population}</h4>
        <h4>Languages: ${Object.values(item.languages)
          .map(language => `${language}`)
          .join(', ')}</h4>
      </li> `;
}

function generateMarkUp(array, markUp) {
  return array.reduce((acc, item) => acc + markUp(item), '');
}

function clearList() {
  refs.listEL.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

function insertFullInfo(array) {
  clearList();
  const result = generateMarkUp(array, createCountryFullMarkUp);
  refs.countryInfoEl.insertAdjacentHTML('beforeend', result);
}

function insertShortInfo(array) {
  clearList();
  const result = generateMarkUp(array, createCountryList);
  refs.listEL.insertAdjacentHTML('beforeend', result);
}
