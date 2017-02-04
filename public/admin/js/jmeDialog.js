/*
 * jmeDialog 3.0.0
 * Copyright (c) 2016 yaobei
 * Date:2016-07-21
 * 主要是对Bootstrap V3模态窗口进行二次封装
 * 集成了模态窗口、确认提示窗口、删除提示窗口、Alert提示框
 * 说明：实现了弹出的模态窗口再次弹出其他窗口功能,解决了弹出窗直接的相互冲突
 */
(function($) {
	//模态窗口
	$.fn.jmeDialog = function(options) {
		var defaults = {
			title: '标题',
			content: '<p>内容</p>',
			url: null,
			isHaveButton:null,
			height:'',
			width:'',
			bootstrapModalOption: { keyboard: true},
			dialogShow: function() {},
			dialogShown: function() {},
			dialogHide: function() {},
			dialogHidden: function() {},
			dialogConfirm: function() {}
		};
		options = $.extend(defaults, options);
		var modalID = '';
		//防止模态窗口未全部加载时，按回车键出现多个重叠窗口
		$(document).keydown(function(event){   
	          if (event.keyCode == 13) {     
	              $('.modal-content').each(function() {       
	                  event.preventDefault();     
	              });  
	          }
	     });
		//生成惟一ID
		function random(a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		}
		function getModalID() {
			return "jmeDialog-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}
		function getConfirmID() {
			return "jmeConfirmId-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}

		return this.each(function() {
			var obj = $(this);
			modalID = getModalID();
			confirmID = getConfirmID();
			
			var tmpHtml = '<div class="modal fade modal_click" id="{ID}" role="dialog" aria-hidden="true" data-backdrop="static" tabindex="-1"><div class="modal-dialog modal-size" style="left:50%;"><div class="modal-content"><div class="modal-header" style="background-color:#337ab7;color:#FFFFFF;"><button type="button" class="close" data-dismiss="modal" style="text-decoration:none;outline:none;font-size:26px;color:#FFFFFF;opacity:1;"><span aria-hidden="true">&times;</span></button><h6 class="modal-title" style="font-size:16px;">{title}</h6></div><div class="modal-body modalbody-size" style="overflow:auto;"></div><div class="modal-footer" style="border-top:none;">{footer}</div></div></div></div>';
			var buttonHtml = '';
			var buttonHtmlOne = '<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration: none;outline: none;"><span class="icon-remove" style="font-size:16px;"></span> 关闭</button>';
			var buttonHtmlTwo = '<button class="btn btn-primary" id="{confirmID}" style="text-decoration: none;outline: none;"><span class="icon-ok" style="font-size:16px;"></span> 确定</button>&nbsp;&nbsp;<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration: none;outline: none;"><span class="icon-remove" style="font-size:16px;"></span> 关闭</button>';

			tmpHtml = tmpHtml.replace(/{ID}/g, modalID).replace(/{title}/g, options.title);
			buttonHtmlTwo = buttonHtmlTwo.replace(/{confirmID}/g, confirmID);
			//modal-footer部分的内容条件判断
			if(options.isHaveButton == true){
				tmpHtml = tmpHtml.replace(/{footer}/g, buttonHtmlTwo);
			} else 
				if(options.isHaveButton == false) {
				tmpHtml = tmpHtml.replace(/{footer}/g, buttonHtml);
			}
			else {
				tmpHtml = tmpHtml.replace(/{footer}/g, buttonHtmlOne);
			}
			obj.append(tmpHtml);
			//modal-body部分的内容条件判断
			if(options.url){
				$('.modal-body',$('#'+modalID)).load(options.url)
			} else {
				$('.modal-body',$('#'+modalID)).append(options.content);
			}
			//设置模态窗口尺寸
			if(options.width) {
				$('.modal-size',$('#'+modalID)).css("width",options.width);
				var width = $('.modal-size',$('#'+modalID)).outerWidth();
				$('.modal-size',$('#'+modalID)).css("margin-left",(-(width/2)+'px'));
			} else {
				$('.modal-size',$('#'+modalID)).css("left","0px");
			}
			if(options.height) {
				$('.modalbody-size',$('#'+modalID)).css("height",options.height);
			} else {}			
			//当按下确认按钮时触发事件
			$('#'+confirmID).on("click",function(){
				options.dialogConfirm(modalID);
//				$('.modal_click').modal('hide');//将关闭全部窗口
//				$('#'+modalID).modal('hide');  //一次只能关闭一个窗口
			});

			var modalObj = $('#' + modalID);
			//点击按钮触发弹出窗事件,在调用 show 方法后触发
			modalObj.on('show.bs.modal', function() {
				$(this).blur();
				options.dialogShow();
				//为模态对话框添加拖拽
				$(".modal-dialog",$('#'+modalID)).draggable({
				    handle: ".modal-header" 	
				});
			});
			//当模态框对用户可见时触发（将等待 CSS过渡效果完成）
			modalObj.on('shown.bs.modal', function() {
				options.dialogShown();
			});
			//点击关闭按钮或点击顶部x，关闭弹出窗事件,当调用 hide 实例方法时触发
			modalObj.on('hide.bs.modal', function() {
				options.dialogHide();
			});
			//当模态框完全对用户隐藏时触发
			modalObj.on('hidden.bs.modal', function() {
				options.dialogHidden();
				modalObj.remove();
			});
			modalObj.modal(options.bootstrapModalOption);
		});
	};
	$.extend({
		jmeDialog: function(options) {
			$("body").jmeDialog(options);
		}
	});
})(jQuery);

(function($) {
	//确认窗口
	$.fn.jmeConfirm = function(options) {
		var defaults = {
			title: '温馨提示',
			content: '是否进行删除？',
			height:'',
			width:'300px',
			bootstrapModalOption: { keyboard: true},
			dialogShow: function() {},
			dialogShown: function() {},
			dialogHide: function() {},
			dialogHidden: function() {},
			dialogConfirm: function() {}
		};
		options = $.extend(defaults, options);
		var modalID = '';
		//防止模态窗口未全部加载时，按回车键出现多个重叠窗口
		$(document).keydown(function(event){   
	          if (event.keyCode == 13) {     
	              $('.modal-content').each(function() {       
	                  event.preventDefault();     
	              });  
	          }
	     });
		//生成惟一ID
		function random(a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		}
		function getModalID() {
			return "jmeConfirm-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}
		function getConfirmID() {
			return "jmeConfirmId-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}

		return this.each(function() {
			var obj = $(this);
			modalID = getModalID();
			confirmID = getConfirmID();
			
			var tmpHtml = '<div class="modal fade modal_click" id="{ID}" role="dialog" aria-hidden="true" data-backdrop="static" tabindex="-1"><div class="modal-dialog modal-size" style="left:50%;"><div class="modal-content"><div class="modal-header" style="padding: 10px 15px;"><button type="button" class="close" data-dismiss="modal" style="text-decoration:none;outline:none;font-size:26px;opacity:1;"><span aria-hidden="true">&times;</span></button><h6 class="modal-title" style="font-size:16px;"><i class="icon-info-sign" style="font-size:18px;"></i> {title}</h6></div><div class="modal-body modalbody-size" style="overflow:auto;">{content}</div><div class="modal-footer" style="padding:10px 15px;"><button class="btn btn-success" id="confirmID" style="text-decoration: none;outline: none;"><span class="icon-ok" style="font-size:16px;"></span> 确定</button>&nbsp;&nbsp;<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration: none;outline: none;"><span class="icon-remove" style="font-size:16px;"></span> 取消</button></div></div></div></div>';
			
			tmpHtml = tmpHtml.replace(/{ID}/g, modalID).replace(/{title}/g, options.title).replace(/{content}/g, options.content);
			obj.append(tmpHtml);
			//设置模态窗口尺寸
			if(options.width) {
				$('.modal-size',$('#'+modalID)).css("width",options.width);
				var width = $('.modal-size',$('#'+modalID)).outerWidth();
				$('.modal-size',$('#'+modalID)).css("margin-left",(-(width/2)+'px'));
			} else {
				$('.modal-size',$('#'+modalID)).css("left","0px");
			}
			if(options.height) {
				$('.modalbody-size',$('#'+modalID)).css("height",options.height);
			} else {}			
			//当按下确认按钮时触发事件
			$("#confirmID").on("click",function(){
				options.dialogConfirm(modalID);
			});

			var modalObj = $('#' + modalID);
			
			//点击按钮触发弹出窗事件,在调用 show 方法后触发
			modalObj.on('show.bs.modal', function() {
				options.dialogShow();
			});
			//当模态框对用户可见时触发（将等待 CSS过渡效果完成）
			modalObj.on('shown.bs.modal', function() {
				options.dialogShown();
			});
			//点击关闭按钮或点击顶部x，关闭弹出窗事件,当调用 hide 实例方法时触发
			modalObj.on('hide.bs.modal', function() {
				options.dialogHide();
			});
			//当模态框完全对用户隐藏时触发
			modalObj.on('hidden.bs.modal', function() {
				options.dialogHidden();
				modalObj.remove();
			});	
			modalObj.modal(options.bootstrapModalOption);
		});
	};
	$.extend({
		jmeConfirm: function(options) {
			$("body").jmeConfirm(options);
		}
	});
})(jQuery);
(function($) {
	//确认删除窗口
	$.fn.jmeDeleteTip = function(options) {
		var defaults = {
			title: '温馨提示',
			content: '是否删除全部？',
			deleteAllButton:false,
			deleteSingleButton:false,
			deleteAllButtonValue:'删除全部',
			deleteSingleButtonValue:'删除单个',
			height:'',
			width:'400px',
			bootstrapModalOption: { keyboard: true},
			dialogShow: function() {},
			dialogShown: function() {},
			dialogHide: function() {},
			dialogHidden: function() {},
			deleteAllButtonTip:function(){},  //删除全部按钮点击事件
			deleteSingleButtonTip:function(){}  //删除单个按钮点击事件
		};
		options = $.extend(defaults, options);
		var modalID = '';
		//生成惟一ID
		function random(a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		}
		//获取模态窗口id
		function getModalID() {
			return "jmeDeleteTip-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}
		//获取删除全部按钮id
		function getDeleteAllButtonTipID() {
			return "jmeDeleteAllButtonTipId-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}
		//获取删除单个按钮id
		function getDeleteSingleButtonTipID() {
			return "jmeDeleteSingleButtonTipId-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}

		return this.each(function() {
			var obj = $(this);
			modalID = getModalID();
			DeleteAllButtonTipID = getDeleteAllButtonTipID();
			DeleteSingleButtonTipID = getDeleteSingleButtonTipID();
			
			console.log(options.deleteAllButtonValue);
			
			console.log(options.deleteSingleButtonValue);
			
			var tmpHtml = '<div class="modal fade modal_click" id="{ID}" role="dialog" aria-hidden="true" data-backdrop="static" tabindex="-1"><div class="modal-dialog modal-size" style="left:50%;"><div class="modal-content"><div class="modal-header" style="padding: 10px 15px;"><button type="button" class="close" data-dismiss="modal" style="text-decoration:none;outline:none;font-size:26px;opacity:1;"><span aria-hidden="true">&times;</span></button><h6 class="modal-title" style="font-size:16px;"><i class="icon-info-sign" style="font-size:18px;"></i> {title}</h6></div><div class="modal-body modalbody-size" style="overflow:auto;">{content}</div><div class="modal-footer" style="padding:10px 15px;"></div></div></div></div>';
			//只有取消按钮
			var buttonHtml = '<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration: none;outline: none;"><span class="icon-remove" style="font-size:16px;"></span> 取消</button>';
			//删除全部按钮
			var buttonHtmldeleteAll = '<button class="btn btn-danger" id="DeleteAllButtonTipID" style="text-decoration:none;outline:none;padding:6px;"><span class="icon-ok" style="font-size:16px;"></span> {deleteAllButtonValue}</button>&nbsp;&nbsp;<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration:none;outline:none;"><span class="icon-remove" style="font-size:16px;"></span> 取消</button>';
			//删除单个按钮
			var buttonHtmldeleteSingle = '<button class="btn btn-warning" id="DeleteSingleButtonTipID" style="text-decoration:none;outline:none;padding:6px;"><span class="icon-ok" style="font-size:16px;"></span> {deleteSingleButtonValue}</button>&nbsp;&nbsp;<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration:none;outline:none;"><span class="icon-remove" style="font-size:16px;"></span> 取消</button>';
			//同时存在删除全部和删除单个按钮
			var buttonHtmldeleteAllandSingle = '<button class="btn btn-danger" id="DeleteAllButtonTipID" style="text-decoration:none;outline:none;padding:6px;"><span class="icon-ok" style="font-size:16px;"></span> {deleteAllButtonValue}</button>&nbsp;&nbsp;<button class="btn btn-warning" id="DeleteSingleButtonTipID" style="text-decoration:none;outline:none;padding:6px;"><span class="icon-ok" style="font-size:16px;"></span> {deleteSingleButtonValue}</button>&nbsp;&nbsp;<button class="btn btn-default" data-dismiss="modal" aria-hidden="true" style="text-decoration:none;outline:none;"><span class="icon-remove" style="font-size:16px;"></span> 取消</button>';
			
			buttonHtmldeleteAll = buttonHtmldeleteAll.replace(/{deleteAllButtonValue}/g, options.deleteAllButtonValue);
			buttonHtmldeleteSingle = buttonHtmldeleteSingle.replace(/{deleteSingleButtonValue}/g, options.deleteSingleButtonValue);
			buttonHtmldeleteAllandSingle = buttonHtmldeleteAllandSingle.replace(/{deleteAllButtonValue}/g, options.deleteAllButtonValue).replace(/{deleteSingleButtonValue}/g, options.deleteSingleButtonValue);
			tmpHtml = tmpHtml.replace(/{ID}/g, modalID).replace(/{title}/g, options.title).replace(/{content}/g, options.content);
			obj.append(tmpHtml);
			
			//设置模态窗口尺寸
			if(options.width) {
				$('.modal-size',$('#'+modalID)).css("width",options.width);
				var width = $('.modal-size',$('#'+modalID)).outerWidth();
				$('.modal-size',$('#'+modalID)).css("margin-left",(-(width/2)+'px'));
			} else {
				$('.modal-size',$('#'+modalID)).css("left","0px");
			}
			if(options.height) {
				$('.modalbody-size',$('#'+modalID)).css("height",options.height);
			} else {}			
			
			//modal-footer部分的内容条件判断
			if (options.deleteAllButton == true && options.deleteSingleButton == true) {
				$('.modal-footer',$('#'+modalID)).append(buttonHtmldeleteAllandSingle);
			} else if(options.deleteAllButton == true){
				$('.modal-footer',$('#'+modalID)).append(buttonHtmldeleteAll);
			} else if(options.deleteSingleButton == true) {
				$('.modal-footer',$('#'+modalID)).append(buttonHtmldeleteSingle);
			} else {
				$('.modal-footer',$('#'+modalID)).append(buttonHtml);
			}
			
			//按下删除全部按钮触发事件
			$("#DeleteAllButtonTipID").on("click",function(){
				options.deleteAllButtonTip(modalID);
			});
			
			//按下删除单个按钮触发事件
			$("#DeleteSingleButtonTipID").on("click",function(){
				options.deleteSingleButtonTip(modalID);
			});

			var modalObj = $('#' + modalID);
			//点击按钮触发弹出窗事件,在调用 show 方法后触发
			modalObj.on('show.bs.modal', function() {
				options.dialogShow();
			});
			//当模态框对用户可见时触发（将等待 CSS过渡效果完成）
			modalObj.on('shown.bs.modal', function() {
				options.dialogShown();
			});
			//点击关闭按钮或点击顶部x，关闭弹出窗事件,当调用 hide 实例方法时触发
			modalObj.on('hide.bs.modal', function() {
				options.dialogHide();
			});
			//当模态框完全对用户隐藏时触发
			modalObj.on('hidden.bs.modal', function() {
				options.dialogHidden();
				modalObj.remove();
			});
			
			modalObj.modal(options.bootstrapModalOption);
		});
	};
	$.extend({
		jmeDeleteTip: function(options) {
			$("body").jmeDeleteTip(options);
		}
	});
})(jQuery);
(function($) {
	//Alert提示警告框
	$.fn.jmeAlert = function(options) {
		var defaults = {
			msg: '成功',
			status:'info',
			top:'',
			left:'',
			autoDisappear:false,  //设置提示框是否自动消失
			alertClose: function() {},
			alertClosed: function() {}
		};
		options = $.extend(defaults, options);
		
		var alertID = '';
		//生成惟一ID
		function random(a, b) {
			return Math.random() > 0.5 ? -1 : 1;
		}
		//获取提示框id
		function getAlertID() {
			return "jmeAlert-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(random).join('').substring(5, 20);
		}

		return this.each(function() {
			var obj = $(this);
			alertID = getAlertID(); 
			
			var msgHtml = '<div class="alert jme-alert" role="alert" id="{ID}" aria-hidden="true" data-backdrop="static" tabindex="-1"><button type="button" class="close" data-dismiss="alert" aria-label="Close" style="margin-left:15px;outline:none;"><span aria-hidden="true">&times;</span></button><span class="alert-msg"></span></div>';
			
			msgHtml = msgHtml.replace(/{ID}/g, alertID);
			obj.append(msgHtml);
			//传入msg的值
			$('.alert-msg').append(options.msg);
			//设置提示框状态
			switch (options.status) {
				case "success": 
					$(".jme-alert").addClass("alert-success");
					break;
				case "error":
					$(".jme-alert").addClass("alert-danger");
					break;
				case "warning":
					$(".jme-alert").addClass("alert-warning");
					break;
				default:
					$(".jme-alert").addClass("alert-info");
			}
			//设置提示框样式和位置
			$(".jme-alert").css({"position":"fixed","z-index":"9999","left":"50%","top":"100px","padding":"8px 12px"});
			if(options.left) {
				$(".jme-alert").css("left",options.left);
			} else {
				var width = $(".jme-alert").outerWidth();
				$(".jme-alert").css("margin-left",(-(width/2)+'px'));
			}
			if (options.top) {
				$(".jme-alert").css("top",options.top);
			}
			else {}
			//设置时间参数让提示框自动消失
			if(options.autoDisappear == true) {
				setTimeout(function(){
					$(".jme-alert").alert('close');
				},3000);
			} 
			else {}
			
			var alertObj = $('#' + alertID);
			//当 close方法被调用后立即触发此事件
			alertObj.on('close.bs.alert', function() {
				options.alertClose();
			});
			//当警告框被关闭后（也即 CSS 过渡效果完毕之后）立即触发此事件
			alertObj.on('closed.bs.alert', function() {
				options.alertClosed();
			});
		});
	};
	$.extend({
		jmeAlert: function(options) {
			$("body").jmeAlert(options);
		}
	});
})(jQuery);
