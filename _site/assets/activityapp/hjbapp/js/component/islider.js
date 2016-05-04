define("iSlider",[],function(){var e=function(e){if(!e.dom)throw new Error("dom element can not be empty!");if(!e.data||!e.data.length)throw new Error("data must be an array and must have more than one element!");this._opts=e,this._setting(),this._renderHTML(),this._bindHandler()};return e.prototype._setting=function(){var e=this._opts;this.wrap=e.dom,this.data=e.data,this.type=e.type||"pic",this.isVertical=e.isVertical||!1,this.onslide=e.onslide,this.onslidestart=e.onslidestart,this.onslideend=e.onslideend,this.onslidechange=e.onslidechange,this.duration=e.duration||2e3,this.log=e.isDebug?function(e){console.log(e)}:function(){},this.axis=this.isVertical?"Y":"X",this.width=this.wrap.clientWidth,this.height=this.wrap.clientHeight,this.ratio=this.height/this.width,this.scale=e.isVertical?this.height:this.width,this.sliderIndex=this.sliderIndex||0,this.data.length<2?(this.isLooping=!1,this.isAutoPlay=!1):(this.isLooping=e.isLooping||!1,this.isAutoplay=e.isAutoplay||!1),this.isAutoplay&&this.play(),this._setUpDamping(),this._animateFunc=e.animateType in this._animateFuncs?this._animateFuncs[e.animateType]:this._animateFuncs["default"],this._setPlayWhenFocus()},e.prototype._setPlayWhenFocus=function(){var e=this;window.addEventListener("focus",function(){e.isAutoplay&&e.play()},!1),window.addEventListener("blur",function(){e.pause()},!1)},e.prototype._animateFuncs={"default":function(e,t,n,r,i){e.style.webkitTransform="translateZ(0) translate"+t+"("+(i+n*(r-1))+"px)"},rotate:function(e,t,n,r,i){var s=t=="X"?"Y":"X",o=Math.abs(i),u=window.getComputedStyle(this.wrap.parentNode,null).backgroundColor;this.isVertical&&(i=-i),this.wrap.style.webkitPerspective=n*4,r==1?e.style.zIndex=n-o:e.style.zIndex=i>0?(1-r)*o:(r-1)*o,e.style.backgroundColor=u||"#333",e.style.position="absolute",e.style.webkitBackfaceVisibility="hidden",e.style.webkitTransformStyle="preserve-3d",e.style.webkitTransform="rotate"+s+"("+90*(i/n+r-1)+"deg) translateZ("+.888*n/2+"px) scale(0.888)"},flip:function(e,t,n,r,i){var s=t=="X"?"Y":"X",o=window.getComputedStyle(this.wrap.parentNode,null).backgroundColor;this.isVertical&&(i=-i),this.wrap.style.webkitPerspective=n*4,i>0?e.style.visibility=r>1?"hidden":"visible":e.style.visibility=r<1?"hidden":"visible",e.style.backgroundColor=o||"#333",e.style.position="absolute",e.style.webkitBackfaceVisibility="hidden",e.style.webkitTransform="translateZ("+n/2+"px) rotate"+s+"("+180*(i/n+r-1)+"deg) scale(0.875)"},depth:function(e,t,n,r,i){var s=t=="X"?"Y":"X",o=(4-Math.abs(r-1))*.15;this.wrap.style.webkitPerspective=n*4,r==1?e.style.zIndex=100:e.style.zIndex=i>0?1-r:r-1,e.style.webkitTransform="scale("+o+", "+o+") translateZ(0) translate"+t+"("+(i+1.3*n*(r-1))+"px)"},tear:function(e,t,n,r,i){var s=t=="X"?"Y":"X",o=1-Math.abs(r-1)*.2;this.wrap.style.webkitPerspective=n*4,r==1?e.style.zIndex=100:e.style.zIndex=i>0?1-r:r-1,e.style.webkitTransform="scale("+o+", "+o+") translateZ(0) translate"+t+"("+(i+n*(r-1))+"px)"}},e.prototype._setUpDamping=function(){var e=this.scale>>1,t=e>>1,n=t>>2;this._damping=function(r){var i=Math.abs(r),s;return i<e?s=i>>1:i<e+t?s=t+(i-e>>2):s=t+n+(i-e-t>>3),r>0?s:-s}},e.prototype._renderItem=function(e){var t,n,r=this.data.length;return this.isLooping?e<0?t=this.data[r+e]:e>r-1?t=this.data[e-r]:t=this.data[e]:t=this.data[e]||{empty:!0},t.empty?"":(this.type==="pic"?n=t.height/t.width>this.ratio?'<img height="'+this.height+'" src="'+t.content+'">':'<img width="'+this.width+'" src="'+t.content+'">':this.type==="dom"?n='<div style="height:'+t.height+";width:"+t.width+';">'+t.content+"</div>":this.type==="overspread"&&(n=this.ratio<1?'<div style="height: 100%; width:100%; background:url('+t.content+") center no-repeat; background-size:"+this.width+'px auto;"></div>':'<div style="height: 100%; width:100%; background:url('+t.content+") center no-repeat; background-size: auto "+this.height+'px;"></div>'),n)},e.prototype._renderHTML=function(){var e;this.outer?(this.outer.innerHTML="",e=this.outer):e=document.createElement("ul"),e.style.width=this.width+"px",e.style.height=this.height+"px",this.els=[];for(var t=0;t<3;t++){var n=document.createElement("li");n.style.width=this.width+"px",n.style.height=this.height+"px",this._animateFunc(n,this.axis,this.scale,t,0),this.els.push(n),e.appendChild(n),!this.isVertical||this._opts.animateType!="rotate"&&this._opts.animateType!="flip"?n.innerHTML=this._renderItem(t-1+this.sliderIndex):n.innerHTML=this._renderItem(1-t+this.sliderIndex)}this.outer||(this.outer=e,this.wrap.appendChild(e))},e.prototype._slide=function(e){var t=this.data,n=this.els,r=this.sliderIndex+e;t[r]?this.sliderIndex=r:this.isLooping?this.sliderIndex=e>0?0:t.length-1:e=0,this.log("pic idx:"+this.sliderIndex);var i;!this.isVertical||this._opts.animateType!="rotate"&&this._opts.animateType!="flip"?e>0?(i=n.shift(),n.push(i)):e<0&&(i=n.pop(),n.unshift(i)):e>0?(i=n.pop(),n.unshift(i)):e<0&&(i=n.shift(),n.push(i)),e!==0&&(i.innerHTML=this._renderItem(r+e),i.style.webkitTransition="none",i.style.visibility="hidden",setTimeout(function(){i.style.visibility="visible"},200),this.onslidechange&&this.onslidechange(this.sliderIndex));for(var s=0;s<3;s++)n[s]!==i&&(n[s].style.webkitTransition="all .3s ease"),this._animateFunc(n[s],this.axis,this.scale,s,0);this.isAutoplay&&this.sliderIndex===t.length-1&&!this.isLooping&&this.pause()},e.prototype._bindHandler=function(){var e=this,t=e.scaleW,n=e.outer,r=e.data.length,i=function(t){e.pause(),e.onslidestart&&e.onslidestart(),e.log("Event: beforeslide"),e.startTime=(new Date).getTime(),e.startX=t.targetTouches[0].pageX,e.startY=t.targetTouches[0].pageY;var n=t.target;while(n.nodeName!="LI"&&n.nodeName!="BODY")n=n.parentNode;e.target=n},s=function(t){t.preventDefault(),e.onslide&&e.onslide(),e.log("Event: onslide");var n=e.axis,r=t.targetTouches[0]["page"+n]-e["start"+n];!e.isLooping&&(r>0&&e.sliderIndex===0||r<0&&e.sliderIndex===e.data.length-1)&&(r=e._damping(r));for(var i=0;i<3;i++){var s=e.els[i];s.style.webkitTransition="all 0s",e._animateFunc(s,n,e.scale,i,r)}e.offset=r},o=function(t){t.preventDefault();var n=e.scale/2,r=e.offset,i=(new Date).getTime();n=i-e.startTime>300?n:14,r>=n?e._slide(-1):r<-n?e._slide(1):e._slide(0),e.isAutoplay&&e.play(),e.offset=0,e.onslideend&&e.onslideend(),e.log("Event: afterslide")},u=function(t){setTimeout(function(){e.reset(),e.log("Event: orientationchange")},100)};n.addEventListener("touchstart",i),n.addEventListener("touchmove",s),n.addEventListener("touchend",o),window.addEventListener("orientationchange",u)},e.prototype.reset=function(){this.pause(),this._setting(),this._renderHTML(),this.isAutoplay&&this.play()},e.prototype.play=function(){var e=this,t=this.duration;clearInterval(this.autoPlayTimer),this.autoPlayTimer=setInterval(function(){e._slide(1)},t)},e.prototype.pause=function(){clearInterval(this.autoPlayTimer)},e.prototype.extend=function(t){var n=e.prototype;Object.keys(t).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))})},e});