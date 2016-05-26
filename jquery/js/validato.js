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
			remote: "后台验证不通过",
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
			if ( Validato.options == null || Validato.options === undefined ) {
				// 用户不传递任何元素和规则时，默认先查找是否有rules属性，没有的话，则不进行任何判断
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
			} else { 
				// 用户传递元素和规则时
				var itemRules = Validato.options.rules;
				var errorTips = Validato.options.errorTips;
				// C.log(itemRules);return false;
				var finalResult = {status:1, msg:'pass'};
				firstLevelFor:
				for (var i in itemRules) {
					var crtItemName = i; // 当前表单元素的name值
					var crtBoxVal = $('[name=' + crtItemName + ']').val(); // 当前等待验证的表单值
					if ( typeof itemRules[i] ==='string' ) {
						// 字符串形式规则
						var ruleStr = itemRules[i];
						// 对每一个rules进行验证
						var rules = ruleStr.split('|');
						var crtErrorTip = '';
						for(var key in rules){
							// 
							var complexRule = rules[key].split('=');
							// 检查该rules的errorTips是否定义
							if ( errorTips[crtItemName] == undefined || errorTips[crtItemName][complexRule[0]] == undefined ) {
								crtErrorTip = Validato.errorTips[complexRule[0]];
							} else {
								crtErrorTip = errorTips[crtItemName][complexRule[0]];
							}
							C.log(crtErrorTip);
							if ( complexRule.length > 1 ) { // fixLength=6, minLength=3, maxLength=6
								C.log(crtErrorTip);
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
								// C.log(crtErrorTip);
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
						// 字符串形式规则结束
					} else {
						// 对象数据形式规则 - 开始
						// C.log(crtItemName);
						// C.log(itemRules[i]);
						var rules = itemRules[i];
						for(var key in rules){
							var ruleName = key;
							var ruleParams = rules[key];
							// C.log(ruleName);
							// C.log(ruleParams);
							// C.log( errorTips[crtItemName][ruleName] );
							if ( errorTips[crtItemName][ruleName] == undefined ) {
								crtErrorTip = Validato.errorTips[ruleName];
							} else {
								crtErrorTip = errorTips[crtItemName][ruleName];
							}
							// C.log(crtErrorTip);
							if ( ruleParams === true ) {
								var check_res = Validato[ruleName](crtBoxVal, crtErrorTip);
								if ( check_res.status == 0 ) {
									// Validato.errorPlace(crtItemName, check_res.msg);
									// layer.msg(check_res.msg);
									C.log(check_res);
									Validato.showError(crtItemName, check_res.msg);
									finalResult = check_res;
									// return false;
									break firstLevelFor;
								}else{
									C.log('pass');
									Validato.clearError(crtItemName);
								}
							} else {
								var check_res = Validato[ruleName](crtBoxVal, ruleParams, crtErrorTip);
								if( check_res.status === -1 ){
									layer.msg(check_res.msg);
									return false;
								}else if ( check_res.status === 0 ) {
									// Validato.errorPlace(crtItemName, check_res.msg);
									// layer.msg(check_res.msg);
									// C.log(check_res);
									Validato.showError(crtItemName, check_res.msg);
									finalResult = check_res;
									// return false;
									break firstLevelFor;
								}else if( check_res.status === 1 ){
									// C.log('pass');
									// layer.msg(check_res.msg);
									// C.log(check_res.msg);
									Validato.clearError(crtItemName);
								}
							}

						}
						// return false;
						// 对象数据形式规则 - 结束
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
		remote:function(val, params, errorTips){
			// 
			var result;
			var type = params.type ? params.type : 'post';
			if ( params.data ) {
				var finalData = {};
				firstLevelFor:
				for( var key in params.data ){
					var itemName = key;
					var ele = $( params.data[itemName] ).prop('tagName');
					if ( ele === undefined ) {
						// C.log('请确认元素选择器是否有误');
						result = {status:-1, msg: '配置参数错误：请确认元素选择器是否有误'};
						return result;
					}
					var tagName = $( params.data[itemName] ).prop('tagName').toLowerCase();
					// C.log( tagName );return false;
					var tagType = $(params.data[itemName]).prop('type').toLowerCase();
					// radio
					if ( tagType === 'radio' ) {
						finalData[itemName] = $( params.data[itemName] + ':checked' ).val();
					} else if ( tagType === 'checkbox' ) {
						finalData[itemName] = new Array();
						for( var checkItem in $( params.data[itemName] + ':checked') ){
							finalData[itemName].push($(checkItem).val());
						}
					} else if( tagName == 'input' || tagName == 'textarea' ){
						finalData[itemName] = $( params.data[itemName] ).val();
					} else if( tagName == 'select' ){
						finalData = $( params.data[itemName] ).find('option:selected').val();
					}
				}
			} else {
				var finalData = {};
			}
			var url = params.url ? params.url : '';
			var dataType = params.dataType ? params.dataType : 'json';
			$.ajax({
				type: type,
				url: url,
				data: finalData,
				dataType: dataType,
				async:false,
				success:function(msg){
					// 
					if ( params.callback ) {
						result = params.callback(msg);
					} else {
						result = msg;
					}
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