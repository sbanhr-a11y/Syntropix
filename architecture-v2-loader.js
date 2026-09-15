(function(){
  'use strict';
  var script=document.createElement('script');
  script.src='/architecture-v2-nav.js';
  script.defer=true;
  script.onerror=function(){ console.warn('Syntropix architecture navigation unavailable; core site remains active.'); };
  document.head.appendChild(script);
})();
