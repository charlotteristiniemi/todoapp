var gulp = require('gulp');  
var nodemon = require('gulp-nodemon');  
// var sass = require('gulp-ruby-sass');  
var autoprefixer = require('gulp-autoprefixer');  
// var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload'); 
var sass = require('gulp-sass');


/* Compile and copy scss to css, plus livereload*/
// gulp.task('scss', function() {  
//   return sass('public/scss/*.scss', { style: 'expanded' })
//     .pipe(autoprefixer('last 2 version'))
//     .pipe(gulp.dest('public/css'))
//     .pipe(livereload());
// });

// Sass compiler and copy
gulp.task('scss', function () {
  return gulp.src(['./public/scss/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

/* Livereload scripts */
gulp.task('scripts', function() {  
  return gulp.src('public/js/*.js')
    .pipe(livereload());
});

/* Livereload view */
gulp.task('ejs',function(){  
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

/* Watch for change in client code */
gulp.task('watch', function() {  
    livereload.listen();
    gulp.watch('public/scss/*.scss', ['scss']);
    gulp.watch('public/js/*.js', ['scripts']);
    gulp.watch('views/**/*.ejs', ['ejs']);
});

/* Use nodemon to restart server if change was made, ignore public folder */
gulp.task('server',function(){  
    nodemon({
        'script': 'server.js',
        'ignore': 'public/js/*.js'
    });
});

/* Helper task to run multiple tasks. To run on cammand line: gulp serve */
gulp.task('default', ['server','scss', 'scripts', 'ejs', 'watch']);  




// var gulp = require('gulp');
// var uglify = require('gulp-uglify');
// var sass = require('gulp-sass');
// var connect = require('gulp-connect');

// // Dev tasks

// gulp.task('connect', function () {
//   connect.server({
//     name: 'gulp-test',
//     root: ['dev'],
//     port: 9000,
//     livereload: true
//   });
// });

// // Sass compiler and copy
// gulp.task('sass', function () {
//   return gulp.src(['./public/scss/*.scss'])
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./public/css'))
//     .pipe(connect.reload());
// });

// // EJS reload
// gulp.task('ejs', function () {
//   gulp.src(['./views/*.ejs'])
//     .pipe(connect.reload());
// });

// // EJS reload
// gulp.task('ejs-layouts', function () {
//   gulp.src(['./views/layouts/*.ejs'])
//     .pipe(connect.reload());
// });

// // Javascript reload
// gulp.task('js', function () {
//   gulp.src(['./public/js/*.js'])
//     .pipe(connect.reload());
// });

// // Routes reload
// gulp.task('routes', function () {
//   gulp.src(['./routes/*.js'])
//     .pipe(connect.reload());
// });

// // Server reload
// gulp.task('server', function () {
//   gulp.src(['./*.js'])
//     .pipe(connect.reload());
// });

// // Img copy copy
// // gulp.task('img', function () {
// //   gulp.src(['./src/img/*'])
// //     .pipe(connect.reload());
// // });

// //watch html scss js img
// gulp.task('watch', function(){
//   gulp.watch('./public/scss/*.scss', ['sass']);
//   gulp.watch('./public/js/*.js', ['js']);
//   gulp.watch('./views/*.ejs', ['ejs']);
//   // gulp.watch('./public/img/*', ['img']);
// });

// // Build tasks

// // gulp.task('build', function(){
// //   gulp.src('./src/js/*.js')
// //     .pipe(uglify())
// //     .pipe(gulp.dest('./build/js'));
// // });


// gulp.task('default', ['sass', 'server', 'ejs', 'ejs-layouts', 'routes', 'js', 'connect', 'watch']);