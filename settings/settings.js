function updateDisplay(){
	chrome.storage.local.get('startpage_path', function(e){
		$('#file-path').val(e.startpage_path);
	});
	
	chrome.storage.local.get('startpage_darkmode', function(e){
		$('#darkmode input').prop("checked", e.startpage_darkmode);
	});

	
	chrome.storage.local.get('startpage_autocomplete', function(e){
		$('#autocomplete input').prop("checked", e.startpage_autocomplete);
	});
	
	chrome.storage.local.get('startpage_autocomplete_queries', function(e){
		let html = "";
		try{
			let queries = JSON.parse(e.startpage_autocomplete_queries);
			if(queries.length == 0){
				$("#autocomplete-suggestions").html("<td>No suggestions found</td>")
			} else {
				$("#autocomplete-suggestions").html("")
				queries.forEach(query => {
					let tr = document.createElement("tr");

					let q = document.createElement("td");
					q.className = "item";
					q.innerText = "'" + query.query + "'";
					tr.appendChild(q);

					let e = document.createElement("td");
					e.className = "item";
					e.innerText = query.engine;
					tr.appendChild(e);

					let p = document.createElement("td");
					p.className = "item";
					p.innerText = query.p;
					tr.appendChild(p);

					let a = document.createElement("td");
					a.className = "action";

					let d = document.createElement("div");
					d.className = "delete";

					let i = document.createElement("img");
					i.src = "bin.jpg";
					i.className = "bin";

					d.appendChild(i)

					a.appendChild(d);

					tr.appendChild(a);
					
					$("#autocomplete-suggestions").append(tr)

				});

				$(".action").click(function(){
					let queries = JSON.parse(e.startpage_autocomplete_queries);
					queries.forEach(query => {
						if(query.query == $(this).siblings().eq(0)[0].innerText){
							queries.splice(queries.indexOf(query), 1)
						}
					});

					chrome.storage.local.set({
						startpage_autocomplete_queries: JSON.stringify(queries)
					});
					

					updateDisplay();
				})
			}
		} catch(e){
			chrome.storage.local.set({
				startpage_autocomplete_queries:JSON.stringify([])
			});
		}
	});

	chrome.storage.local.get('startpage_sidebar', function(e){
		$('#sidebar input').prop("checked", e.startpage_sidebar);
	});

	chrome.storage.local.get('startpage_blob',function(e){
		$('#blob input').prop("checked", e.startpage_blob);
	});

}

function openPopup(arg_topic){
	topic = arg_topic;
	switch(topic){
		case "clearalldata":
			$(".popup-title").text("Clear all data?")
			$(".popup-info").text("Click 'Confirm' to delete all search queries that have been saved to deliver autocomplete suggestions")
		break;

		default:
		break;
	}
	$(".popup").addClass("popup-active");
	$("body > :not('.popup')").addClass("blur")
}

function closePopup(){
	$(".popup").removeClass("popup-active");
	$("body > :not('.popup')").removeClass("blur")
	updateDisplay();
}

var topic = "";

$(function(){

	updateDisplay();

	// POPUP


	$(".popup-buttons > .confirm").click(function(e){
		switch(topic){
			case "clearalldata":
				chrome.storage.local.set({
					startpage_autocomplete_queries:JSON.stringify([]),
					startpage_autocomplete_queries_last: undefined
				});
			break;

			default:
			break;
		}
		closePopup();
	});

	$(".popup-buttons > .cancel").click(function(e){
		closePopup();
	});


	$(".check span").on("click", function () {
		$(this).siblings().eq(0).prop("checked", !$(this).siblings().eq(0).prop("checked"));
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
		});
	});

	$("#autocomplete span").on("click", function(){
		chrome.storage.local.set({
			startpage_autocomplete:$(this).siblings().eq(0).prop("checked")
		});
		chrome.storage.local.get('startpage_autocomplete',function(e){
			$('#autocomplete input').prop("checked", e.startpage_autocomplete);
		});
	});

	$("#clearalldata").on("click", function(){
		openPopup("clearalldata");
	});

	// BLOB

	// Enable

	$("#blob input").on("change", function(){
		chrome.storage.local.set({
			startpage_blob:this.checked
		});
		chrome.storage.local.get('startpage_blob',function(e){
			$('#autocomplete input').prop("checked", e.startpage_blob);
		});
	});

	$("#blob span").on("click", function(){
		chrome.storage.local.set({
			startpage_blob:$(this).siblings().eq(0).prop("checked")
		});
		chrome.storage.local.get('startpage_blob',function(e){
			$('#autocomplete input').prop("checked", e.startpage_blob);
		});
	});


})

