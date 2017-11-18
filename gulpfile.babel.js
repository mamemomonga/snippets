import gulp from 'gulp'
import webserver from 'gulp-webserver'

import marked from 'gulp-marked'

import ejs_sandwitch from './src/gulp-ejs-sandwitch.es6';
import marked_renderer from './src/marked-renderer.es6';

import webpack from 'webpack-stream'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const asset_files=['./src/index.css', './src/prism.js', './src/prism.css']

// es6
gulp.task('es6',()=>{
	return gulp.src('./src/es6/index.es6')
		.pipe(webpack({
			output:  { filename: 'index.js' },
			devtool: 'source-map',
			plugins: [ new UglifyJSPlugin() ],
			module:  { loaders:[{ test: /\.es6$/, loader:'babel-loader'}]}
		}))
		.pipe(gulp.dest('./docs'));
})

// assets
gulp.task('assets',()=>{
	return gulp.src(asset_files,{ base: './src' })
	.pipe(gulp.dest('./docs'))
});

// convert
gulp.task('convert',()=>{
	return gulp.src('./contents/*.md')
	.pipe(marked({ renderer: marked_renderer() }))
	.pipe(ejs_sandwitch({ template: './src/sandwitch.ejs' }))
    .pipe(gulp.dest('./docs/'))
});

// build
gulp.task('build',['convert','assets','es6']);

// webserver
gulp.task('webserver',() => {
    return gulp.src('./')
    .pipe(webserver({
        liveload: true,
        directoryListing: true,
        port: 3000
    }));
});

// server
gulp.task('server',['build','webserver'],()=>{
	gulp.watch('./contents/*.md',['convert']);
	gulp.watch('./src/sandwitch.ejs',['convert']);
	gulp.watch('./src/es6/*.es6',['es6']);
	gulp.watch(asset_files,['assets']);
});
