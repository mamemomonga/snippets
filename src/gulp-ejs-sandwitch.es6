// vim:ft=javascript

import gutil from 'gulp-util';
import through from 'through2';
import { Buffer } from 'safe-buffer';
import ejs from 'ejs';

import fs from 'fs';

export default (options)=>{

	const template=fs.readFileSync(options.template,'utf-8');

	const transform=function (file, encode, callback){
		if(file.isNull()) { this.push(file); return callback() }
		if(file.isStream()) this.emit('error',
			new gutil.PluginError('gulp-ejs-sandwitch', 'Streaming not supported'));

		const data = Object.assign({}, data, file.data)
		file.contents = new Buffer(
			ejs.render(template,{
				contents: file.contents.toString()
			})
		);
		this.push(file);
		callback();
	}

	const flush=function (callback) {
		callback();
	}

	return through.obj(transform,flush);
}

