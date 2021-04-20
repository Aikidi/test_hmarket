const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const sync = require("browser-sync").create();

// Styles
const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML
const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"));
}

exports.html = html;

//Copy
const copy = (done) => {
  gulp.src([
    "source/fonts/*",
    "source/img/*",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//Clean
const clean = () => {
  return del("build");
}


// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

//Reload
const reload = done => {
  sync.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Build
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy
  )
)

exports.build = build;


exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy
  ),
  gulp.series(
    server, 
    watcher
  )
);