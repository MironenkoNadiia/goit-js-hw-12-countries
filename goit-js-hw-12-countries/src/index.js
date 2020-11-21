import './styles.css';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

import countryList from './templates/country-list.hbs';
import countryCard from './templates/country-card.hbs';
import fetchCountries from './fetchCountries';

const debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('.input'),
  output: document.querySelector('.result'),
};

refs.input.addEventListener('input', debounce(onSearchInput, 500));

function onSearchInput(e) {
  if (!e.target.value) {
    refs.output.innerHTML = '';
    return;
  }
  fetchCountries(e.target.value)
    .then(countries => {
      if (countries.status === 404) {
        return Promise.reject(
          'The country for your request was not found.Please try again',
        );
      }

      if (countries.length > 50) {
        error({
          text: 'Too many matches found.Please enter a more specific query!',
        });
        return;
      }

      countries.length >= 2
        ? renderCountryCard( countryList(countries) )
        : renderCountryCard( countryCard(countries) );
    })
    .catch(err => {
      error({
        text: err,
      });
    });
}

function renderCountryCard(payload) {
refs.output.innerHTML = payload;
}



