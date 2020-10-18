"use strict"
const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const server = require('browser-sync').create();
const {series} = require('gulp');
const rename = require('gulp-rename');
const minJs = require('gulp-uglify');
const concat = require('gulp-concat');
const imgMin = require('gulp-imagemin');
const svgMin = require('gulp-svgmin');


function Sass(){
    return gulp.src(['src/scss/style.scss'],{base:'scss'})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(server.stream())
}


function Svg(){
    return gulp.src(['src/svg/**/*.svg'])
        .pipe(svgMin())
        .pipe(gulp.dest('build/svg'))
}


function Img(){
    return gulp.src(['src/img/**/*.{png,jpg}'])
        .pipe(imgMin())
        .pipe(gulp.dest('build/img'))
}


function Js() {
    return gulp.src(['src/js/*.js'], {base: 'src'})
        .pipe(plumber())
        .pipe(concat('min.js'))
        .pipe(minJs())
        .pipe(gulp.dest('build/js'))
}


function Server(){
    server.init({server:"./",browser:'chrome'});
    gulp.watch("index.html").on('change', server.reload);
    gulp.watch('src/scss/**/*.scss',gulp.series(Sass,Js));
}



exports.build = series(Sass,Svg,Img,Js);
exports.start = series(Sass,Svg,Img,Js,Server);
