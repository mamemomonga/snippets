// vim:ft=javascript
import CopipeMeister from './copipe_meister.es6'

document.addEventListener('DOMContentLoaded',()=>{
	const cm=new CopipeMeister(window);
	window['text_placeholder_change']=(n)=>{ cm.text_placeholder_change(n) }
	cm.run()
})

