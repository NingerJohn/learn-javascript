// jquery 验证插件
(function($){
	// 验证构造函数
	var Validato = function(ele, options){
		// 
		var Validato = this;
		Validato.crtForm = ele;
		Validato.options = options;
		// typeof(undefined) === 'undefined', undefined === undefined

		// Validato.errorPlacement = options.errorPlacement ? options.errorPlacement : ;
		
		// Validato默认错误信息
		Validato.errorTips = {
			required:'该字段不能为空!',
			fixLength:'长度必须是{fixedVal}个字符!',
			remote: "请修正此字段",
			email: "请输入有效的电子邮件地址",
			url: "请输入有效的网址",
			date: "请输入有效的日期",
			dateISO: "请输入有效的日期(YYYY-MM-DD)",
			number: "请输入有效的数字",
			digits: "只能输入数字",
			creditcard: "请输入有效的信用卡号码",
			equalTo: "你的输入不相同",
			extension: "请输入有效的后缀",
			maxlength: "最多可以输入 {max} 个字符",
			minlength: "最少要输入 {min} 个字符",
			rangelength: "请输入长度在 {min} 到 {max} 之间的字符串",
			range: "请输入范围在 {min} 到 {max} 之间的数值",
			max: "请输入不大于 {max} 的数值",
			min: "请输入不小于 {min} 的数值"
		}

		// 显示错误的方式
		Validato.errorPopType = ( options && options.errorPopType != undefined ) ? options.errorPopType : ['default','layer'];
		// var t = $.extend(Validato.errorPopType, Validato.addErrorPop);
		// C.log(Validato.options.addErrorPop);return false;
		// C.log(Validato.errorPopType);
		// return false;

		// 
		if ( Validato.options !== undefined && Validato.options.errorPopType.indexOf('layer') > -1 ) {
			if ( typeof(window.layer) === 'undefined' ) {
				// 加载layer.js
				// C.log(typeof(layer));
				$('head').append('<link href="http://cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet">');
				var script = document.createElement('script');
				script.src = 'http://cdn.bootcss.com/layer/2.3/layer.js';
				script.onload = function(){
					Validato.validating(Validato);
				}
				document.head.appendChild(script);
			}else{
				Validato.validating(Validato);
			}
		}
				// Validato.validating(Validato);

	};

	// 验证规则方法声明
	Validato.prototype = {
		// 初始化
		init:function(){
			Validato.validating();
		},
		
		// 开始验证
		validating:function(){
			// 判断用户是否传验证规则
			var Validato = this;
			if ( Validato.options == null || Validato.options === undefined ) { // 用户不传递任何元素和规则时
				var allInputObj = $(Validato.crtForm).find('[name]');
				// $.log(allInputObj);return false;
				var finalResult;
				allInputObj.each(function(index, item){
					// 对每个有name的表单元素进行验证
					var crtItem = $(item);
					var ruleStr = crtItem.attr('rules');
					var crtBoxVal = crtItem.val();
					if ( ruleStr === undefined ) {
						// 没有定义任何rules的时候
						$.log('no roles defined');
					} else{
						// 定义了rules的时候
						var rules = ruleStr.split('|');
						for(var key in rules){
							// 
							var complexRule = rules[key].split('=');
							if ( complexRule.length > 1 ) { // fixLength=6, minLength=3, maxLength=6
								var check_res = Validato[complexRule[0]](crtBoxVal, complexRule[1]);
								if ( check_res.status == 0 ) {
									return finalResult = check_res;
								}
							} else{
								var check_res = Validato[complexRule[0]](crtBoxVal);							
								if ( check_res.status == 0 ) {
									return finalResult = check_res;
								}
							};
						}
					};
				});
				// 如果验证不通过的话，则终止
				C.log(finalResult);return false;

			} else { // 用户传递元素和规则时
				//
				var itemRules = Validato.options.itemRules;
				var errorTips = Validato.options.errorTips;
				// C.log(itemRules);
				var finalResult = {status:1, msg:'pass'};
				firstLevelFor:
				for (var i in itemRules) {
					var crtItemName = i;
					var crtBoxVal = $('[name=' + crtItemName + ']').val();
					var ruleStr = itemRules[i];
					// 对每一个rules进行验证
					var rules = ruleStr.split('|');
					for(var key in rules){
						// 
						var complexRule = rules[key].split('=');
						// 检查该rules的errorTips是否定义
						if ( errorTips[crtItemName] == undefined || errorTips[crtItemName][complexRule[0]] == undefined ) {
							crtErrorTip = Validato.errorTips[complexRule[0]];
						} else {
							crtErrorTip = errorTips[crtItemName][complexRule[0]];
						}
						if ( complexRule.length > 1 ) { // fixLength=6, minLength=3, maxLength=6
							var check_res = Validato[complexRule[0]](crtBoxVal, complexRule[1], crtErrorTip);
							if ( check_res.status == 0 ) {
								// Validato.errorPlace(crtItemName, check_res.msg);
								// layer.msg(check_res.msg);
								Validato.showError(crtItemName, check_res.msg);
								finalResult = check_res;
								break firstLevelFor;
							}else{
								Validato.clearError(crtItemName);
							}
						} else{ // required, email, mobile, 
							var check_res = Validato[complexRule[0]](crtBoxVal, crtErrorTip);
							if ( check_res.status == 0 ) {
								Validato.showError(crtItemName, check_res.msg);
								finalResult = check_res;
								break firstLevelFor;
							}else{
								Validato.clearError(crtItemName);
							}
						};
					}
				}
				C.log(finalResult);//return false;
				// C.log(errorTips);
			};
		},
		// 
		showError:function(itemName, msg){
			var errorPopTypeArr = this.options.errorPopType;
			// C.log(errorPopTypeArr);

			for (var i = 0; i < errorPopTypeArr.length; i++) {
				// errorPopTypeArr[i];
				if ( errorPopTypeArr[i] == 'default' ) {
					// 
					this.errorPlace(itemName, msg);
				}else if( errorPopTypeArr[i] == 'layer' ){
					// 
					layer.msg(msg);
				}
			};
		},
		// 
		// 
		// 
		// 
		// 错误位置
		errorPlacement:function(){
			// 
		},
		errorPlace:function(itemName, msg){
			this.clearError(itemName);
			$('[name=' + itemName + ']').after('<label class="error">' + msg + '</label>');
			$('[name=' + itemName + ']').focus();
		},
		clearError:function(itemName){
			$('[name=' + itemName + ']').siblings('.error').remove();
		},
		// 必填验证方法
		required:function(val, errorTips){
			//
			var emptyReg = /^[ ]+$/;
			var spaceReg = /^\S+$/gi;
			if( !val || val.length < 1 || !spaceReg.test(val) ){
				var check_res = {status:0, msg: errorTips ? errorTips : this.errorTips.required};
				return check_res;
			}else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 定长验证方法
		fixLength:function(val, fixedVal, errorTips){
			if( val.length != fixedVal ){
				var check_res = {status:0, msg: errorTips ? errorTips : this.errorTips.fixLength.replace(/\{fixedVal\}/, fixedVal) };
				return check_res;
			}else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 必须是数字验证方法
		digits:function(val, errorTips){
			if ( isNaN(val) ) {
				var check_res = {status:0, msg:errorTips ? errorTips : this.errorTips.digits};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 最少验证方法
		// 最多验证方法
		// 手机号码验证方法
		// 邮箱验证方法
		email:function(val,errorTips){
			var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/;
			if ( emailReg.test(val) ) {
				var check_res = {status:0, msg:errorTips ? errorTips : this.errorTips.email};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// ajax验证方法
		remote:function(params){
			// 
			var result;
			var type = params.type ? params.type : 'post';
			var data = params.data ? params.data : {};
			var url = params.url ? params.url : '';
			var dataType = params.dataType ? params.dataType : 'json';
			$.ajax({
				type: type,
				url: url,
				data: data,
				dataType: dataType,
				async:false,
				success:function(msg){
					// 
					result = msg;
				}
			});
			return result;
		}
		// 
	}

	$.fn.validato = function(options){
		// $.log(options);
		if(options && options.triggerType !== undefined){
			$(options.triggerType.selector)[options.triggerType.type](function(){
				var validator = new Validato(this, options);
			})
		} else {
			this.focusout(function() {
				var validator = new Validato(this, options);
				return false;
			});
		}
	}
})(jQuery);