chrome.storage.local.get('custom_startpage',function(e){
	$('#path').val(e.custom_startpage);
});

$('#submit').click(function(){
	chrome.tabs.getCurrent(function(e){
		chrome.tabs.create({url:"opera://startpage"});
		chrome.tabs.remove(e.id);
	});
});
			
$('#path').on('input',function(){
	chrome.storage.local.set({
		custom_startpage:$(this).val()
	});
});