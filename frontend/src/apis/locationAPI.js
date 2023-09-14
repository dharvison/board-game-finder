import axios from "axios";

// https://countrystatecity.in/docs/
const BASE_URL = "https://api.countrystatecity.in/v1";
const X_CSCAPI_KEY = 'NlhBNTg1OFZOVDVSYzJiYjd5ZUNUN1FFUVZNUU50NWRlR21LZnpGNw=='; // TODO move to localfile?

/** Location API Class.
 *
 * Fetch location data
 * 
 * https://countrystatecity.in/docs/
 * 
 */

class LocationApi {

  static async fetchCountries() {
    const config = {
      url: `${BASE_URL}/countries/`,
      headers: {
        'X-CSCAPI-KEY': X_CSCAPI_KEY
      }
    };
    try {
      const countryRes = await axios.get(config.url, config);
      return countryRes.data;
    } catch (err) {
      console.log(config);
      console.error(err);
    }
  }

  static async fetchStates(country) {
    const config = {
      method: 'get',
      url: `${BASE_URL}/countries/${country}/states`,
      headers: {
        'X-CSCAPI-KEY': X_CSCAPI_KEY
      }
    };
    try {
      const stateRes = await axios.request(config);
      stateRes.data.sort(LocationApi.sortName);
      return stateRes.data;
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchCities(country, state) {
    const config = {
      method: 'get',
      url: `${BASE_URL}/countries/${country}/states/${state}/cities`,
      headers: {
        'X-CSCAPI-KEY': X_CSCAPI_KEY
      }
    };
    try {
      const cityRes = await axios.request(config);
      return cityRes.data;
    } catch (err) {
      console.error(err);
    }
  }

  static sortName(a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}

export default LocationApi;
