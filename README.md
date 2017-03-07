# Micro Giphy Translate
A micro-service that returns a random GIF depending on the search term using [Giphy's Translate API](https://github.com/Giphy/GiphyAPI#translate-endpoint).

Visit [https://gif.now.sh/](https://gif.now.sh/)

## Usage

### `GET /`

Display usage info

### `GET /:searchQuery`

Returns a contextual GIF image depending on the search query.

## Deploy
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/jxom/micro-giphy-translate)

```
now jxom/micro-giphy-translate
```
