// jquery 验证插件
(function($){
	// 验证构造函数
	var Validato = function(ele, options){
		// 
		var Validato = this;
		Validato.crtForm = ele;
		Validato.options = options;
		// typeof(undefined) === 'undefined', undefined === undefined

		// 用户自定义错误提示
		Validato.errorPlacement = options && options.errorPlacement ? options.errorPlacement : false;
		
		// Validato默认错误信息
		Validato.errorTips = {
			required:'该字段不能为空!',
			fixlength:'长度必须是{fixedVal}个字符!',
			remote: "后台验证不通过",
			email: "请输入有效的电子邮件地址",
			mobile: "请输入正确的手机号码",
			telephone:'请输入正确的固定电话',
			url: "请输入有效的网址",
			date: "请输入有效的日期",
			dateISO: "请输入有效的日期(YYYY-MM-DD)",
			number: "请输入有效的数字", // 可以是正负数
			digits: "只能输入数字", // 必须是数字整数
			creditcard: "请输入有效的信用卡号码",
			bankaccount: "请输入有效的银行卡账号",
			equalTo: "你的输入不相同",
			extension: "请输入有效的后缀",
			maxlength: "最多可以输入 {max} 个字符",
			minlength: "最少要输入 {min} 个字符",
			rangelength: "请输入长度在 {min} 到 {max} 之间的字符串", // 长度范围
			range: "请输入范围在 {min} 到 {max} 之间的数值", // 大小范围
			max: "请输入不大于 {max} 的数值",
			min: "请输入不小于 {min} 的数值",
			cnletter:'请输入中文汉字',
			alphabet:'请输入英文字母',
			identitycode:'请输入正确的身份证号码',
		}

		// 显示错误的方式
		Validato.errorPopType = ( options && options.errorPopType != undefined ) ? options.errorPopType : ['default','layer'];
		// var t = $.extend(Validato.errorPopType, Validato.addErrorPop);
		// C.log(Validato.options.addErrorPop);return false;
		// C.log(Validato.errorPopType);
		// return false;

		// 
		// 
		if ( Validato.options && Validato.options !== undefined && Validato.options.errorPopType.indexOf('layer') > -1 ) {
			if ( typeof(window.layer) === 'undefined' ) {
				// 加载layer.js
				// C.log(typeof(layer));
				$('head').append('<link href="http://cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet">');
				var script = document.createElement('script');
				script.src = 'http://cdn.bootcss.com/layer/2.3/layer.js';
				script.onload = function(){
					finalValidatingRes = Validato.validating(Validato);
					if ( finalValidatingRes.status == 1 ) {
						// 
						Validato.options.validatePassed !== undefined ? Validato.options.validatePassed() : null;
					} else {
						// 
						Validato.options.validateFailed !== undefined ? Validato.options.validateFailed() : null;
					}
				}
				document.head.appendChild(script);
			}else{
				finalValidatingRes = Validato.validating(Validato);
				if ( finalValidatingRes.status == 1 ) {
					// 
					Validato.options.validatePassed !== undefined ? Validato.options.validatePassed() : null;
				} else {
					// 
					Validato.options.validateFailed !== undefined ? Validato.options.validateFailed() : null;
				}
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
							if ( complexRule.length > 1 ) { // fixlength=6, minlength=3, maxLength=6
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
				// C.log(finalResult);
				return finalResult;
				// return false;
			} else {
				// 用户传递元素和规则时
				var itemRules = Validato.options.rules;
				// C.log(Validato.options.errorTips);return false;
				var errorTips = Validato.options.errorTips ? Validato.options.errorTips : Validato.errorTips;
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
								// 未定义的话，则取validato自己提供的
								crtErrorTip = Validato.errorTips[complexRule[0]];
							} else {
								// 未定义的话，则取validato自己提供的
								crtErrorTip = errorTips[crtItemName][complexRule[0]];
							}
							// C.log(crtErrorTip);
							if ( complexRule.length > 1 ) { // fixlength=6, minlength=3, maxLength=6
								// C.log(crtErrorTip);
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
							if ( errorTips[crtItemName] == undefined || errorTips[crtItemName][ruleName] == undefined ) {
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
									// C.log(check_res);
									Validato.showError(crtItemName, check_res.msg);
									finalResult = check_res;
									// return false;
									break firstLevelFor;
								}else{
									// C.log('pass');
									Validato.clearError(crtItemName);
								}
							} else {
								var check_res = Validato[ruleName](crtBoxVal, ruleParams, crtErrorTip);
								if( check_res.status === -1 ){
									// 配置错误或者异常
									// layer.msg(check_res.msg);
									alert(check_res.msg);
									return false;
								}else if ( check_res.status === 0 ) {
									// 验证失败
									// Validato.errorPlace(crtItemName, check_res.msg);
									// layer.msg(check_res.msg);
									// C.log(check_res);
									Validato.showError(crtItemName, check_res.msg);
									finalResult = check_res;
									// return false;
									break firstLevelFor;
								}else if( check_res.status === 1 ){
									// 验证成功
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
				// C.log(finalResult);//return false;
				return finalResult; // 返回最终验证结果
				// C.log(errorTips);
			};
		},
		// 提示错误的方法
		showError:function(itemName, msg){
			var errorPopTypeArr = this.options.errorPopType;
			// C.log(errorPopTypeArr);

			for (var i = 0; i < errorPopTypeArr.length; i++) {
				// errorPopTypeArr[i];
				// 默认追加元素提示
				if ( errorPopTypeArr[i] == 'default' ) {
					// 添加元素形式提示错误
					var crtMsg = '<i class="validato_error ' + itemName + '">' + msg + '</i>' ;
					if ( this.errorPlacement ) {
						//  添加错误
						// console.log(itemName);
						this.clearError(itemName);
						this.errorPlacement(this.jqObjectize(itemName), crtMsg);
					} else {
						// 默认追加方式
						this.errorPlace(itemName, crtMsg);
					}
				}
				// layer提示
				if( errorPopTypeArr[i] == 'layer' ){
					// layer弹出层提示
					layer.msg(msg);
				}
			};
		},
		// 
		// 
		// 
		// 
		// 获取jquery形式对象
		jqObjectize:function(itemName){
			// 
			if ( itemName.indexOf('.') > -1 || itemName.indexOf('#') > -1 ) {
				return $(itemName);
			} else {
				return $('[name=' + itemName + ']');
			}
		},
		// 展示错误
		errorPlace:function(itemName, msg){
			this.clearError(itemName);
			this.jqObjectize(itemName).after('<i class="validato_error ' + itemName + '">' + msg + '</i>');
			this.jqObjectize(itemName).focus();
		},
		// 清除错误
		clearError:function(itemName){
			// var selector = 
			this.jqObjectize('i.validato_error.' + itemName).remove();
			// V#2
			// if ( this.errorPlacement ) {
			// 	this.jqObjectize('i.validato_error.'.itemName).remove();
			// } else {
			// 	this.jqObjectize('i.validato_error').remove();
			// }
			// V#1
			// this.jqObjectize(itemName).siblings('.error').remove();
		},
		// 鼠标获取焦点
		// 
		// 
		autoFocus:function(itemName){
			this.jqObjectize(itemName).focus();
		},
		/* 
		* 常用验证方法声明
		*
		**/
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
		fixlength:function(val, fixedVal, errorTips){
			if( val.length != fixedVal ){
				var check_res = {status:0, msg: errorTips ? errorTips : this.errorTips.fixlength.replace(/\{fixedVal\}/, fixedVal) };
				return check_res;
			}else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 最小长度
		minlength:function(val, minVal, errorTips){
			// C.log(errorTips);
			if ( errorTips.indexOf('min') > -1 ) {
				errorTips = this.errorTips.minlength.replace(/\{min\}/, minVal);
			}
			if ( val.length < minVal ) {
				var check_res = {status:0, msg:errorTips};
				// C.log(check_res);
				return check_res;
			} else {
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 最大长度
		maxlength:function(val, maxVal, errorTips){
			// 处理错误信息
			if ( errorTips.indexOf('max') > -1 ) {
				errorTips = this.errorTips.maxlength.replace(/\{max\}/, maxVal);
			}
			// 判断
			if ( val.length > maxVal ) {
				var check_res = {status:0, msg:errorTips};
				// C.log(check_res);
				return check_res;
			} else {
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
		// 大小判断
		range:function(val, params, errorTips){
			// 
			var paramsArr = params.split(','); // '1,5'
			if ( errorTips.indexOf('min') > -1 && errorTips.indexOf('max') > -1 ) {
				errorTips = this.errorTips.range.replace(/\{min\}/, paramsArr[0]).replace(/\{max\}/, paramsArr[1]);
			}
			if ( parseInt(val) < parseInt(paramsArr[0]) || parseInt(val) > parseInt(paramsArr[0]) ) {
				var check_res = {status:0, msg:errorTips};
				return check_res;
			} else {
				var check_res = {status:1, msg:'范围验证通过'};
				return check_res;
			}
		},
		// 大小判断
		rangelength:function(val, params, errorTips){
			// 
			var paramsArr = params.split(','); // '1,5'
			if ( errorTips.indexOf('min') > -1 && errorTips.indexOf('max') > -1 ) {
				errorTips = this.errorTips.rangelength.replace(/\{min\}/, paramsArr[0]).replace(/\{max\}/, paramsArr[1]);
			}
			// C.log(errorTips);
			if ( val.length < parseInt(paramsArr[0]) || val.length > parseInt(paramsArr[0]) ) {
				var check_res = {status:0, msg:errorTips};
				// C.log('cuowu');
				return check_res;
			} else {
				var check_res = {status:1, msg:'范围验证通过'};
				return check_res;
			}
		},
		// 最小值验证方法
		min:function(val, minVal, errorTips){
			// C.log(errorTips);
			if ( errorTips.indexOf('min') > -1 ) {
				errorTips = this.errorTips.min.replace(/\{min\}/, minVal);
			}
			if ( val < minVal ) {
				var check_res = {status:0, msg:errorTips};
				// C.log(check_res);
				return check_res;
			} else {
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 最大值验证方法
		max:function(val, maxVal, errorTips){
			// 处理错误信息
			if ( errorTips.indexOf('max') > -1 ) {
				errorTips = this.errorTips.max.replace(/\{max\}/, maxVal);
			}
			// 判断
			if ( val > maxVal ) {
				var check_res = {status:0, msg:errorTips};
				// C.log(check_res);
				return check_res;
			} else {
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 手机号码验证方法
		mobile:function(val,errorTips){
			var mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if ( !mobileReg.test(val) ) {
				var check_res = {status:0, msg:errorTips ? errorTips : this.errorTips.email};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 邮箱验证方法
		email:function(val,errorTips){
			// var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/;
			var emailReg = /(?!.*\.co$)^[a-zA-Z0-9._%\-]+@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,4}$/;
			if ( !emailReg.test(val) ) {
				var check_res = {status:0, msg:errorTips ? errorTips : this.errorTips.email};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// 中文验证
		cnletter:function(val, errorTips){
			// var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/;
			var cnletterReg = /[\u4E00-\u9FA5\uf900-\ufa2d]/;
			if ( !cnletterReg.test(val) ) {
				var check_res = {status:0, msg:errorTips ? errorTips : this.errorTips.cnletter};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		// alphabet 字母验证
		alphabet:function(val, errorTips){
			// var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/;
			var cnletterReg = /[a-zA-Z]+/;
			if ( !cnletterReg.test(val) ) {
				var check_res = {status:0, msg:errorTips};
				return check_res;
			} else{
				var check_res = {status:1, msg:'pass'};
				return check_res;
			}
		},
		identitycode:function(val, errorTips){
			var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
			var msg = "";
			var res = true;

			// /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i 
			var identitycodeReg = /^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i;
			if(!val || !identitycodeReg.test(val)){
				msg = "身份证号格式错误";
				res = false;
			} else if(!city[val.substr(0,2)]){
				msg = "地址编码错误";
				res = false;
			} else {
				//18位身份证需要验证最后一位校验位
				if(val.length == 18){
					val = val.split('');
					//∑(ai×Wi)(mod 11)
					//加权因子
					var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
					//校验位
					var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
					var sum = 0;
					var ai = 0;
					var wi = 0;
					for (var i = 0; i < 17; i++)
					{
						ai = val[i];
						wi = factor[i];
						sum += ai * wi;
					}
					var last = parity[sum % 11];
					if(parity[sum % 11] != val[17].toUpperCase()){
						msg = "校验位错误";
						res =false;
					}
				}
			}
			if ( res == true ) {
				var check_res = {status:1, msg:errorTips};
			} else {
				var check_res = {status:0, msg:msg};
			}
			return check_res;
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
		var validator = new Validato(this, options);
		return false;
		// console.log('new 111111');
		// return false;

		// $.log(options);
		// if(options && options.triggerType !== undefined){
		// 	$(options.triggerType.selector)[options.triggerType.type](function(){
		// 		var validator = new Validato(this, options);
		// 	})
		// } else {
		// 	this.focusout(function() {
		// 		var validator = new Validato(this, options);
		// 		return false;
		// 	});
		// }
	}
})(jQuery);