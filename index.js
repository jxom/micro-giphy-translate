const { send } = require('micro');
const microApi = require('micro-api');
const microCORS = require('micro-cors')();
const fs = require('fs-promise')
const request = require('request-promise').defaults({ encoding: null });
const getVal = require('lodash/get');

const API_KEY = 'dc6zaTOxFJmzC';
const GIPHY_TRANSLATE_API_URL = 'http://api.giphy.com/v1/gifs/translate';
const giphyGifByIdUrl = (imageId) => `http://media0.giphy.com/media/${imageId}/giphy.gif`;

const handleNoSearchQuery = () => {
  return 'Search for a gif by entering your search term in the URL!\n\nE.g. https://gif.now.sh/Batman and robin';
}

const handleSearchGiphyUsingTranslate = async ({ params: { query }, res }) => {
  try {
    // Lets search for the image with the query that's given...
    const resp = await request({ uri: GIPHY_TRANSLATE_API_URL, qs: { api_key: API_KEY, s: query }, json: true });

    // Does such image even exist with this query??
    const imageId = getVal(resp, 'data.id');
    if (!imageId) {
      throw `No results for ${query}`;
    }

    // If it does exist, then redirect the client (appending the image id to the path
    // as we want to persist the image when the URL is shared to others).
    res.setHeader('Location', `/${query}/${imageId}`);
    return send(res, 301, {});
  } catch (e) {
    return e;
  }
}

const handleRequestGiphyImage = async ({ params: { imageId }, res }) => {
  // Request the image!
  try {
    const gif = await request({ uri: giphyGifByIdUrl(imageId), json: true });
    // Prepare the browser for an awesome GIF!
    res.setHeader('Content-Type', 'image/gif');
    return gif;
  } catch (e) {
    return 'Something went wrong. (╯°□°）╯︵ ┻━┻';
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
  },
  {
    method: 'get',
    path: '/:query/:imageId',
    handler: handleRequestGiphyImage,
  }
]);

module.exports = microCORS(api);
