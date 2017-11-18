// vim:ft=javascript

import marked from 'marked'

export default ()=>{
	const renderer=new marked.Renderer();
	renderer.code=(text,level)=>{
		const lines = text.split('\n');
		const config_text=lines.shift().substr(2);
		const config = JSON.parse(config_text);
		const code=lines.join('\n');
		const language=( config.language ) ? config.language : "bash";

		let bt_text="コピー"
		if(config.wrap) bt_text=`コピー (${config.wrap})`

		let placeholder="";
		if(config['placeholder']) {
			placeholder=`<div class="controlform">${config.placeholder}: <input type="text" onchange="text_placeholder_change(this)" placeholder="${config.placeholder}"></div>`;
		}

		return `<div>${placeholder}<pre class="line-numbers">
<code class="language-${language}" data-config='${config_text}'>${code}</code></pre>
<pre><code class="copyarea"></code></pre>
<input type="button" onclick="bt_copy_range(this)" value="${bt_text}"><br>
</div>`;
	}
	return renderer;
}

