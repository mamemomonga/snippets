# EcmaScript6 ウェブアプリ
gulp + babel + webpackで始めるEcmaScrpit6 Webアプリケーション

### 事前に用意しておくもの

* Node.js 8
* jq

## プロジェクト作成と簡単な実行

	#-- {"wrap":"bash -xeu","placeholder":"MY_APP_NAME"}
	mkdir MY_APP_NAME
	cd MY_APP_NAME 
	npm init -y
	npm install -D babel-core babel-loader babel-preset-env gulp
	cat package.json | jq '.scripts.gulp="gulp"' > tmp && mv tmp package.json

	cat > .babelrc << 'EOS'
	{
  	"presets": [
  	  ["env", {
  	    "targets": {
  	      "browsers": ["last 2 versions", "safari >= 7"]
  	    }
  	  }]
  	]
	}
	EOS

	cat > gulpfile.babel.js << 'EOS'
	import gulp from 'gulp'
	gulp.task('default',()=>{
		console.log('Hello World!')
	});
	EOS

	npm run gulp

Hello World! が表示されたら成功


## シンプルなJavaScriptアプリケーション

	cd MY_APP_NAME

index.html

	#-- {"wrap":"cat > index.html"}
	<!DOCTYPE html>
	<html lang="ja">
	<head>
	<meta charset="utf-8">
	<title></title>
	<meta name="viewport" content="width=device-width">
	<script src="./index.js"></script>
	</head>
	<body>
	<div class="container"></div>
	</body>
	</html>

index.es6

	#-- {"wrap":"cat > index.es6"}
	// vim:ft=javascript
	import HelloWorld from './hello_world.es6';
	window.document.addEventListener('DOMContentLoaded',(e)=>{
	    new HelloWorld(e.target).run();
	});

hello_world.es6

	#-- {"wrap":"cat > hello_world.es6"}
	// vim:ft=javascript
	export default class HelloWorld {
		constructor(document_obj){
			console.log("Start Hello World!")
			// this.d=window.document や this.d=documentでもよい
			this.d=document_obj;
		}
		run(){
			console.log("run Hello World!")
			this.d.title="*** Hello World! ***";
			const c=this.d.getElementsByClassName("container");
			c[0].innerText="こんにちは世界";
		}
	}

gulpfile.babel.js

	#-- {"wrap":"cat > gulpfile.babel.js"}
	import gulp from 'gulp'
	import webpack from 'webpack-stream'
	import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
	import webserver from 'gulp-webserver'
	
	// es6
	gulp.task('es6',()=>{
	    return gulp.src('./index.es6')
	        .pipe(webpack({
	            output:  { filename: 'index.js' },
	            devtool: 'source-map',
	            plugins: [ new UglifyJSPlugin() ],
	            module:  { loaders:[{ test: /\.es6$/, loader:'babel-loader'}]}
	        }))
	        .pipe(gulp.dest('./'));
	})
	
	// webserver
	gulp.task('webserver',() => {
		return gulp.src('./')
		.pipe(webserver({
			liveload: true,
			directoryListing: true,
			host: '0.0.0.0',
			port: 3000
		}));
	});
	
	// default
	gulp.task('default',['es6','webserver'],()=>{
		gulp.watch('./*.es6', ['es6']);
	});

インストールと開始

	#-- {"wrap":"bash -xeu"}
	npm install -D webpack-stream uglifyjs-webpack-plugin gulp-webserver
	npm run gulp

http://localhost:3000/ にアクセスしてページがでてきたら成功

