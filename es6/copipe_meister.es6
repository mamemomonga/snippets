// vim:ft=javascript

import marked from 'marked';
import escapeHTML from 'escape-html'
import path from 'path'

export default class CopipeMeister {

	constructor(window_obj){
		this.w=window_obj
		this.d=this.w.document
		this.hconf=JSON.parse(this.d.getElementById("copipe-meister-conf").textContent)
		this.dom_contents=this.d.getElementById('contents')
	}
	run() {
		this.w.addEventListener('popstate',(e)=>{
			this.load(this.w.location.hash)
		})
		this.load(this.w.location.hash)
	}

	load(hash){
		let filename=( hash.match('^#\!(.+)$') || ['',''] )[1];
		filename = filename.match('\.md$') ? filename : filename + '/index.md';
		this.current_filename=filename;

		fetch( this.hconf.contents_path+filename )
		.then(  (r) => { return r.text() })
		.then(  (t) => { this.render(t); this.add_events() })
		.catch( (e) => { console.log(e) })
	}
	render(text){
		const renderer=new marked.Renderer();
		renderer.code=(t,l)=>{return this.marked_code(t) }
		renderer.link=(a,t,s)=>{ return this.marked_link(a,t,s) }

		this.dom_contents.innerHTML=marked(text,{renderer:renderer})
		this.dom_contents.style.display='block'

	}
	add_events(){
		Array.from(this.d.getElementsByClassName('el_copy_text')).forEach((d)=>{
			d.addEventListener('click',(e)=>{ this.bt_copy(e.target) })
		})
		Array.from(this.d.getElementsByClassName('el_placeholder')).forEach((d)=>{
			d.addEventListener('change',(e)=>{ this.text_placeholder_change(e.target) })
		})
	}
	parse_code_field(text){
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

	marked_link(href,title,text) {
		const dirname=path.dirname(this.current_filename)
		const m1=href.match(/^\.\/(.+)$/);
		const m2=href.match(/^\.\.\/(.+)?$/);
		if(m1) {
			href=`#!${dirname}/${m1[1]}`
		} else if (m2) {
			const p1=m2[1] || '';
			const f=path.resolve(dirname,`../${p1}`)
			href=`#!${f}`
		}

		return `<a href="${href}" class="el_link">${text}</a>`
	}

	marked_code(text){
		const c=this.parse_code_field(text)
		const code=c.data;
		const language = c.cfg.language ? c.cfg.language : 'none';
		const bt_text  = c.cfg.wrap     ? `コピー (${c.cfg.wrap})` : 'コピー'

		let placeholder="";
		if(c.cfg['placeholder']) {
			placeholder=`<div class="controlform">${c.cfg.placeholder}: <input type="text" class="el_placeholder" placeholder="${c.cfg.placeholder}"></div>`;
		}

		const buf=`<div class="code">${placeholder}
<pre class="codearea"><code data-config='${escapeHTML(c.raw)}'>${escapeHTML(code)}</code></pre>
<pre><code class="copyarea"></code></pre>
<input type="button" class="el_copy_text" value="${bt_text}"><br>
</div>`

		return buf
	}

	node_to_clipboard(node) {
		const s = this.w.getSelection();
		const r = this.d.createRange();
		s.removeAllRanges();
		r.selectNode(node);
		s.addRange(r);
		this.d.execCommand('copy');
	}

	bt_copy(nself) {
		const ncode = nself.parentNode.getElementsByTagName('code')[0]
		const ncp   = nself.parentNode.getElementsByClassName('copyarea')[0]
		const config = JSON.parse(ncode.dataset.config)
		let text=ncode.innerText
		if(config.wrap) {
			text=config.wrap +" << 'END_OF_SNIPPET'\n" + text + "\nEND_OF_SNIPPET\n"
		}
		ncp.innerText=text;

		ncp.style.display="block"
		this.node_to_clipboard(ncp)	

		setTimeout(()=>{
			ncp.innerText=""
			ncp.style.display="none"
		},1000);
	}

	text_placeholder_change(node) {
		var codenode=node.parentNode.parentNode.getElementsByTagName('code')[0];
		var code=codenode.innerHTML;
		if(! codenode.dataset.origcode ) {
			codenode.dataset.origcode=code;
		} else {
			code=codenode.dataset.origcode;
		}
		var code=code.replace(new RegExp(node.placeholder,'mg'),node.value);
		codenode.innerHTML=code;
	}

}

