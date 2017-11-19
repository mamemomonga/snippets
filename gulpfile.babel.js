import gulp from 'gulp'
import gutil from 'gulp-util'
import ejs from 'gulp-ejs'
import webserver from 'gulp-webserver'
import webpack from 'webpack-stream'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import fs from 'fs'
import sass from 'gulp-sass'

let production = false

// index
gulp.task('index',()=>{
	const css = production ? fs.readFileSync('./var/prod/index.css') : '';
	const js  = production ? fs.readFileSync('./var/prod/index.js') : '';
	return gulp.src('./ejs/index.ejs')
	.pipe(ejs({
		css: css,
		js: js,
 		production: production,
	},{},{ ext: '.html' }).on('error', gutil.log))
	.pipe( gulp.dest( production ? './' : './var/dev' ));
});

// es6
gulp.task('es6',()=>{
	return gulp.src('./es6/index.es6')
	.pipe(webpack({
		output:  { filename: 'index.js' },
		devtool: production ? undefined : 'inline-source-map',
		plugins: production ? [ new UglifyJSPlugin() ] : [],
		module:  { loaders:[{ test: /\.es6$/, loader:'babel-loader'}]}
	}))
	.pipe( gulp.dest( production ? './var/prod' : './var/dev' ));
})

// sass
gulp.task('sass',()=>{
	return gulp.src('./sass/*.scss')
	.pipe(sass({
		outputStyle: production ? 'compressed' : 'expanded'
	}).on('error',sass.logError))
	.pipe( gulp.dest( production ? './var/prod' : './var/dev' ));
});

// build
gulp.task('build',['es6','sass'],()=>{
	return gulp.start('index')
});

// production: productionモードでのbuild
gulp.task('production',()=>{
	production=true
	gulp.start('build')
	gulp.start('webserver')
});

// webserver
gulp.task('webserver',() => {
    return gulp.src('./')
    .pipe(webserver({
	    liveload: true,
	    directoryListing: true,
	    port: 3000,
		host: '0.0.0.0'
    }));
});

// developemt サーバ
gulp.task('default',['build','webserver'],()=>{
	gulp.watch('./es6/*.es6',     ['es6']);
	gulp.watch('./sass/*.scss',   ['sass']);
	gulp.watch('./ejs/index.ejs', ['index']);
});

