// vim:ft=javascript

// コピペの達人
class CopipeMeister {

	constructor(){}

	node_to_clipboard(node) {
		const s = window.getSelection();
		const r = document.createRange();
		s.removeAllRanges();
		r.selectNode(node);
		s.addRange(r);
		document.execCommand('copy');
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

document.addEventListener('DOMContentLoaded',()=>{
	const cm=new CopipeMeister();
	window['bt_copy_range']=(selfnode)=>{ cm.bt_copy(selfnode) }
	window['text_placeholder_change']=(selfnode)=>{ cm.text_placeholder_change(selfnode) }
});

