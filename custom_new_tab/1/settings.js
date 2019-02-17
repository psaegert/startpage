updateDisplay();

$(".check span").on("click", function () {
	$(this).siblings().eq(0).prop("checked", !$(this).siblings().eq(0).prop("checked"));
});

// RESURCES

//Path
			
$('#file-path').on('input',function(){
	chrome.storage.local.set({
		startpage_path:$(this).val()
	});
});

$("#file-path").on("click", function () {
	$(this).select();
});

// BASIC SETTINGS

// Dark Mode

$("#darkmode input").on("change", function(){
	chrome.storage.local.set({
		startpage_darkmode:this.checked
	});
})

$("#darkmode span").on("click", function(){
	chrome.storage.local.set({
		startpage_darkmode:$(this).siblings().eq(0).prop("checked")
	});
})

// Autocomplete

$("#autocomplete input").on("change", function(){
	chrome.storage.local.set({
		startpage_autocomplete:this.checked
	});
	chrome.storage.local.get('startpage_autocomplete',function(e){
		$('#autocomplete input').prop("checked", e.startpage_autocomplete);
		console.log(e.startpage_autocomplete)
	});
});

$("#autocomplete span").on("click", function(){
	chrome.storage.local.set({
		startpage_autocomplete:$(this).siblings().eq(0).prop("checked")
	});
	chrome.storage.local.get('startpage_autocomplete',function(e){
		$('#autocomplete input').prop("checked", e.startpage_autocomplete);
		console.log(e.startpage_autocomplete)
	});
});

// BLOB

// Enable

$("#blob input").on("change", function(){
	chrome.storage.local.set({
		startpage_blob:this.checked
	});
	chrome.storage.local.get('startpage_blob',function(e){
		$('#autocomplete input').prop("checked", e.startpage_blob);
		console.log(e.startpage_blob)
	});
});

$("#blob span").on("click", function(){
	chrome.storage.local.set({
		startpage_blob:$(this).siblings().eq(0).prop("checked")
	});
	chrome.storage.local.get('startpage_blob',function(e){
		$('#autocomplete input').prop("checked", e.startpage_blob);
		console.log(e.startpage_blob)
	});
});

function updateDisplay(){
	chrome.storage.local.get('startpage_path',function(e){
		$('#file-path').val(e.startpage_path);
	});
	
	chrome.storage.local.get('startpage_darkmode',function(e){
		$('#darkmode input').prop("checked", e.startpage_darkmode);
	});

	
	chrome.storage.local.get('startpage_autocomplete',function(e){
		$('#autocomplete input').prop("checked", e.startpage_autocomplete);
	});

	chrome.storage.local.get('startpage_blob',function(e){
		$('#blob input').prop("checked", e.startpage_blob);
	});
}

