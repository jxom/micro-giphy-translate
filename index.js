const microApi = require('micro-api');
const fs = require('fs-promise')
const request = require('request-promise').defaults({ encoding: null });
const getVal = require('lodash/get');

const API_KEY = 'dc6zaTOxFJmzC';
const GIPHY_TRANSLATE_API_URL = 'http://api.giphy.com/v1/gifs/translate';

const handleNoSearchQuery = () => {
  return 'Search for a gif by entering your search term in the URL!\n\nE.g. https://gif.now.sh/Batman and robin';
}

const handleSearchGiphyUsingTranslate = async ({ params: { query }, res }) => {
  try {
    const resp = await request({ uri: GIPHY_TRANSLATE_API_URL, qs: { api_key: API_KEY, s: query }, json: true });

    const imageUrl = getVal(resp, 'data.images.original.url');
    if (!imageUrl) {
      throw `No results for ${query}`;
    }

    const gif = await request({ uri: imageUrl, json: true });
    res.setHeader('Content-Type', 'image/gif');
    return gif;
  } catch (e) {
    return e;
  }
}

const api = microApi([
  {
    method: 'get',
    path: '/',
    handler: handleNoSearchQuery,
  },
  {
    method: 'get',
    path: '/:query',
    handler: handleSearchGiphyUsingTranslate,
  }
]);

module.exports = api;
