// vim:ft=javascript

import marked from 'marked'
import escapeHTML from 'escape-html'

export default ()=>{
	const renderer=new marked.Renderer();

	const parse_text=(text)=>{
		const lines = text.split('\n')
		const cfgfound = lines[0].match(/^#-- (.+)$/);
		if(cfgfound) {
			lines.shift();
			return {
				cfg:  JSON.parse(cfgfound[1]),
				raw:  cfgfound[1],
				data: lines.join("\n")
			}
		} else {
			return {
				cfg: {},
				raw: "{}",
				data: lines.join("\n")
			}
		}
	}

	renderer.code=(text,level)=>{
		const c=parse_text(text)
		const code=c.data;
		const language=( c.cfg.language ) ? c.cfg.language : "bash";
		const bt_text=(c.cfg.wrap) ? `コピー (${c.cfg.wrap})` : 'コピー'

		let placeholder="";
		if(c.cfg['placeholder']) {
			placeholder=`<div class="controlform">${c.cfg.placeholder}: <input type="text" onchange="text_placeholder_change(this)" placeholder="${c.cfg.placeholder}"></div>`;
		}

		const html=escapeHTML(code);
		return `<div class="code">${placeholder}<pre class="">
<code class="language-${language}" data-config='${c.raw}'>${html}</code></pre>
<pre><code class="copyarea"></code></pre>
<input type="button" onclick="bt_copy_range(this)" value="${bt_text}"><br>
</div>`;
	}
	return renderer;
}

