# Jay's Resume Website Hosted on GitHub Pages

Design is based on [Resume](https://startbootstrap.com/theme/resume/) theme for [Bootstrap](https://getbootstrap.com/) created by [Start Bootstrap](https://startbootstrap.com/).

## Workflow

On successful build on `main`, the static website is pushed to `gh-pages` branch which serves the GitHub page: https://jaygovind-sahu.github.io.

## npm Scripts

- `npm run build` builds the project - this builds assets, HTML, JS, and CSS into `dist`
- `npm run build:assets` copies the files in the `src/assets/` directory into `dist`
- `npm run build:pug` compiles the Pug located in the `src/pug/` directory into `dist`
- `npm run build:scripts` brings the `src/js/scripts.js` file into `dist`
- `npm run build:scss` compiles the SCSS files located in the `src/scss/` directory into `dist`
- `npm run clean` deletes the `dist` directory to prepare for rebuilding the project
- `npm run start:debug` runs the project in debug mode
- `npm start` or `npm run start` runs the project, launches a live preview in your default browser, and watches for changes made to files in `src`

You must have npm installed in order to use this build environment.

#3 Using docker

- `docker build -t jgs` builds the docker image
- `docker run --network host -v `pwd`/src:/app/src jgs` runs the app within docker
