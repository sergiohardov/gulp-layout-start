# Gulp Starter

1. Ensure that you are using Node.js version **18.17.0** or higher.

2. Before using starter, install all dependencies:

```bash
npm install
```

## Commands

This Gulp starter has all in one command:

```bash
npm run start
```

This command will initiate several tasks:

- **Run Develop Mode**: This is the main command. It packs the project for development, starts the watcher, and launches the server. The watcher monitors the following folders/files: `json/**/*.json`, `html/**/*.html`, `scss/**/*.scss`, `js/**/*.js`.

- **Run Build**: Use this command to create a production-ready build with minified and optimized code.

- **Compile Fonts**: Since the watcher doesn't handle fonts, you can use this command to compile fonts separately.

- **Compile Libs**: Similar to fonts, this command compiles all folders/files in folder `/libs/` separately, as the watcher doesn't track them.

- **Compile Images**: Similar to fonts, this command compiles images separately, as the watcher doesn't track them.

## Structure

### /json/

This folder contains only `*.json` files, which are convenient for creating data structures for blocks, sections, pages, etc. You can include data from JSON files in your HTML using Nunjucks like this:

```html
{% set data = '../data/file.json' | json %}
```

### /fonts/

In this folder, you'll find `*.ttf` files. Gulp automatically converts fonts to WOFF and WOFF2 formats. In order to connect the font, you need to use a `mixin` inside the `/scss/_fonts.scss` file:

```sass
@include font("font_name", "file_name", weight, style);
```

### /html/

For html was be installed [nunjucks](https://mozilla.github.io/nunjucks/templating.html "nunjucks"), you can use all him syntax. This folder contains `*.html` files and has two subfolders:

- `/components/`: This folder is for placing components. You can organize the structure as you prefer.

- `/pages/`: Use this folder for page files. You can structure it according to your project needs.

### /scss/

This folder contains `*.scss` files and has subfolder:

- `/components/`: Organize component styles in this folder as required.

- `/style.scss`: This is the main entry point for your styles.

### /js/

You can write in ES6 syntax & using imports/exports. This folder contains `*.js` files and has two subfolders:

- `/components/`: Use this folder for component scripts. Organize it as needed.

- `/script.js`: This is the main entry point for your scripts.

### /img/

In this folder, has two subfolders:

- `/pictures/`: This is where you should save non-vector images: `*.jpg`, `*.jpeg`, `*.png`, `*.gif`, `*.webp`

- `svg`: Place vector images in this folder: `*.svg`

### /libs/

In this folder, you can create any folder and file structure you need. After building, these files will be placed in `assets/libs/`.
