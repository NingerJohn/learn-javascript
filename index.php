<?php

if ( $_POST ) {
	# code..
	// var_dump($_POST);exit;
	// echo json_encode(['code'=>-1, 'msg'=>'验证失败用户名']);exit;

	// echo json_encode(['code'=>-2, 'msg'=>'验证密码失败']);exit;

	echo json_encode(['code'=>1, 'msg'=>'哈哈，成功！！！']);exit;
	
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>jQuery表单验证插件</title>
	<script type="text/javascript" src="./jquery/js/jquery-v1.12.4.min.js"></script>
	<script type="text/javascript" src="./jquery/js/validato.js"></script>

<style type="text/css">
i.validato_error{
	color:red;
}
</style>

</head>
<body>


<form action="" class="form">
	<input type="text" name="username" rules="required" class="username">	<!-- |fixLength=6 -->
	<!-- <label class="error">用户不能为空</label> -->
	<br>
	<br>
	<input type="text" name="password" rules="required" value="" class="password">
	<br>
	<br>
	<input type="button" value="Submit" class="submit-btn">
</form>



<script type="text/javascript">
// 重写window下面的一些方法
var C = window.console;
var reg = /^[ ]+$/;
var spaceReg = /^\S+$/gi;
var string = $('[name=password]').val();

if( !isNaN(string) ){ // reg.test(string)
	// C.log(true);
}

var options = {
	// 默认验证哪些元素
	// items:['username', 'password'],
	triggerType:{ // 触发事件
		selector:'.submit-btn',
		type:'click'
	},
	rules:{ // 规则(注意：定义规则的同时，也等同于定义了哪些item需要被验证)
		username:{
			required:true,
			// digits:true,
			// email:true,
			// mobile:true,
			// rangelength:'1,5',
			// range:'1,5',
			// minlength:6,
			// maxlength:10,
			// min:6,
			identitycode:true,
			// max:50,
			// cnletter:true,
			// alphabet:true,
			remote:{
				data:{name : '.username', password: '.password'},
				url:'index.php',
				callback:function(msg){
					// 通过成功
					if ( msg.code == -1 ) { // 后台返回-1时，为失败
						// 
						var result = {status:0, msg: msg.msg};
						return result;
					} else {
						// 
						var result = {status:1, msg: msg.msg};
						return result;
					}
				},
			}
		},
		// username:'required',
		password:{
			required:true,
			fixlength:6,
			remote:{
				data:{name : '.username', password: '.password'},
				url:'index.php',
				callback:function(msg){
					// 通过成功
					if ( msg.code == -2 ) { // 后台返回-2时，为密码失败
						// 
						var result = {status:0, msg: msg.msg};
						return result;
					} else{
						// 
						var result = {status:1, msg: msg.msg};
						return result;
					}
				},
			}
		},
		// password:'required|fixLength=6',
	},
	// 错误提示信息
	errorTips:{
		username:{
			required: '用户名不能为空或含有任何空格',
			digits:'请输入数字',
			remote: '用户名服务器验证不正确', // 如果后台返回错误信息，此处不需要设置
		},
		password:{
			required:'密码不能为空',
			fixlength:'密码必须为6个字符'
		}
	},
	// addErrorPop:'layer',  // 添加layer错误提示方式
	errorPopType:['default','layer'], // 使用default，layer错误提示方式
	errorPlacement:function(element, error){
		// 用户自定义插入错误的位置
		element.after(error);
		// element.after('<label for="" class="error">' + error + '</label>');
		// element.find('i.error').html(error);
		// element.parent('div').siblings('i').find('label').before(error);
	}
};
// options = null;
var t = $('.form').validato(options);


</script>
</body>
</html>
