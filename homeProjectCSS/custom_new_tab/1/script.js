
$(function(){
	var dark_mode, queries, last, display_queries, old_display_queries, autocomplete;
	
	$(".dark-mode input").click(function(){
		darkmode = !darkmode;
		chrome.storage.local.set({startpage_darkmode:darkmode});
	});
	
	chrome.storage.local.get('startpage_darkmode', function(e){
		dark_mode = (e.startpage_darkmode);
		if(dark_mode){
			$(".dark-mode input").prop("checked", true);
		}
	});


	chrome.storage.local.get('startpage_autocomplete', function(e){
		autocomplete = e.startpage_autocomplete;
		if(autocomplete){
			
			chrome.storage.local.get('startpage_autocomplete_queries', function(e){
				try{
					queries = JSON.parse(e.startpage_autocomplete_queries);
				}catch(e){
					queries = [];
				}
				// console.log(queries);
			});

			chrome.storage.local.get('startpage_autocomplete_queries_last', function(e){
				last = e.startpage_autocomplete_queries_last;
			});
				
			$("#input").keydown(function(e) {
				switch(e.keyCode){
					case 13:
						if(!e.shiftKey){
							try{
								queries.filter(query => {
									return (query.query.toUpperCase() == $("#input").val().toUpperCase() && query.engine == $("#input").attr("class").slice(7, $("#input").attr("class").length));
								})[0].p++;
							} catch(e){
								queries.push(
									{
										engine: $("#input").attr("class").slice(7, $("#input").attr("class").length),
										query: $(this).val(),
										p: 1
									}
								)
							}
							queries.sort(function (a, b) {
								return b.p - a.p;
							});
							chrome.storage.local.set({
								startpage_autocomplete_queries: JSON.stringify(queries),
								startpage_autocomplete_queries_last: $("#input").val()
							});
						}
					break;
				}
				
				setTimeout(function(){
					if($("#input").val() != ""){

						if(display_queries){
							old_display_queries = display_queries;
						}


						display_queries = queries.filter(query => {
							return query.engine == $("#input").attr("class").slice(7, $("#input").attr("class").length) && query.query.toUpperCase().includes($("#input").val().toUpperCase());
						})
						// console.log(old_display_queries, display_queries)

						//fist letter sort
						if($("#input").val().length == 1){
							display_queries.sort(function (a, b) {
								if(a.query.toUpperCase()[0] == $("#input").val().toUpperCase()[0] && b.query.toUpperCase()[0] != $("#input").val().toUpperCase()[0]){
									return -1
								} else if (b.query.toUpperCase()[0] == $("#input").val().toUpperCase()[0] && a.query.toUpperCase()[0] != $("#input").val().toUpperCase()[0]){
									return 1;
								}
								return 0;
							});
						}

						//last search bias
						if(last != undefined && last != ""){
							if(display_queries.filter(display_query => {
								return display_query.query.toUpperCase() == last.toUpperCase();
							}).length != 0 && ($("#input").val().length != 1 || $("#input").val().toUpperCase()[0] == last.toUpperCase()[0])){
								display_queries.sort(function (a, b) {
									if(a.query.toUpperCase() == last.toUpperCase()){
										return -1
									} else if (a.query.toUpperCase() != last.toUpperCase()){
										return 1;
									}
									return 0;
								});
							}
						}
						
						
						if(!(e.keyCode == 16)){
							// console.log(display_queries != old_display_queries) //NOT WORKING ?
							$(".suggestions ul").html("");
							display_queries.forEach(display_query => {
								$(".suggestions ul").append($('<li>' + display_query.query + '</li>'))
							});
							$(".suggestions").css("display", "block")
						}
					} else {
						$(".suggestions").css("display", "none")
					}
				}, 5);
			});

		}

	});

});