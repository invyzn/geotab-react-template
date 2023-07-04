# React Geotab Template

A proof of concept of a "no frills" React application template customized for Geotab, using Webpack to generate a multi-page application (MPA), instead of the ordinary single-page application (SPA).

## Concepts

* Every `FooBar.addin.js` will become a static page `foo-bar.html`, based on `assets/template.html` in the base directory.

* **No** server-side rendering: each HTML page acts like an ordinary small React app.

* **No** router: just standard HTML pages with standard `<a href=""></a>` links for navigation in dev mode.

* The build can be served by any HTTP server; a Node.js server is **not** needed.

* [SASS](https://sass-lang.com) support, with all style files parsed as CSS modules.

## Environment

* Run in development mode at `localhost:3000`:
    * `npm start`

* Generate a production build in the `build` directory:
    * `npm run build`

## TODO
    * Add automatic config generator based on file structure
    * Fix dev tools to allow drive add-in and map addin 
    * Add custom button features
    * Add translation features