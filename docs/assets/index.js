!function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e)}return o(e,[{key:"node_to_clipboard",value:function(e){var n=window.getSelection(),t=document.createRange();n.removeAllRanges(),t.selectNode(e),n.addRange(t),document.execCommand("copy")}},{key:"bt_copy",value:function(e){var n=e.parentNode.getElementsByTagName("code")[0],t=e.parentNode.getElementsByClassName("copyarea")[0],o=JSON.parse(n.dataset.config),r=n.innerText;o.wrap&&(r=o.wrap+" << 'END_OF_SNIPPET'\n"+r+"\nEND_OF_SNIPPET\n"),t.innerText=r,t.style.display="block",this.node_to_clipboard(t),setTimeout(function(){t.innerText="",t.style.display="none"},3e3)}},{key:"text_placeholder_change",value:function(e){var n=e.parentNode.parentNode.getElementsByTagName("code")[0],t=n.innerHTML;n.dataset.origcode?t=n.dataset.origcode:n.dataset.origcode=t;t=t.replace(new RegExp(e.placeholder,"mg"),e.value);n.innerHTML=t}}]),e}();document.addEventListener("DOMContentLoaded",function(){var e=new r;window.bt_copy_range=function(n){e.bt_copy(n)},window.text_placeholder_change=function(n){e.text_placeholder_change(n)}})}]);