/*
 * jmeTabpages 1.0.1
 * Copyright (c) 2016 yaobei
 * Date:2016-06-30
 * 功能：iframe子页面通过调用，可以生成tab标签以及刷新iframe区域
 */
(function($){
	//将addTabpages方法合并到jquery的实例对象中
	$.fn.addTabpages = function(options) {
		var defaults = {
			href: '',
			menuName:''
		};
		options = $.extend(defaults, options);
		//滚动到指定选项卡
		function scrollToTab(element) {
		    var marginLeftVal = calSumWidth($(element,parent.document).prevAll()), marginRightVal = calSumWidth($(element,parent.document).nextAll());
		    // 可视区域非tab宽度
		    var tabOuterWidth = calSumWidth($(".content-tabs",parent.document).children().not(".J_menuTabs",parent.document));
		    //可视区域tab宽度
		    var visibleWidth = $(".content-tabs",parent.document).outerWidth(true) - tabOuterWidth;
		    //实际滚动宽度
		    var scrollVal = 0;
		    if ($(".page-tabs-content",parent.document).outerWidth() < visibleWidth) {
		        scrollVal = 0;
		    } else if (marginRightVal <= (visibleWidth - $(element,parent.document).outerWidth(true) - $(element,parent.document).next().outerWidth(true))) {
		        if ((visibleWidth - $(element,parent.document).next().outerWidth(true)) > marginRightVal) {
		            scrollVal = marginLeftVal;
		            var tabElement = element;
		            while ((scrollVal - $(tabElement,parent.document).outerWidth()) > ($(".page-tabs-content",parent.document).outerWidth() - visibleWidth)) {
		                scrollVal -= $(tabElement,parent.document).prev().outerWidth();
		                tabElement = $(tabElement,parent.document).prev();
		            }
		        }
		    } else if (marginLeftVal > (visibleWidth - $(element,parent.document).outerWidth(true) - $(element,parent.document).prev().outerWidth(true))) {
		        scrollVal = marginLeftVal - $(element,parent.document).prev().outerWidth(true);
		    }
		    $('.page-tabs-content',parent.document).animate({
		        marginLeft: 0 - scrollVal + 'px'
		    }, "fast");
		}
		
		//打开一个选项卡菜单
		return this.each(function(){
			var dataUrl = options.href,
			    menuName = options.menuName,
			    flag = true;
			if (dataUrl == undefined || $.trim(dataUrl).length == 0)return false;
			if (menuName == undefined || $.trim(menuName).length == 0)return false;
			// 选项卡菜单已存在
		    $('.J_menuTab',parent.document).each(function () {
		        if ($(this,parent.document).data('id') == dataUrl) {
		        	
		            if (!$(this,parent.document).hasClass('active')) {
		                $(this,parent.document).addClass('active').siblings('.J_menuTab,parent.document').removeClass('active');
		                scrollToTab(this,parent.document);
		                // 显示tab对应的内容区
		                $('.J_mainContent .J_iframe',parent.document).each(function () {
		                    if ($(this,parent.document).data('id') == dataUrl) {
		                        $(this,parent.document).show().siblings('.J_iframe').hide();
		                        return false;
		                    }
		                });
		                
		            }
		            flag = false;
		            return ;            	
		        }
		    });
			
			// 选项卡菜单不存在
		    if (flag) {
		        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="icon-remove-sign"></i></a>';
		        $('.J_menuTab',parent.document).removeClass('active');
	
		        // 添加选项卡对应的iframe
		        var str1 = '<iframe class="J_iframe" name="iframe" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
		        $('.J_mainContent',parent.document).find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
		
		        // 添加选项卡
		        $('.J_menuTabs .page-tabs-content',parent.document).append(str);
		        scrollToTab($('.J_menuTab.active',parent.document));
		    }
		 
   			return false;
		});

	};
	//将addTabpages方法合并到jquery的全局对象中
	$.extend({
		addTabpages: function(options) {
			$("body").addTabpages(options);
		}
	});
	
	
})(jQuery);


