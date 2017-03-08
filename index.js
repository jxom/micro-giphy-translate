const { send } = require('micro');
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
    // Lets search for the image with the query that's given...
    const resp = await request({ uri: GIPHY_TRANSLATE_API_URL, qs: { api_key: API_KEY, s: query }, json: true });

    // Does such image even exist with this query??
    const imageUrl = getVal(resp, 'data.images.original.url');
    if (!imageUrl) {
      throw `No results for ${query}`;
    }

    // If it does exist, then redirect the client (appending the image url to the path
    // as we want to persist the image when the URL is shared to others).
    res.setHeader('Location', `/${query}/${encodeURIComponent(imageUrl)}`);
    return send(res, 301, {});
  } catch (e) {
    return e;
  }
}

const handleRequestGiphyImage = async ({ params: { giphyUrl }, res }) => {
  // Request the image!
  const gif = await request({ uri: decodeURIComponent(giphyUrl), json: true });

  // Prepare the browser for an awesome GIF!
  res.setHeader('Content-Type', 'image/gif');
  return gif;
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
  },
  {
    method: 'get',
    path: '/:query/:giphyUrl',
    handler: handleRequestGiphyImage,
  }
]);

module.exports = api;
