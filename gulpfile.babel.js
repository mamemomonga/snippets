// ------------------------
// gulpfile.babel.js
// ------------------------

import gulp      from 'gulp'
import log       from 'fancy-log'
import babel     from 'gulp-babel'
import ejs       from 'gulp-ejs'
import sass      from 'gulp-sass'
import htmlmin   from 'gulp-htmlmin'
import webserver from 'gulp-webserver'
import fs        from 'fs'
import webpack   from 'webpack-stream'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const DEVELOPMENT = ( process.env.NODE_ENV != 'development' ) ? false : true
if(DEVELOPMENT) { log.info("DEVELOPMENT MODE") }

// ------------------------
// WebPack
// JavaScriptの連結圧縮
// ------------------------
const webpacks=(()=>{

	const common=(args)=>{
		return webpack({
			node: {
				__dirname: false,
				__filename: false,
				process: false,
			},
			devtool: DEVELOPMENT ? 'source-map' : undefined,
			plugins: DEVELOPMENT ? undefined : [ new UglifyJSPlugin() ],
			mode: DEVELOPMENT ? 'development' : 'production',
			module: { rules: [{
				test: /\.es$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[ "@babel/env", args.preset_env ]
						]
					}
				}
			}]},
			externals: args.server ? args.externals : [],
			output: {
				filename: args.filename,
				libraryTarget: args.server ? 'commonjs2' : undefined
			}
		})
	}
	return {
		// クライアントサイドJS
		client: (filename)=>{
			return common({
				client: true,
				filename: filename,
				// 対象のブラウザバージョン
				preset_env: { targets: { browsers: "last 2 versions" }}
			})
		}
	}
})()

// ------------------------
// tasks
// ------------------------
gulp.task('index',()=>{
	const css = DEVELOPMENT ? '' : fs.readFileSync('./var/prod/index.css');
	const js  = DEVELOPMENT ? '' : fs.readFileSync('./var/prod/index.js');
	return gulp.src('./ejs/index.ejs')
	.pipe(ejs({
		css: css,
		js: js,
 		production: ! DEVELOPMENT,
	},{},{ ext: '.html' }).on('error',log))
	.pipe( gulp.dest( DEVELOPMENT ? './var/dev' : './' ));
})

// es
gulp.task('es',()=>{
	return gulp.src('./es/index.es')
	.pipe(webpacks.client('index.js'))
	.pipe( gulp.dest( DEVELOPMENT ? './var/dev' : './var/prod' ));
})

// sass
gulp.task('sass',()=>{
	return gulp.src('./sass/*.scss')
	.pipe(sass({
		outputStyle: DEVELOPMENT ? 'expanded' : 'compressed'
	}).on('error',sass.logError))
	.pipe( gulp.dest( DEVELOPMENT ? './var/dev' : './var/prod'));
});

gulp.task('build-js-css', gulp.parallel('es','sass'))
gulp.task('build', gulp.series('build-js-css','index'))

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

gulp.task('watch-development',()=>{
	gulp.watch('./es/*.es',       gulp.series('es'));
	gulp.watch('./sass/*.scss',   gulp.series('sass'));
	gulp.watch('./ejs/index.ejs', gulp.series('index'));
	console.log("確認URL: http://localhost:3000/var/dev/index.html")
})

gulp.task('watch-production',()=>{
	console.log("確認URL: http://localhost:3000/index.html")
})

gulp.task('default',gulp.series(
	'build',
	'webserver',
	DEVELOPMENT ? 'watch-development' : 'watch-production')
)

