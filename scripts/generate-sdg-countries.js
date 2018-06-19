import countries from 'world-countries';
import axios from 'axios';
import _ from 'lodash';
import flags from '../src/countryFlags';

const isEmoji = process.argv.includes('--emoji');
const isM49 = process.argv.includes('--m49');

let sdg;
const sdgCountries = {};
axios.get('https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List')
  .then(res => {
    sdg = res.data;
    sdg.forEach((item) => {
      const paddedGeoCode = _.padStart(item.geoAreaCode, 3, '0')
      const i = _.find(countries, ['ccn3', paddedGeoCode]);
      //console.log('Finding ', item.geoAreaCode);
      //console.log('Found ', i);
      let enriched;
      if (i) {
        //console.log('FOUND: ', i);
        sdgCountries[paddedGeoCode] = {
          m49: paddedGeoCode,
          name: {
            en: _.trim(item.geoAreaName),
            fr: _.trim(i.translations.fra.common),
          },
          flag: isEmoji ? `flag-${i.cca2.toLowerCase()}` : flags[i.cca2],
        };
      } else {
        //console.log('Did not find country: ', item.geoAreaName);
        sdgCountries[paddedGeoCode] = {
          m49: paddedGeoCode,
          name: {
            en: _.trim(item.geoAreaName),
            fr: _.trim(item.geoAreaName),
          },
          flag: '',
        };
      }
      //console.log(enriched);
      //return enriched;
    })
    if (!isM49) {
      console.log(JSON.stringify(sdgCountries)); // eslint-disable-line
    } else {
      console.log(JSON.stringify(Object.keys(sdgCountries))); // eslint-disable-line
    }
  })
  .catch(err => console.log(err));
