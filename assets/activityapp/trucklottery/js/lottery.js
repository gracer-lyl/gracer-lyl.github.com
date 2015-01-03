;
(function($) {
	var win = $(window);
	var T_float = ['<div class="c-float-popWrap msgMode hide">', '<div class="c-float-modePop">', '<div class="warnMsg hide"></div>', '<div class="content"></div>', '<div class="doBtn hide">', '<button class="ok">确定</button>', '<button class="cancel">取消</button>', '</div>', '</div>', '</div>'].join('');

	var E_float = $(T_float);
	var E_floatMsg = E_float.find('.warnMsg');
	var E_floatContent = E_float.find('.content');
	var E_floatOk = E_float.find('.doBtn .ok');
	var E_floatCancel = E_float.find('.doBtn .cancel');

	var initDom = false;
	var domContainer = 'body';
	var flashTimeoutId;

	function ModePop(options) {
		this._options = $.extend({
				mode: 'msg',
				text: '网页提示',
			},
			options || {});

		this._init();
	}

	$.extend(ModePop.prototype, {
		_init: function() {

			var that = this,
				opt = that._options,
				mode = opt.mode,
				text = opt.text,
				content = opt.content,
				callback = opt.callback,
				background = opt.background;
			// set mode
			var classTxt = E_float.attr('class');
			classTxt = classTxt.replace(/(msg|alert|confirm)Mode/i, mode + 'Mode');
			E_float.attr('class', classTxt);

			// set background
			background && E_float.css('background', background);

			// set text & content
			text && E_floatMsg.html(text);
			content && E_floatContent.html(content);

			E_floatOk.off('click').on('click', function(e) {
				callback.call(that, e, true);
			});
			E_floatCancel.off('click').on('click', function(e) {
				callback.call(that, e, false);
			});

			if (!initDom) {
				initDom = true;
				$(domContainer).append(E_float);
				win.on('resize', function() {
					setTimeout(function() {
							that._pos();
						},
						200);
				});
			}
		},

		_pos: function() {
			var that = this,
				doc = document,
				docEl = doc.documentElement,
				body = doc.body,
				top, left, cW, cH, eW, eH;

			if (!that.isHide()) {
				top = body.scrollTop;
				left = body.scrollLeft;
				cW = docEl.clientWidth;
				cH = docEl.clientHeight;
				eW = E_float.width();
				eH = E_float.height();

				E_float.css({
					top: top + (cH - eH) / 2,
					left: left + (cW - eW) / 2
				});
			}
		},

		isShow: function() {
			return E_float.hasClass('show');
		},

		isHide: function() {
			return E_float.hasClass('hide');
		},

		_cbShow: function() {
			var that = this,
				opt = that._options,
				onShow = opt.onShow;

			E_float.addClass('show');
			// 特殊处理
			var overlayEle = $('.pop-main-wrap');
			if (overlayEle.size() > 0) {
				overlayEle.removeClass('hide');
			} else {
				$(domContainer).append('<div class="pop-main-wrap"></div>');
			}
			onShow && onShow.call(that);
		},

		show: function() {
			var that = this;

			if (flashTimeoutId) {
				clearTimeout(flashTimeoutId);
				flashTimeoutId = undefined;
			}

			if (!that.isShow()) {
				E_float.css('opacity', '0').removeClass('hide');
				that._pos();

				E_float.animate({
						'opacity': '1'
					},
					200, 'linear',
					function() {
						that._cbShow();
					});
			} else {
				that._cbShow();
			}
		},

		_cbHide: function() {
			var that = this,
				opt = that._options,
				onHide = opt.onHide;

			E_float.addClass('hide');
			$('.pop-main-wrap').addClass('hide');
			onHide && onHide.call(that);
		},

		hide: function() {
			var that = this;

			if (!that.isHide()) {
				E_float.css('opacity', 1).removeClass('show');

				E_float.animate({
						'opacity': 0
					},
					200, 'linear',
					function() {
						that._cbHide();
					});
			} else {
				that._cbHide();
			}
		},

		flash: function(timeout) {
			var that = this,
				opt = that._options;
			opt.onShow = function() {
				flashTimeoutId = setTimeout(function() {
						if (flashTimeoutId) {
							that.hide();
						}
					},
					timeout);
			}
			that.show();
		}
	});

	window.Notification = new function() {

		this.simple = function(text, bg, timeout) {
			if (arguments.length == 2) {
				if (typeof arguments[1] == 'number') {
					timeout = arguments[1];
					bg = undefined;
				}
			}

			var pop = new ModePop({
				mode: 'msg',
				text: text,
				background: bg
			});

			pop.flash(timeout || 500);
			return pop;
		}

		this.msg = function(text, options) {
			return new ModePop($.extend({
					mode: 'msg',
					text: text
				},
				options || {}));
		}

		this.alert = function(text, callback, options) {
			return new ModePop($.extend({
					mode: 'alert',
					text: text,
					callback: callback
				},
				options || {}));
		}

		this.confirm = function(text, content, callback, options) {
			return new ModePop($.extend({
					mode: 'confirm',
					text: text,
					content: content,
					callback: callback,
				},
				options || {}));
		}

		this.pop = function(options) {
			return new ModePop(options);
		}
	};
})(window.jQuery);

function sucTPL(message) {
	return '<i class="icon-err"></i>' + message + '<a id="G_close" href="javascript:void(0)" class="btn modal-btn">确定</a>';
}

function errTPL(message) {
	return '<i class="icon-suc"></i><p class="dialog-txt">' + message + '</p><a id="G_close" href="javascript:void(0)" class="btn modal-btn">知道了</a>';
}

function showModal(msg, isSuc) {
	var func = isSuc ? sucTPL : errTPL;
	var TPL = '<div class="dialog"><h4>提示</h4>' + '<div class="content">' + func(msg) + '</div></div>';
	var dialog = Notification.confirm('', TPL, function() {});
	dialog.show();
	$('#G_close').on('click', function(e) {
		e && e.preventDefault();
		dialog.hide();
	});
}

// imageloader

// The ImageLoader namespace
var ImageLoader = {
	/**
	 * Optionally can set an image root, all loaded images will be prefixed with this
	 * image root if it is not null. It doesn't matter if root ends in a trailing slash
	 * or not.
	 */
	root: null,

	/**
	 * Load the images specified by name and call the callback with the loaded images.
	 * @param names
	 *    An array or map of file names. If using an array callback will receive an
	 *    array of loaded images, if using a map callback will receive a map of loaded
	 *    images containing the same keys in the argument map.
	 * @param callback
	 *    A function to call with the loaded images when loading is completed.
	 */
	load: function(names, callback) {
		// Initialize space to hold the loaded images
		var images = names.constructor == Object ? {} : [];
		// Determine how many images need to be loaded
		var toLoad = names.length || Object.keys(names).length;
		// Keep track of how many images have been loaded
		var loaded = 0;

		// Internal function to call when an image is loaded successfully
		var imageLoaded = function() {
			// If every image is loaded and the callback isn't null call the callback
			if (++loaded == toLoad && callback)
				callback(images);
		};

		// File prefix is initially empty
		var prefix = '';

		// If root has been set
		if (this.root) {
			// Ensure root ends with a trailing slash
			if (this.root[this.root.length - 1] != '/')
				this.root += '/';
			// Use root as the prefix
			prefix = this.root;
		}

		// Start loading all of the images
		for (var k in names) {
			images[k] = new Image();
			images[k].src = prefix + names[k];
			images[k].onload = imageLoaded;
		}
	}
};

/**
 * 抽奖
 */

function getQueryByName(name, str) {

	var str = str || window.location.href;
	var qIndex = str.indexOf('?');
	if (qIndex == -1) {
		return null;
	}
	var query = str.substr(qIndex);
	var result = query.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if (result == null || result.length < 1) {
		return "";
	}
	return result[1];

}

function getNumb(count) {
	var num = new Array();
	for (var i = 0; i < 9; i++) {
		var val = Math.ceil(Math.random() * count);
		var isEqu = false;
		for (var idx in num) {
			if (num[idx] == val) {
				isEqu = true;
				break;
			}
		}
		if (isEqu)
			i--;
		else
			num[num.length] = val;
	}
	return num;
}

$(function() {

	var isClicked = false;

	function takeAction(list) {

		var $this = this;

		var winItem = null;
		var otherItems = [];
		if (list.length > 0) {

			$.each(list, function(index, item) {
				if (item.IsChoosen) {
					winItem = item;
				} else {
					otherItems.push(item);
				}
			});

			// current click element

			var $parent = $this.parent();
			var $siblingParents = $parent.siblings();
			var eleList = $this.find(".list");
			eleList.eq(0).addClass("out").removeClass("in");

			eleList.eq(1).find('.prize-rst').addClass('win-rst').find('.money').text(winItem.LuckDrawCost);

			setTimeout(function() {
				eleList.eq(1).addClass("in").removeClass("out");
				$('.lottery-tip').show().find('.tip-monty').text(winItem.LuckDrawCost);
			}, 225);

			// other elements

			$siblingParents.each(function(index, item) {
				item = $(item);
				var curList = item.find('.list');
				curList.eq(0).addClass('out').removeClass('in');

				curList.eq(1).find('.prize-rst').find('.money').text(otherItems[index].LuckDrawCost);

				setTimeout(function() {
					curList.eq(1).addClass('in').removeClass('out');
				}, 300);
			});

		}

	}

	var orderId = window.orderId = getQueryByName('orderid') || '';
	var userId = window.userId = getQueryByName('userid') || '';
	var usertype = window.usertype = getQueryByName('usertype') || '1';

	var toLoad = [
		'bg.jpg',
		'f_bg.png',
		'f_win_bg.png',
		'z_bg.png'
	];

	ImageLoader.root = '/assets/activityapp/trucklottery/img/';

	var randomNumbers = [];

	randomNumbers = (usertype == 1) ? getNumb(32) : getNumb(50);

	console.log(randomNumbers);

	$.each(randomNumbers, function(index, num) {
		var imageName = 'truck_' + usertype + '_' + num + '.png';
		toLoad.push(imageName);
		$('.load-img').eq(index).attr('src', ImageLoader.root + imageName);
	});

	// Load the image
	ImageLoader.load(toLoad, function(loaded) {

		$('.loading-wrap').hide();
		$('.content').show();

		$('.puk-list').addClass('ANI');

		$(".box").bind("click", function() {

			if (isClicked) return;

			var $this = $(this);

			$.ajaxSettings.url = __global_ajax_url;
			$.ajaxSettings.type = "post";
			$.ajaxSettings.dataType = "json";
			$.ajaxSettings.contentType = "application/json";
			$.ajaxSettings.data = '{"orderid":' + orderId + ',"userid":' + userId + ',"usertype":' + usertype + '}';
			$.ajaxSettings.success = function(json) {
				// { "d": {"ErrCode": 1, "ErrMsg": "该订单不可抽奖" } }
				var result = json.d;
				var dataList = [];
				if (!result) return;
				if (result.ErrCode === 0) {
					dataList = result.Data;
					isClicked = true;
					takeAction.call($this, dataList);
				} else {
					alert(result.ErrMsg);
				}
			};
			$.ajaxSettings.error = function() {
				alert('网络异常或者超时，请重新尝试');
			};
			$.ajax();
			return false;
		});

	});


});