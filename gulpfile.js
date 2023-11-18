/* Paths */
const paths = {
  domain: "http://domain-name.loc",
  dist: "./dist/",
  src: "./src/",
};

/* Imports */
// Plugins
import fs from "fs";
import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import rename from "gulp-rename";
import prettier from "gulp-prettier";
import browsersync from "browser-sync";

// Reset
import { deleteAsync } from "del";

// Fonts
import ttf2woff2 from "gulp-ttf2woff2";

// HTML
import nunjucks from "nunjucks";
import gulpNunjucks from "gulp-nunjucks";

// SCSS
import dartSass from "sass";
import gulpSass from "gulp-sass";
import cssmin from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import media from "gulp-group-css-media-queries";

// JS
import webpack from "webpack-stream";
import named from "vinyl-named";

// Pictures
import imagemin from "gulp-imagemin";

/* Tasks */
const reset = () => {
  return deleteAsync(paths.dist);
};
const fonts = () => {
  return gulp
    .src(paths.src + "fonts/*.ttf", {})
    .pipe(
      plumber(
        notify.onError({
          title: "FONTS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(ttf2woff2())
    .pipe(gulp.dest(paths.dist + "fonts/"));
};
const html = () => {
  const env = nunjucks.configure(paths.src + "html/components/", {
    autoescape: true,
  });

  // Function for import json files in var exp: set data = '../file.json'
  function importJSON(filePath) {
    const jsonData = fs.readFileSync(paths.src + "html/pages/" + filePath, "utf8");
    return JSON.parse(jsonData);
  }

  // Add function for import json
  env.addFilter("json", importJSON);

  return gulp
    .src(paths.src + "html/pages/**/*.html")
    .pipe(
      plumber(
        notify.onError({
          title: "HTML",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(gulpNunjucks.compile(null, { env }))
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());
};
const scss = () => {
  const sass = gulpSass(dartSass);

  return gulp
    .src(paths.src + "scss/style.scss", { sourcemaps: true })
    .pipe(
      plumber(
        notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(media())
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserList: ["last 3 versions"],
        cascade: true,
      })
    )
    .pipe(gulp.dest(paths.dist + "assets/css/")) // save normal css
    .pipe(cssmin({ level: 0 }))
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(gulp.dest(paths.dist + "assets/css/"))
    .pipe(browsersync.stream());
};
const js = () => {
  return (
    gulp
      .src(paths.src + "js/script.js", { sourcemaps: true })
      .pipe(
        plumber(
          notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      // Save original js
      .pipe(named())
      .pipe(
        webpack({
          mode: "production",
          optimization: {
            minimize: false,
          },
        })
      )
      .pipe(gulp.dest(paths.dist + "assets/js/"))

      // Production js
      .pipe(named())
      .pipe(
        webpack({
          mode: "production",
        })
      )
      .pipe(
        rename({
          extname: ".min.js",
        })
      )
      .pipe(gulp.dest(paths.dist + "assets/js/"))
      .pipe(browsersync.stream())
  );
};
const pictures = () => {
  return (
    gulp
      .src(paths.src + "img/pictures/**/*.{jpg,jpeg,png,gif,webp}")
      .pipe(
        plumber(
          notify.onError({
            title: "IMAGES",
            message: "Error: <%= error.message %>",
          })
        )
      )
      // .pipe(
      //   isBuild,
      //   imagemin({
      //     progressive: true,
      //     svgoPlugins: [{ removeViewBox: false }],
      //     interlaced: true,
      //     optimizationLevel: 3,
      //   })
      // )
      .pipe(gulp.dest(paths.dist + "assets/img/pictures"))
      .pipe(browsersync.stream())
  );
};
const svg = () => {
  return gulp
    .src(paths.src + "img/svg/**/*.svg")
    .pipe(
      plumber(
        notify.onError({
          title: "IMAGES",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(gulp.dest(paths.dist + "assets/img/svg"))
    .pipe(browsersync.stream());
};
const libs = () => {
  return gulp
    .src(paths.src + "libs/**/*.*")
    .pipe(
      plumber(
        notify.onError({
          title: "FILES",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(gulp.dest(paths.dist + "assets/libs/"))
    .pipe(browsersync.stream());
};
const watcher = () => {
  gulp.watch(paths.src + "json/**/*.json", html);
  gulp.watch(paths.src + "html/**/*.html", html);
  gulp.watch(paths.src + "scss/**/*.scss", scss);
  gulp.watch(paths.src + "js/**/*.js", js);
};
const server = () => {
  browsersync.init({
    server: {
      baseDir: paths.dist,
    },
    notify: true,
    port: 3000,
  });
};

/* Commands */
const tasks = gulp.series(reset, fonts, html, scss, js, pictures, svg, libs);

const dev = gulp.series(tasks, gulp.parallel(watcher, server));

gulp.task("dev", dev);
gulp.task("build", tasks);
gulp.task("fonts", fonts);
gulp.task("libs", libs);
gulp.task("images", gulp.series(pictures, svg));
