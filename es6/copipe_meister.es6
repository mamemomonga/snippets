// vim:ft=javascript

import marked from 'marked';
import escapeHTML from 'escape-html'
import Prism from 'prismjs'

export default class CopipeMeister {

	constructor(window_obj){
		this.w=window_obj
		this.d=this.w.document
		this.hconf=JSON.parse(this.d.getElementById("copipe-meister-conf").textContent)
	}
	run() {
		this.w.addEventListener('popstate',(e)=>{
			this.load(this.w.location.hash)
		})
		this.load(this.w.location.hash)
	}
	load(hash){

		const hashm=hash.match('^#\!/(.+)$') || ['','index.md'];
		const path=hashm[1]
		this.current_path=path

		fetch( this.hconf.contents_path+'/'+path )
		.then(  (r) => { return r.text() })
		.then(  (t) => { this.render(t); this.add_events() })
		.catch( (e) => { console.log(e) })
	}
	render(text){
		const renderer=new marked.Renderer();
		renderer.code=(t,l)=>{return this.marked_code(t) }
		renderer.link=(a,t,s)=>{ return this.marked_link(a,t,s) }

		const cnt=this.d.getElementsByClassName('container')[0]
		cnt.innerHTML=marked(text,{renderer:renderer})
		Prism.highlightAll(false)

		cnt.style.display='block'

	}
	add_events(){
		Array.from(this.d.getElementsByClassName('el_copy_text')).forEach((d)=>{
			d.addEventListener('click',(e)=>{ this.bt_copy(e.target) })
		})
		Array.from(this.d.getElementsByClassName('el_placeholder')).forEach((d)=>{
			d.addEventListener('change',(e)=>{ this.text_placeholder_change(e.target) })
		})
		Array.from(this.d.getElementsByClassName('el_link')).forEach((d)=>{
			d.addEventListener('click',(e)=>{ this.ev_click_link(e.target) })
		})
	}
	ev_click_link(t) {

		this.w.history.pushState(null,null,this.w.location.href)

		if(!t.hash) return true
		const ts=t.hash.match('^#\!/(.+)$')
		if(!ts) return true

		cnt.style.display='hide'
		this.load(`${ts[1]}.md`)
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
		const hrefm=href.match(/^\.\/(.+)$/);
		if(hrefm) href=`#!/${hrefm[1]}`
		return `<a href="${href}" class="el_link">${text}</a>`
	}

	marked_code(text){
		const c=this.parse_code_field(text)
		const code=c.data;
		const language = c.cfg.language ? c.cfg.language : 'bash';
		const bt_text  = c.cfg.wrap     ? `コピー (${c.cfg.wrap})` : 'コピー'

		let placeholder="";
		if(c.cfg['placeholder']) {
			placeholder=`<div class="controlform">${c.cfg.placeholder}: <input type="text" class="el_placeholder" placeholder="${c.cfg.placeholder}"></div>`;
		}

		const html=escapeHTML(code);
		const buf=`<div class="code">${placeholder}<pre class="">
<code class="language-${language}" data-config='${c.raw}'>${html}</code></pre>
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
		},3000);
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

