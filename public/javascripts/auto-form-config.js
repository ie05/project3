$(document).ready(function(){
	$('#login-form').attr("autocomplete", "off");
	$('#login-form :input').each(function(){
		$(this).val('');
	});
});