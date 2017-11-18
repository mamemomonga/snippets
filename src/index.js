
function bt_copy_range(selfnode) {
	var node = selfnode.parentNode.getElementsByTagName('code')[0];
	var copyarea = selfnode.parentNode.getElementsByClassName('copyarea')[0]

	copyarea.innerText="-----" + node.innerText + "-----";

	var s = window.getSelection();
	var range = document.createRange();
	s.removeAllRanges();
	range.selectNode(copyarea);
	s.addRange(range);
	document.execCommand('copy');
}

function text_placeholder_change(node) {
	var codenode=node.parentNode.parentNode.getElementsByTagName('code')[0];
	var code=codenode.innerHTML;
	if(! codenode.dataset.origcode ) {
		codenode.dataset.origcode=code;
	} else {
		code=codenode.dataset.origcode;
	}
	var code=code.replace(node.placeholder,node.value);
	codenode.innerHTML=code;
}

