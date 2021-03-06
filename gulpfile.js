var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var workbox = require('workbox-build');
var deploy = require('gulp-gh-pages');
var purify = require('gulp-purifycss');
var gcmq = require('gulp-group-css-media-queries');
var inlinesource = require('gulp-inline-source');
var responsive = require('gulp-responsive');

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app',
      open: false
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

gulp.task('babel', function() {
  return gulp.src('app/es6/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/es6/*.js', ['babel']);
  gulp.watch('app/*.html', browserSync.reload);
})

// Optimization Tasks 
// ------------------

// Optimizing CSS, JavaScript and HTML
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(inlinesource())
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('dist'));
});

// Remove unused CSS
gulp.task('unusedcss', function() {
  return gulp.src('app/css/normalize.css')
    .pipe(purify(['app/index.html']))
    .pipe(gulp.dest('app/css'));
});

// Combine Media Queries
gulp.task('gcmq', function () {
  gulp.src('app/css/style.css')
    .pipe(gcmq())
    .pipe(gulp.dest('app/css'));
});

// Inlining Resources
gulp.task('inlinesource', function () {
  return gulp.src('src/index.html')
      .pipe(inlinesource())
      .pipe(gulp.dest('./out'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('resize-images', function() {
  return gulp.src('app/images/*.png')
    .pipe(responsive({
      '*.png': {
        width: 85
      }
    }, {
      progressive: true
    }))
    .pipe(gulp.dest('app/images'));
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Service Worker
gulp.task('generate-service-worker', () => {
  return workbox.generateSW({
    globDirectory: 'dist',
    globPatterns: [
      '**/*.{html,css,js,png,jpg}'
    ],
    swDest: `dist/sw.js`,
    clientsClaim: true,
    skipWaiting: true
  }).then(({warnings}) => {
    // In case there are any warnings from workbox-build, log them.
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
});

// Manifest
gulp.task('manifest', function() {
  return gulp.src('app/manifest.json')
    .pipe(gulp.dest('dist'));
})

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'babel', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    ['sass', 'babel', 'unusedcss'],
    'gcmq', 'images', 'manifest',
    'useref',
    'generate-service-worker',
    callback
  )
});

gulp.task('deploy', function () {
  return gulp.src("dist/**/*")
    .pipe(deploy())
});