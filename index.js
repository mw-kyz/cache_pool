$(document).ready(function() {
	init();
});

function init() {
	initCourseList();
}

var initCourseList = (function() {
	var oBtnGroup = document.getElementsByClassName('btn-group')[0],
		oBtnItems = document.getElementsByClassName('btn-item'),
		oList = document.getElementsByClassName('js-list')[0],
		oTpl = document.getElementById('J_itemTpl').innerHTML,
		oLoading = document.getElementsByClassName('loading')[0],
		page = 0,
		t = null,
		cache = {};//将缓存得到的数据，如果再次使用，就不需要再次请求了

	function init() {
		getAjaxCourse();
		bindEvent();
	}

	function bindEvent() {
		oBtnGroup.addEventListener('click', btnClick, false);
	}

	function btnClick(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			oParent = tar.parentNode,
			className = oParent.className,
			indexOf = Array.prototype.indexOf,
			thisIdx = -1;

		if(className === 'btn-item') {
			thisIdx = indexOf.call(oBtnItems, oParent);
			var len = oBtnItems.length;

			page = thisIdx;
			data = Array.prototype.slice.call(oBtnItems);
			
			cache[page] ? getCacheCourse() : getAjaxCourse();

			data.forEach(function(elem) {
				elem.className = 'btn-item';
			});

			oParent.className += ' cur';
		}

	}

	function getCacheCourse() {
		var data = cache[page];
		render(data);
	}

	function getAjaxCourse() {
		ajaxReturn({
			url: APIs.getCourses,
			data: {
				page: page
			},
			success: function(data) {
				cache[page] = data;
				oLoading.style.display = 'block';
				t = setTimeout(function() {
					render(data);
					oLoading.style.display = 'none';
				}, 500);
						console.log(data);
			},
			error: function() {
				alert('获取数据失败');
			}
		});
	}

	function render(data) {
		var list = '';

		data.forEach(function(elem) {
			// 由于获取不到图片，所以模拟图片名
			var folder = Math.floor(Math.random() * 16 + 1);
			list += oTpl.replace(/{{(.*?)}}/g, function(node, key) {
				return {
					folder: folder,
					classname: elem.classname,
					name: elem.name,
					watched: elem.watched
				}[key];
			});
		});

		oList.innerHTML = list;

	}

	return function() {
		init();
	}
})();

var APIs = {
	getCourses: 'http://study.jsplusplus.com/Lfcourses/getCourses'
}

function ajaxReturn(opt) {
	$.ajax({
		url: opt.url,
		type: 'POST',
		dataType: 'JSON',
		data: opt.data,
		timeout: 100000,
		success: opt.success,
		error: opt.error
	});
}