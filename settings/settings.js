function updateDisplay(){

	chrome.storage.local.get("startpage_autocomplete", function(e){

		$('#autocomplete input').prop("checked", e.startpage_autocomplete.enabled);

		let queries = e.startpage_autocomplete.suggestions;
		if(queries.length == 0){
			$("#autocomplete-suggestions  tbody").html("<td>No suggestions found</td>")
		} else {
			$("#autocomplete-suggestions  tbody").html("")
			queries.forEach(query => {
				let tr = document.createElement("tr");

					let q = document.createElement("td");
					q.className = "variable-item";

						let qinp = document.createElement("input");
						qinp.autocomplete= "off";
						qinp.value = query.query;
						qinp.name = query.query;
						qinp.alt = query.engine;
						qinp.spellcheck = false;

						q.appendChild(qinp);

					tr.appendChild(q);


					let e = document.createElement("td");
					e.className = "property";
					e.innerText = query.engine;
					tr.appendChild(e);


					let p = document.createElement("td");
					p.className = "property";
					p.innerText = query.p;
					tr.appendChild(p);

					let a = document.createElement("td");
					a.className = "action";

						let d = document.createElement("div");
						d.className = "table-icon";

							let i = document.createElement("img");
							chrome.storage.local.get('startpage_settings', function(e){
								i.src = e.startpage_settings.darkmode ? "./img/bin_dark.jpg" : "./img/bin.jpg";
							});
							i.className = "bin";

							d.appendChild(i)

						a.appendChild(d);

					tr.appendChild(a);

				
				$("#autocomplete-suggestions  tbody").append(tr)

			});

			$("#autocomplete-suggestions .variable-item input").bind('input propertychange', function() {
				let val = $(this).val()
				let name = $(this).attr("name")
				let engine = $(this).parent().siblings().eq(0).text()
				chrome.storage.local.get("startpage_autocomplete", function(e){
					startpage_autocomplete = e.startpage_autocomplete;
					suggestions = startpage_autocomplete.suggestions;
					if(val.replace(/\s/g, '') != "" && suggestions.filter(sug => sug.query.toUpperCase() == val.toUpperCase() && sug.engine == engine).length == 0){
						suggestions.filter(sug => sug.query == name)[0].query = val;
						$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", val);
						startpage_autocomplete.suggestions = suggestions;
						chrome.storage.local.set({startpage_autocomplete: {
							enabled: startpage_autocomplete.enabled,
							suggestions: suggestions,
							last: startpage_autocomplete.last
						}})
						
						loadToProfile()
					}
				});
			});
		}
	});

	chrome.storage.local.get("startpage_profiles", function(e){

		if(e.startpage_profiles.length == 0){
			$("#profile-list  tbody").html("<td>No profiles found</td>")
		} else {
			$("#profile-list  tbody").html("")		
			e.startpage_profiles.forEach(profile => {
				let tr = document.createElement("tr");

					let n = document.createElement("td");
					n.className = "item";

						let ntxt = document.createElement("div");
						ntxt.className = "item-text";
						ntxt.innerText = profile.name ;


						n.appendChild(ntxt);

						let nedit = document.createElement("div");
						nedit.className = "item-edit";

							let ni = document.createElement("img");
								chrome.storage.local.get('startpage_settings', function(e){
									ni.src = e.startpage_settings.darkmode ? "./img/edit.png" : "./img/edit_dark.png";
								});
								ni.className = "edit";

								nedit.appendChild(ni)

						n.appendChild(nedit);

					tr.appendChild(n);

					let dr = document.createElement("td");
					dr.className = "property";

						let drdiv = document.createElement("div");
						if(profile.settings.darkmode){
							drdiv.className = "table-icon table-icon-color darkmode-on";
						} else {
							drdiv.className = "table-icon table-icon-color darkmode-off";
						}
						if(profile.settings.darkmode_auto){
							drdiv.innerText = "A"
						}

						dr.appendChild(drdiv);

					tr.appendChild(dr);


					let s = document.createElement("td");
					s.className = "property";

						let sdiv = document.createElement("div");
						sdiv.innerText = "S"
						if(profile.settings.sidebar){
							sdiv.className = "table-icon";
						} else {
							sdiv.className = "table-icon crossed";
						}

						s.appendChild(sdiv);


					tr.appendChild(s);

					let b = document.createElement("td");
					b.className = "property";

						let bdiv = document.createElement("div");
						bdiv.innerText = "B"
						if(profile.settings.blob){
							bdiv.className = "table-icon";
						} else {
							bdiv.className = "table-icon crossed";
						}

						b.appendChild(bdiv);

					tr.appendChild(b);


					let w = document.createElement("td");
					w.className = "property";

						let wdiv = document.createElement("div");
						wdiv.innerText = "W"
						if(profile.settings.weather){
							wdiv.className = "table-icon";
						} else {
							wdiv.className = "table-icon crossed";
						}

						w.appendChild(wdiv);

					tr.appendChild(w);


					let a = document.createElement("td");
					a.className = "action";

						let d = document.createElement("div");
						d.className = "table-icon";

							let i = document.createElement("img");
							chrome.storage.local.get('startpage_settings', function(e){
								i.src = e.startpage_settings.darkmode ? "./img/bin_dark.jpg" : "./img/bin.jpg";
							});
							i.className = "bin";

							d.appendChild(i)

						a.appendChild(d);

					tr.appendChild(a);

					chrome.storage.local.get('startpage_selected_profile', function(e){
						if(e.startpage_selected_profile == profile.name)
							tr.className = "selected"
					});
				
				$("#profile-list  tbody").append(tr)

			});
		}	
		$("#profile-text-export").text(JSON.stringify(e.startpage_profiles, null, 6));
	})
	
	chrome.storage.local.get("startpage_settings", function(e){

		$('#darkmode input').prop("checked", e.startpage_settings.darkmode);
		
		$('#darkmode_auto input').prop("checked", e.startpage_settings.darkmode_auto);
		
		$('.basic .time-input input').eq(0).val(e.startpage_settings.darkmode_auto_time.from);
		$('.basic .time-input input').eq(1).val(e.startpage_settings.darkmode_auto_time.to);
		
		$(".time-input input").eq(0).parent().css("width", $(".time-input input").eq(0).width()  - 30 + "px")
		$(".time-input input").eq(1).parent().css("width", $(".time-input input").eq(1).width()  - 30 + "px")

		$('#sidebar input').prop("checked", e.startpage_settings.sidebar);

		let websites = e.startpage_settings.sidebar_websites;

		// sidebar websites

		$("#sidebar-websites tbody").html("")

		websites.forEach(website => {
			let tr = document.createElement("tr");

				let m = document.createElement("td");
				m.className = "move";

					let mdiv = document.createElement("div");
					mdiv.className = "table-move";

						let mdivi = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							mdivi.src = e.startpage_settings.darkmode ? "./img/iconfinder_1-icon-music-10_3694736_dark.png" : "./img/iconfinder_1-icon-music-10_3694736.png";
						});

						mdiv.appendChild(mdivi)

					m.appendChild(mdiv);

				tr.appendChild(m);


				let n = document.createElement("td");
				n.className = "variable-website";

					let ninp = document.createElement("input");
					ninp.autocomplete= "off";
					ninp.value = website.name;
					ninp.name = website.name;
					ninp.spellcheck = false;

					n.appendChild(ninp);

				tr.appendChild(n);

				let url = document.createElement("td");
				url.className = "variable-url";

					let urlinp = document.createElement("input");
					urlinp.autocomplete= "off";
					urlinp.value = website.url;
					urlinp.spellcheck = false;

					url.appendChild(urlinp);

				tr.appendChild(url);

				let img = document.createElement("td");
				img.className = "variable-img";

					let imginp = document.createElement("input");
					imginp.autocomplete= "off";
					imginp.value = website.img;
					imginp.spellcheck = false;

					img.appendChild(imginp);

				tr.appendChild(img);

				let s = document.createElement("td");
					s.className = "property";

						let sdiv = document.createElement("div");
						sdiv.className = "table-icon";

							let simg = document.createElement("img");
							simg.className = "table-icon-img";

							sdiv.appendChild(simg)
						

						s.appendChild(sdiv);


					tr.appendChild(s);


				let a = document.createElement("td");
				a.className = "action";

					let d = document.createElement("div");
					d.className = "table-icon";

						let i = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							i.src = e.startpage_settings.darkmode ? "./img/bin_dark.jpg" : "./img/bin.jpg";
						});
						i.className = "bin";

						d.appendChild(i)

					a.appendChild(d);

				tr.appendChild(a);

			
			$("#sidebar-websites tbody").append(tr)

		});

		let tr = document.createElement("tr");
		tr.className="add"

		let sp = document.createElement("td")

		tr.appendChild(sp)

		let n = document.createElement("td");
		n.className = "add-website";

			let ninp = document.createElement("input");
			ninp.autocomplete= "off";
			ninp.spellcheck = false;
			ninp.placeholder = "Name"

			n.appendChild(ninp);

		tr.appendChild(n);


		let u = document.createElement("td");
		u.className = "add-url";

			let uinp = document.createElement("input");
			uinp.autocomplete= "off";
			uinp.spellcheck = false;
			uinp.placeholder = "http(s)://www.example.com"

			u.appendChild(uinp);

		tr.appendChild(u);


		let im = document.createElement("td");
		im.className = "add-img";

			let iminp = document.createElement("input");
			iminp.autocomplete= "off";
			iminp.spellcheck = false;
			iminp.placeholder = "example.png"

			im.appendChild(iminp);

		tr.appendChild(im);

		$("#sidebar-websites tbody").append(tr)

		$("#sidebar-websites input").bind('input propertychange', function() {
			Sidebar.focusedInput = {name: $(this).parent().prop("class") == "add-website" ? $(this).val() : $(this).parent().parent().find(".add-website").find("input").val(), input:$(this).parent().prop("class").slice().slice(3, 100)}
			
			let className = $(this).parent().prop("class")
			let val = $(this).val()
			let name = $(this).attr("name")
			var editName = $(this).parent().parent().find(".variable-website").find("input").attr("name");

			chrome.storage.local.get("startpage_settings" , function(e){
				let settings = e.startpage_settings
				let websites = settings.sidebar_websites

				if(className.includes("add")){
					if(!Sidebar.checkEmpty()){
						if(!Sidebar.exists(websites)){
							websites.push({
								name: $("#sidebar-websites .add-website input").val(),
								url: $("#sidebar-websites .add-url input").val(),
								img: $("#sidebar-websites .add-img input").val()
							})
							settings.sidebar_websites = websites;
							chrome.storage.local.set({startpage_settings: settings})

							loadToProfile(true)

						}		
					}
				} else {
					switch(className){
						case "variable-website":
							if(val.replace(/\s/g, '') != "" && websites.filter(website => website.name == val).length == 0){
								websites.filter(website => website.name == name)[0].name = val;
								$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", val);
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false)
							}
						break;
						case "variable-url":
							if(val.replace(/\s/g, '') != "" && websites.filter(website => website.name == editName).length == 1){
								websites.filter(website => website.name == editName)[0].url = val;
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false)
							}
						break;
						case "variable-img":
							if(websites.filter(website => website.name == editName).length == 1){
								websites.filter(website => website.name == editName)[0].img = val;
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false)
							}
						break;
					}
				}

			});
		});

		loadIcons(0)

		// sidebar websites -

		let engines = e.startpage_settings.search_engines;

		// search engines

		$("#search-engines tbody").html("")

		engines.forEach(engine => {
			let tr = document.createElement("tr");

				let m = document.createElement("td");
				m.className = "move";

					let mdiv = document.createElement("div");
					mdiv.className = "table-move";

						let mdivi = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							mdivi.src = e.startpage_settings.darkmode ? "./img/iconfinder_1-icon-music-10_3694736_dark.png" : "./img/iconfinder_1-icon-music-10_3694736.png";
						});

						mdiv.appendChild(mdivi)

					m.appendChild(mdiv);

				tr.appendChild(m);


				let n = document.createElement("td");
				n.className = "variable-engine";

					let ninp = document.createElement("input");
					ninp.autocomplete= "off";
					ninp.value = engine.name;
					ninp.name = engine.name;
					ninp.spellcheck = false;

					n.appendChild(ninp);

				tr.appendChild(n);

				let url = document.createElement("td");
				url.className = "variable-url";

					let urlinp = document.createElement("input");
					urlinp.autocomplete= "off";
					urlinp.value = engine.url;
					urlinp.spellcheck = false;

					url.appendChild(urlinp);

				tr.appendChild(url);

				let col = document.createElement("td");
				col.className = "variable-color";

					let colinp = document.createElement("input");
					colinp.autocomplete= "off";
					colinp.className = "save-color"
					colinp.spellcheck = false;
					colinp.value = engine.color;

					col.appendChild(colinp);

				tr.appendChild(col);

				let cold = document.createElement("td");
				cold.className = "property";

					let colddiv = document.createElement("div");
					colddiv.className = "table-icon table-icon-color";
					colddiv.style = "background-color: " + engine.color

					cold.appendChild(colddiv);

				tr.appendChild(cold);


				let a = document.createElement("td");
				a.className = "action";

					let d = document.createElement("div");
					d.className = "table-icon";

						let i = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							i.src = e.startpage_settings.darkmode ? "./img/bin_dark.jpg" : "./img/bin.jpg";
						});
						i.className = "bin";

						d.appendChild(i)

					a.appendChild(d);

				tr.appendChild(a);

			
			$("#search-engines tbody").append(tr)

		});

		let tre = document.createElement("tr");
		tre.className="add"

		let spe = document.createElement("td")

		tre.appendChild(spe)

		let ne = document.createElement("td");
		ne.className = "add-engine";

			let neinp = document.createElement("input");
			neinp.autocomplete= "off";
			neinp.spellcheck = false;
			neinp.placeholder = "Name"

			ne.appendChild(neinp);

			tre.appendChild(ne);


		let ue = document.createElement("td");
		ue.className = "add-url";

			let ueinp = document.createElement("input");
			ueinp.autocomplete= "off";
			ueinp.spellcheck = false;
			ueinp.placeholder = "...example.com/search?q="

			ue.appendChild(ueinp);

			tre.appendChild(ue);


		let co = document.createElement("td");
		co.className = "add-col";

			let coinp = document.createElement("input");
			coinp.autocomplete= "off";
			coinp.spellcheck = false;
			coinp.placeholder = "#ffffff"

			co.appendChild(coinp);

			tre.appendChild(co);

		$("#search-engines tbody").append(tre)

		$("#search-engines input").bind('input propertychange', function() {
			Engines.focusedInput = {name: $(this).parent().prop("class") == "add-engine" ? $(this).val() : $(this).parent().parent().find(".add-engine").find("input").val(), input:$(this).parent().prop("class").slice().slice(3, 100)}
			
			let className = $(this).parent().prop("class")
			let val = $(this).val()
			let name = $(this).attr("name")
			var editName = $(this).parent().parent().find(".variable-engine").find("input").attr("name");

			if(className == "variable-color") $(this).parent().parent().find(".property").find(".table-icon-color").css("background-color", val)

			chrome.storage.local.get("startpage_settings" , function(e){
				let settings = e.startpage_settings;
				let engines = settings.search_engines;

				if(className.includes("add")){
					if(!Engines.checkEmpty()){
						if(!Engines.exists(engines)){
							engines.push({
								name: $("#search-engines .add-engine input").val(),
								url: $("#search-engines .add-url input").val(),
								color: $("#search-engines .add-col input").val()
							})
							settings.search_engines = engines;
							chrome.storage.local.set({startpage_settings: settings})

							loadToProfile(true);
						}		
					}
				} else {
					switch(className){
						case "variable-engine":
							if(val.replace(/\s/g, '') != "" && engines.filter(engine => engine.name == val).length == 0){
								engines.filter(engine => engine.name == name)[0].name = val;
								$("#search-engines .variable-engine input[name = '" + name + "']").attr("name", val);
								settings.search_engines = engines;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false);
							}
						break;
						case "variable-url":
							if(val.replace(/\s/g, '') != "" && engines.filter(engine => engine.name == editName).length == 1){
								engines.filter(engine => engine.name == editName)[0].url = val;
								settings.search_engines = engines;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false);
							}
						break;
						case "variable-color":
							if(engines.filter(engine => engine.name == editName).length == 1){
								engines.filter(engine => engine.name == editName)[0].color = val;
								settings.search_engines = engines;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false);
							}
						break;
					}
				}
			});
		});

		// search engines -


		if(e.startpage_settings.darkmode){
			$("body").addClass("dark-light")
			$(".block").addClass("dark-dark")
			$(".message-container").addClass("dark-light")
			$(".popup-content").addClass("dark-light")
			$(".cancel").addClass("white-color")
			$("#popup-input").addClass("dark-dark")
			$(".button").addClass("white-after")
			$("#profile-text-export").addClass("dark-light")
			$("#profile-text-import").addClass("dark-light")
			$("input").addClass("dark-dark")
			$(".side-content").addClass("dark-dark")
		} else {
			$("body").removeClass("dark-light")
			$(".block").removeClass("dark-dark")
			$(".message-container").removeClass("dark-light")
			$(".popup-content").removeClass("dark-light")
			$(".cancel").removeClass("white-color")
			$("#popup-input").removeClass("dark-dark")
			$(".button").removeClass("white-after")
			$("#profile-text-export").removeClass("dark-light")
			$("#profile-text-import").removeClass("dark-light")
			$("input").removeClass("dark-dark")
			$(".side-content").removeClass("dark-dark")
		}

		$("#sidebar-websites tr").eq($("#sidebar-websites tr").length - 2).find(".variable" + Sidebar.focusedInput.input + " input").focus();
		Sidebar.focusedInput = {input: undefined, name: undefined};


		$("#search-engines tr").eq($("#search-engines tr").length - 2).find(".variable" + Engines.focusedInput.input + " input").focus();
		Engines.focusedInput = {input: undefined, name: undefined};

		$('#blob input').prop("checked", e.startpage_settings.blob);
		

		$('#weather input').prop("checked", e.startpage_settings.weather);

		
		$('.weather .location .lat input').val(e.startpage_settings.darksky_loc.lat);
		$('.weather .location .lon input').val(e.startpage_settings.darksky_loc.lon);

		$("#darksky").val(e.startpage_settings.darksky_key);

		setAnchors(200)

		updateMoveCenters();
	})
}

function loadMain(i){

	mainIndex = i;

	$(".custom .subcontent .navigation ul li").removeClass("tab-active");
	$("#main-" + i).addClass("tab-active");

	chrome.storage.local.get("startpage_settings", function(s){
		mains = s.startpage_settings.mains;

		$(".custom .main-name").val(mains[i].name)

		$(".custom .main-outer").val(mains[i].outer)
		$(".custom .main-inner").val(mains[i].inner)
		$(".custom .main-fill").val(mains[i].fill)
		$(".custom .main-cover").val(mains[i].cover)
		$(".custom .main-bar").val(mains[i].bar)

		$(".custom .main-url").val(mains[i].url)

		loadMainPreview(mains[i]);
		checkAdvanced();

		let context_menu = mains[i].context;

		// sidebar websites

		$("#context-menu tbody").html("")

		context_menu.forEach(context => {
			let tr = document.createElement("tr");

				let m = document.createElement("td");
				m.className = "move";

					let mdiv = document.createElement("div");
					mdiv.className = "table-move";

						let mdivi = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							mdivi.src = s.startpage_settings.darkmode ? "./img/iconfinder_1-icon-music-10_3694736_dark.png" : "./img/iconfinder_1-icon-music-10_3694736.png";
						});

						mdiv.appendChild(mdivi)

					m.appendChild(mdiv);

				tr.appendChild(m);


				let n = document.createElement("td");
				n.className = "variable-context";

					let ninp = document.createElement("input");
					ninp.autocomplete= "off";
					ninp.value = context.name;
					ninp.name = context.name;
					ninp.spellcheck = false;

					n.appendChild(ninp);

				tr.appendChild(n);

				let url = document.createElement("td");
				url.className = "variable-url";

					let urlinp = document.createElement("input");
					urlinp.autocomplete= "off";
					urlinp.value = context.url;
					urlinp.spellcheck = false;

					url.appendChild(urlinp);

				tr.appendChild(url);

				let a = document.createElement("td");
				a.className = "action";

					let d = document.createElement("div");
					d.className = "table-icon";

						let i = document.createElement("img");
						chrome.storage.local.get('startpage_settings', function(e){
							i.src = s.startpage_settings.darkmode ? "./img/bin_dark.jpg" : "./img/bin.jpg";
						});
						i.className = "bin";

						d.appendChild(i)

					a.appendChild(d);

				tr.appendChild(a);

			
			$("#context-menu tbody").append(tr)

		});

		let tr = document.createElement("tr");
		tr.className="add"

		let sp = document.createElement("td")

		tr.appendChild(sp)

		let n = document.createElement("td");
		n.className = "add-context";

			let ninp = document.createElement("input");
			ninp.autocomplete= "off";
			ninp.spellcheck = false;
			ninp.placeholder = "Name"

			n.appendChild(ninp);

		tr.appendChild(n);


		let u = document.createElement("td");
		u.className = "add-url";

			let uinp = document.createElement("input");
			uinp.autocomplete= "off";
			uinp.spellcheck = false;
			uinp.placeholder = "http(s)://www.example.com"

			u.appendChild(uinp);

		tr.appendChild(u);


		$("#context-menu tbody").append(tr)

		$("#context-menu input").bind('input propertychange', function() {
			Context.focusedInput = {name: $(this).parent().prop("class") == "add-context" ? $(this).val() : $(this).parent().parent().find(".add-context").find("input").val(), input:$(this).parent().prop("class").slice().slice(3, 100)}
			let className = $(this).parent().prop("class")
			let val = $(this).val()
			let name = $(this).attr("name")
			var editName = $(this).parent().parent().find(".variable-context").find("input").attr("name");

			chrome.storage.local.get("startpage_settings" , function(e){
				let settings = e.startpage_settings
				let context_menu = settings.mains[mainIndex].context


				if(className.includes("add")){
					if(!Context.checkEmpty()){
						if(!Context.exists(context_menu)){
							context_menu.push({
								name: $("#context-menu .add-context input").val(),
								url: $("#context-menu .add-url input").val()
							})
							settings.mains[mainIndex].context = context_menu;
							chrome.storage.local.set({startpage_settings: settings})

							loadToProfile(false);
							loadMain(mainIndex);

						}		
					}
				} else {
					switch(className){
						case "variable-context":
							if(val.replace(/\s/g, '') != "" && context_menu.filter(context => context.name == val).length == 0){
								context_menu.filter(context => context.name == name)[0].name = val;
								$("#context-menu .variable-context input[name = '" + name + "']").attr("name", val);
								settings.mains[mainIndex].context = context_menu;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false);
								loadMain(mainIndex);
							}
						break;
						case "variable-url":
							if(val.replace(/\s/g, '') != "" && context_menu.filter(context => context.name == editName).length == 1){
								context_menu.filter(context => context.name == editName)[0].url = val;
								settings.mains[mainIndex] = context_menu;
								chrome.storage.local.set({startpage_settings: settings})

								loadToProfile(false);
								loadMain(mainIndex);
							}
						break;
					}
				}
			});
		});

		
		$("#context-menu tr").eq($("#context-menu tr").length - 2).find(".variable" + Context.focusedInput.input + " input").focus();
		Context.focusedInput = {input: undefined, name: undefined};
	})

}

function loadMainPreview(main){

	$(".main-1 .outer").css("border-color", "rgb(170, 170, 170)")
	$(".main-1 .outer").css("background-color", "rgb(170, 170, 170, 0.15)")
	$(".main-1 .inner").css("border-color", "rgb(170, 170, 170)")
	$(".main-1 .cover").css("background-color", "rgb(170, 170, 170)")

	if(main.advanced){

		$(".main-1 .outer").css("border-color", main.cover)
		$(".main-1 .outer").css("background-color", main.cover)
		$(".main-1 .inner").css("border-color", main.cover)
		$(".main-1 .cover").css("background-color", main.cover)

		$(".main-1 .outer").css("border-color", main.outer)
		$(".main-1 .outer").css("background-color", main.fill)
		$(".main-1 .inner").css("border-color", main.inner)
		$(".main-1 .cover").css("background-color", main.cover)

	} else {
		cover = main.cover
		$(".main-1 .outer").css("border-color", cover)
		$(".main-1 .inner").css("border-color", cover)
		$(".main-1 .cover").css("background-color", cover)
		
		if(cover.replace(/\s/g, '') != ""){
			if(cover.indexOf(",") != -1){
				if(cover.match(new RegExp(",", "g")).length == 3){
					$(".main-1 .outer").css("background-color", cover.slice(0, nth_occurrence(cover, ",", 3)) + ", 0.15)")
				} else if(cover.match(new RegExp(",", "g")).length == 2){
					$(".main-1 .outer").css("background-color", cover.slice(0, cover.length-1) + ", 0.15)")
				}
			} else {
				if(cover.indexOf("#") == 0){
					if(cover.length == 7){
						$(".main-1 .outer").css("background-color", cover + "26")
					}
				}
			}
		}
	}
	
	$(".custom .main-img").val(main.img)

	let src = ""
	if(main.img.indexOf("file:///") == 0 || main.img.indexOf("http://") == 0 || main.img.indexOf("https://") == 0){
		src = main.img;
	} else {
		src = "/startpage/img/main/" + main.img
	}

	if(src.replace(/\s/g, '') != "" && src.split(".").length > 1){
		$.get(src)
		.done(function() { 
	
			$(".img-1").attr("src", src)

		}).fail(function() { 

			$(".img-1").attr("src", src)
		})
	} else {
		
		$(".img-1").attr("src", src)
	}
}

function checkAdvanced(){
	chrome.storage.local.get("startpage_settings", function(s){
		if(!s.startpage_settings.mains[mainIndex].advanced){
			$(".custom .advanced-container").css("display", "none")
			$(".advanced").css("transform", "rotate(0deg)")
			$(".main-preview").removeClass("main-preview-active")
			$(".main-p-resources").css("margin-top", "90px");
			$(".main #main-color").text("")
			$(".main #main-color-mode").removeClass("main-color-mode-advanced")
		} else {
			$(".custom .advanced-container").css("display", "block")
			$(".advanced").css("transform", "rotate(90deg)")
			$(".main-preview").addClass("main-preview-active")
			$(".main-p-resources").css("margin-top", "30px");
			$(".main #main-color").text("Cover:")
			$(".main #main-color-mode").addClass("main-color-mode-advanced")
		}
		loadMainPreview(s.startpage_settings.mains[mainIndex]);
	})

	setAnchors(200);
	
	// updateMoveCenters();
}

function highlight(i){
	$.each($(".side-content h4"), function(j){
		if(i == j){
			$(".side-content h4").eq(j).addClass("opacity-1");
		} else {
			$(".side-content h4").eq(j).removeClass("opacity-1");
		}
	})
}

function loadIcons(i){
	if(i < $("#sidebar-websites .variable-website").length){
		let val = $("#sidebar-websites .variable-website").eq(i).parent().find(".variable-img").find("input").val()
		if(!(val.indexOf("file:///") == 0 || val.indexOf("http://") == 0 || val.indexOf("https://") == 0)) val =  "/startpage/img/sidebar/" + val
		
		if(val.replace(/\s/g, '') != "" && val.split(".").length > 1){
			$.get(val)
			.done(function() { 
				$("#sidebar-websites .variable-website").eq(i).parent().find(".property").find(".table-icon-img").attr("src", val)
				loadIcons(i + 1)
			}).fail(function() { 
				loadIcons(i + 1)
			})
		} else {
			loadIcons(i + 1)
		}
	}
}

function loadFromProfile(name, force){
	chrome.storage.local.get("startpage_selected_profile", function(e){
		if(e.startpage_selected_profile == name && !force){
			chrome.storage.local.set({
				startpage_selected_profile: ""
			});
			updateDisplay();
		} else {
			chrome.storage.local.set({
				startpage_selected_profile: name
			});
			chrome.storage.local.get("startpage_profiles" ,function(e){
				let startpage_profiles = e.startpage_profiles;
				chrome.storage.local.set({
					startpage_settings: startpage_profiles.filter(profile => profile.name == name)[0].settings
				});
				updateDisplay();
			})
		}
	});
}

function loadToProfile(updatedisplay){
	chrome.storage.local.get("startpage_settings", function(s){
		chrome.storage.local.get("startpage_selected_profile", function(sp){
			chrome.storage.local.get("startpage_profiles", function(pr){
				let settings = s.startpage_settings;
				let selected = sp.startpage_selected_profile;
				let profiles = pr.startpage_profiles;

				if(selected != ""){
					if(profiles.filter(profile => profile.name == selected).length == 1){
						profiles.filter(profile => profile.name == selected)[0].settings = settings;
						chrome.storage.local.set({startpage_profiles: profiles})
						if(updatedisplay) updateDisplay();
					}
				}
			})
		})
	})
}

function removeElement(elementId) {
	var element = document.getElementById(elementId);
	if(element != null){
		element.parentNode.removeChild(element);
	}
}

function moveWebsiteFromTo(from, to, settings){
	let websites = settings.sidebar_websites;
	if(from != to && from < websites.length && to <= websites.length && from >= 0 && to >= 0){
		let movingElement = websites[from];
		websites[from] = undefined;
		to == websites.length ? websites.push(movingElement) : websites.splice(to, 0, movingElement)
		websites.splice(websites.indexOf(undefined), 1)
		settings.sidebar_websites = websites;
		chrome.storage.local.set({startpage_settings: settings})
		loadToProfile(true)
	}
}

function moveEngineFromTo(from, to, settings){
	let engines = settings.search_engines;
	if(from != to && from < engines.length && to <= engines.length && from >= 0 && to >= 0){
		let movingElement = engines[from];
		engines[from] = undefined;
		to == engines.length ? engines.push(movingElement) : engines.splice(to, 0, movingElement)
		engines.splice(engines.indexOf(undefined), 1)
		settings.search_engines = engines;
		chrome.storage.local.set({startpage_settings: settings})
		loadToProfile(true)
	}
}

function moveContextFromTo(from, to, settings){
	let context_menu = settings.mains[mainIndex].context;
	if(from != to && from < context_menu.length && to <= context_menu.length && from >= 0 && to >= 0){
		let movingElement = context_menu[from];
		context_menu[from] = undefined;
		to == context_menu.length ? context_menu.push(movingElement) : context_menu.splice(to, 0, movingElement)
		context_menu.splice(context_menu.indexOf(undefined), 1)
		settings.mains[mainIndex].context = context_menu;
		chrome.storage.local.set({startpage_settings: settings})
		loadToProfile(true)
		loadMain(mainIndex);
	}
}

function startDarkCheck(){
	if($(":focus").length == 0){
		chrome.runtime.sendMessage({action: "update_dark"}, function(response) {
			updateDisplay();
			loadMain(mainIndex);
		});
	}
    var t = setTimeout(startDarkCheck, 30000)
}

function updateMoveCenters(){
	Drag.engines.centers = []
	$.each($("#search-engines .move"), function(i){
		Drag.engines.centers.push({
			name: $("#search-engines .move").eq(i).parent().find(".variable-engine").find("input").val(),
			mid: $("#search-engines .move").eq(i).find("div").find("img").offset().top + 11
		})
	})
	Drag.sidebar.centers = []
	$.each($("#sidebar-websites .move"), function(i){
		Drag.sidebar.centers.push({
			name: $("#sidebar-websites .move").eq(i).parent().find(".variable-website").find("input").val(),
			mid: $("#sidebar-websites .move").eq(i).find("div").find("img").offset().top + 11
		})
	})
	Drag.context.centers = []
	$.each($("#context-menu .move"), function(i){
		Drag.context.centers.push({
			name: $("#context-menu .move").eq(i).parent().find(".variable-context").find("input").val(),
			mid: $("#context-menu .move").eq(i).find("div").find("img").offset().top + 11
		})
	})
}

function setAnchors(offset){
	anchor = [
		$(".resources").offset().top - offset,
		$(".profiles").offset().top - offset,
		$(".basic").offset().top - offset,
		$(".sidebar").offset().top - offset,
		$(".custom").offset().top - offset,
		$(".blob").offset().top - offset,
		$(".weather").offset().top - offset
	]
}

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}

var Profile_io = {
		click: function(clicked){
			if(Profile_io.active == clicked){
				Profile_io.active = "";
				Profile_io.action();
			} else {
				Profile_io.active = clicked;
				Profile_io.action(clicked);
			}
		},
		active: "",
		action: function(action){
			switch(action){
				case "export":
					chrome.storage.local.get("startpage_profiles", function(e){
						$("#profile-text-export").text(JSON.stringify(e.startpage_profiles, null, 6));
						$("#profile-text-import").hide();
						$("#profile-text-export").show();
						$("#profile-text-export").select();
						$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
						$("#profile-export").addClass("button-action-active")
						$("#profile-import").removeClass("button-action-active")
					})
				break;
				case "import":
					$("#profile-text-export").hide();
					$("#profile-text-import").show();
					$("#profile-text-import").focus();
					$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
					try {
						Profile_io.import_temp = JSON.parse($("#profile-text-import").val())
						if(Profile_io.valid(Profile_io.import_temp)){
							$("#profile-import-confirm").addClass("profile-import-confirm-ready");
						}
			
					} catch(e){
						$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
						console.log(e)
						Profile_io.import_temp = undefined;
					}
					$("#profile-import").addClass("button-action-active")
					$("#profile-export").removeClass("button-action-active")
				break;
				default:
					$("#profile-text-export").hide();
					$("#profile-text-import").hide();
					$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
					$("#profile-import").removeClass("button-action-active")
					$("#profile-export").removeClass("button-action-active")
				break;
			}
			setTimeout(function(){setAnchors(200); updateMoveCenters()}, 100);
		},
		import: function(){
			chrome.storage.local.get("startpage_profiles", function(e){
				chrome.storage.local.get("startpage_selected_profile", function(a){

					let startpage_profiles = e.startpage_profiles, selected = a.startpage_selected_profile;
					Profile_io.import_temp.forEach(i_profile => {
						startpage_profiles.forEach(s_profile => {
							if(i_profile.name == s_profile.name){
								startpage_profiles[startpage_profiles.indexOf(s_profile)] = i_profile;
								if(s_profile.name == selected){
									loadFromProfile(selected, true)
								}
							} else {
								startpage_profiles.push(i_profile);
							}
						});
					});
					chrome.storage.local.set({startpage_profiles: startpage_profiles})
					$("#profile-text-import").val("")
					Profile_io.active = "";
					Profile_io.action();
					updateDisplay();
					loadMain[mainIndex]
				});
			});
		},
		valid: function(profiles){
			let valid = true;
			profiles.forEach(profile => {
				if(typeof(profile.name) !== "string" || profile.name == "") valid = false;
				if(typeof(profile.settings) !== "object"){ valid = false;} else {
					if(typeof(profile.settings.blob) !== "boolean") valid = false;
					if(typeof(profile.settings.darkmode) !== "boolean") valid = false;
					if(typeof(profile.settings.darkmode_auto) !== "boolean") valid = false;
					if(typeof(profile.settings.darkmode_auto_time) !== "object") {valid = false;} else {
						if(typeof(profile.settings.darkmode_auto_time.from) !== "string") {valid = false;} else {
							if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(profile.settings.darkmode_auto_time.from))) valid = false;
						}
						if(typeof(profile.settings.darkmode_auto_time.to) !== "string") {valid = false;} else {
							console.log(Number.isInteger(profile.settings.darkmode_auto_time.to) , profile.settings.darkmode_auto_time.to > 0 , profile.settings.darkmode_auto_time.to < 2400)
							if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(profile.settings.darkmode_auto_time.to))) valid = false;
						}
					}

					if(!Array.isArray(profile.settings.search_engines)) {valid = false;} else {
						profile.settings.search_engines.forEach(engine => {
							if(typeof(engine.color) !== "string") valid = false;
							if(typeof(engine.name) !== "string" || engine.name.replace(/\s/g, '') == "") valid = false;
							if(typeof(engine.url) !== "string" || engine.url.replace(/\s/g, '') == "") valid = false;
						});
					}

					if(!Array.isArray(profile.settings.mains)) {valid = false;} else {
						profile.settings.mains.forEach(main => {

							if(typeof(main.name) !== "string" || main.name.replace(/\s/g, '') == "") valid = false;

							if(typeof(main.advanced) !== "boolean") valid = false;

							if(typeof(main.cover) !== "string" || main.cover.replace(/\s/g, '') == "") valid = false;

							if(typeof(main.bar) !== "string") valid = false;
							if(typeof(main.fill) !== "string") valid = false;
							if(typeof(main.inner) !== "string") valid = false;
							if(typeof(main.outer) !== "string") valid = false;
							
							if(typeof(main.img) !== "string") valid = false;

							if(typeof(main.url) !== "string" || main.url.replace(/\s/g, '') == "") valid = false;
						
							if(!Array.isArray(main.context)) {valid = false;} else {
								main.context.forEach(context => {
								
									if(typeof(context.name) !== "string" || context.name.replace(/\s/g, '') == "") valid = false;
									if(typeof(context.url) !== "string" || context.url.replace(/\s/g, '') == "") valid = false;
								});
							}
						});
					}

	
					if(typeof(profile.settings.darksky_key) !== "string") valid = false;
					if(typeof(profile.settings.darksky_loc) !== "object") {valid = false;} else {
						if(typeof(profile.settings.darksky_loc.lat) !== "number") valid = false;
						if(typeof(profile.settings.darksky_loc.lon) !== "number") valid = false;
					}
	
					if(typeof(profile.settings.sidebar) !== "boolean") valid = false;
					if(!Array.isArray(profile.settings.sidebar_websites)) {valid = false} else {

						profile.settings.sidebar_websites.forEach(website => {
							if(typeof(website) !== "object") {valid = false;} else {
								if(typeof(website.img) !== "string") valid = false;
								if(typeof(website.name) !== "string" || website.name.replace(/\s/g, '') == "") valid = false;
								if(typeof(website.url) !== "string" || website.url.replace(/\s/g, '') == "") valid = false;
							}
						});
					}
					console.log(valid)
					if(typeof(profile.settings.weather) !== "boolean") valid = false;
				}
			});

			return valid;
		},
		editName: "",
		import_temp: undefined
	},
	Popup = {
		topic: "",
		open: function(topic){
			Popup.topic = topic;
			switch(Popup.topic){
				case "clearalldata":
					$(".popup-title").text("Clear all data?")
					$(".popup-info").text("Click 'Confirm' to delete all search queries that have been saved to deliver autocomplete suggestions")
				break;
				case "newProfile":
					$(".popup-title").text("New profile")
					$(".popup-info").text("Please Enter A Name")
					$("#popup-input").addClass("popup-input-active")
					$("#popup-input").val("");
				break;
				case "overwriteProfiles":
					$(".popup-title").text("Overwrite existing profiles?")
					$(".popup-info").text("Some profiles have conflicting properties. Click 'Confirm' to replace the affected profiles with your imported ones")
				break;
		
				default:
				break;
			}
			$(".popup").addClass("popup-active");
			$("body > :not('.popup')").addClass("blur")
		},
		close: function(){
			$(".popup").removeClass("popup-active");
			$("#popup-input").removeClass("popup-input-active")
			$("#popup-input").removeClass("input-error")
			$("body > :not('.popup')").removeClass("blur")
			updateDisplay();
			Popup.topic = "";
		},
		confirm: function(){
			switch(Popup.topic){
				case "clearalldata":
	
					chrome.storage.local.get("startpage_autocomplete", function(e){
						let startpage_autocomplete = e.startpage_autocomplete;
						chrome.storage.local.set({startpage_autocomplete:{
							enabled: startpage_autocomplete.enabled,
							suggestions: [],
							last: ""
						}})
						Popup.close();
						updateDisplay();
					})
				break;
				case "newProfile":
					alreadyExists = false;
					chrome.storage.local.get("startpage_profiles", function(e){
						e.startpage_profiles.forEach(profile => {
							if(profile.name == $("#popup-input").val()){
								alreadyExists = true;
							}
						});

						if(!alreadyExists && $("#popup-input").val() != ""){
							let newp = {}
							newp.name = $("#popup-input").val()
							chrome.storage.local.get("startpage_settings", function(a){
								newp.settings = a.startpage_settings;
								
								e.startpage_profiles.push(newp)
								chrome.storage.local.set({
									startpage_selected_profile: newp.name
								});
								
								let startpage_profiles = e.startpage_profiles;
								chrome.storage.local.set({startpage_profiles: startpage_profiles})
	
								Popup.close();
							})
						} else {
							$("#popup-input").addClass("input-error");
						}
	
					});
					
				break;

				case "overwriteProfiles":
					Profile_io.import();
					Popup.close();
				break;
		
				default:
				break;
			}
		}
	},
	Sidebar = {
		checkEmpty: function(){
			if($(":focus").length != 0){
				if($(":focus").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-website").find("input").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-url").find("input").val().replace(/\s/g, '') == "") return true;
			}
			return false;
		},
		exists:function(websites){
			return websites.filter(website => {
				return website.name == $("#sidebar-websites .add-website input").val()
			}).length != 0;
		},
		focusedInput: {name: undefined, input:undefined},
		lastValidEntry: undefined
	},
	Context = {
		checkEmpty: function(){
			if($(":focus").length != 0){
				if($(":focus").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-context").find("input").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-url").find("input").val().replace(/\s/g, '') == "") return true;
			}
			return false;
		},
		exists:function(context_menu){
			return context_menu.filter(context => {
				return context.name == $("#context-menu .add-context input").val()
			}).length != 0;
		},
		focusedInput: {name: undefined, input:undefined},
		lastValidEntry: undefined
	},
	Engines = {
		checkEmpty: function(){
			if($(":focus").length != 0){
				if($(":focus").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-engine").find("input").val().replace(/\s/g, '') == "") return true;
				if($(":focus").parent().parent().find(".add-url").find("input").val().replace(/\s/g, '') == "") return true;
			}
			return false;
		},
		exists:function(engines){
			return engines.filter(engine => {
				return engine.name == $("#search-engines .add-engine input").val()
			}).length != 0;
		},
		focusedInput: {name: undefined, input:undefined},
		lastValidEntry: undefined
	},
	Drag = {
		engines: {
			dragging: false,
			element: undefined,
			newIndex: -1,
			centers: []
		},
		sidebar: {
			dragging: false,
			element: undefined,
			newIndex: -1,
			centers: []
		},
		context: {
			dragging: false,
			element: undefined,
			newIndex: -1,
			centers: []
		}
	},
	autoIcon = {
		get: function(url, name){
			chrome.storage.local.set({startpage_autoIcon: {active: true, href: "", name: name}});
			chrome.runtime.sendMessage({navigate: url, newTab: true})
		}
	},
	checkboxes = [
		"darkmode",
		"darkmode_auto",
		"sidebar",
		"blob",
		"weather"
	],
	autocompleteLastValidEntry,
	anchor = [],
	mainIndex = -1;

	
startDarkCheck();

$(function(){

	loadMain(0)

	setTimeout(function(){
		$(window).on("scroll", function(){
			let s = $(window).scrollTop()
			if(s < anchor[0]){
				highlight(-1)
			} else if (s >= anchor[0] && s < anchor[1]){
				highlight(0)
			} else if (s >= anchor[1] && s < anchor[2]){
				highlight(1)
			} else if (s >= anchor[2] && s < anchor[3]){
				highlight(2)
			} else if (s >= anchor[3] && s < anchor[4]){
				highlight(3)
			} else if (s >= anchor[4] && s < anchor[5]){
				highlight(4)
			} else if (s >= anchor[5] && s < anchor[6]){
				highlight(5)
			}
		})
		setTimeout(function(){
			$("body").addClass("smooth-bg")
		}, 500)
	}, 500)

	// path

	document.getElementById("path").innerText = chrome.extension.getURL("/startpage/startpage.html")

	// autodark

	$(".time-input input").eq(0).bind('input propertychange', function() {
		$(this).parent().css("width", $(this).width()  - 30 + "px")
		val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			settings = e.startpage_settings;
			settings.darkmode_auto_time.from = val;
			chrome.storage.local.set({startpage_settings:settings})

			loadToProfile(false);
		})
	});
	
	$(".time-input input").eq(1).bind('input propertychange', function() {
		$(this).parent().css("width", $(this).width()  - 30 + "px")
		val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			settings = e.startpage_settings;
			settings.darkmode_auto_time.to = val;
			chrome.storage.local.set({startpage_settings:settings})

			loadToProfile(false);
		})
	});
	
	$(".time-input input").on('focusin', function() {
		$(this).parent().css("width", $(this).width()  - 30 + "px")
	});
	
	$(".time-input input").on('focusout', function() {
		$(this).parent().css("width", $(this).width()  - 30 + "px")
		chrome.runtime.sendMessage({action: "update_dark"}, function(response) {
			updateDisplay();
		});
	});
	
	// autocomplete
	
	$(document).on("focusin", "#autocomplete-suggestions .variable-item input", function(){
		var name = $(this).attr("name")
		autocompleteLastValidEntry = name
	});
	
	$(document).on("keypress", "#autocomplete-suggestions .variable-item input", function(e){
		if(e.which == 13){
			console.log("subnit")
			let val = $(this).val()
			let name = $(this).attr("name")
			let engine = $(this).parent().siblings().eq(0).text()
			let autolastValid = autocompleteLastValidEntry;
			
			chrome.storage.local.get("startpage_autocomplete", function(e){
				startpage_autocomplete = e.startpage_autocomplete;
				suggestions = startpage_autocomplete.suggestions;
	
				if(val.replace(/\s/g, '') == "" || val != name){
					if(autolastValid != undefined){
						suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine)[0].query = autolastValid;
						$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").val(autolastValid)
						$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", autolastValid)
						startpage_autocomplete.suggestions = suggestions;
						chrome.storage.local.set({startpage_autocomplete: {
							enabled: startpage_autocomplete.enabled,
							suggestions: suggestions,
							last: startpage_autocomplete.last
						}})
					}
				}
				updateDisplay();
			});	
		}
	})
	
	$(document).on("focusout", "#autocomplete-suggestions .variable-item input" ,function(){
	
		let val = $(this).val()
		let name = $(this).attr("name")
		let engine = $(this).parent().siblings().eq(0).text()
		let autolastValid = autocompleteLastValidEntry;
		
		chrome.storage.local.get("startpage_autocomplete", function(e){
			startpage_autocomplete = e.startpage_autocomplete;
			suggestions = startpage_autocomplete.suggestions;
	
			if(val.replace(/\s/g, '') == "" || val != name){
				if(autolastValid != undefined){
					console.log(suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine))
					suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine)[0].query = autolastValid;
					$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").val(autolastValid)
					$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", autolastValid)
					startpage_autocomplete.suggestions = suggestions;
					chrome.storage.local.set({startpage_autocomplete: {
						enabled: startpage_autocomplete.enabled,
						suggestions: suggestions,
						last: startpage_autocomplete.last
					}})
				}
			}
			updateDisplay();
		});				
	});

	$(document).on("focusout", "#autocomplete-suggestions .variable-url input" ,function(){
		loadToProfile(true)
	});

	$(document).on("focusout", "#autocomplete-suggestions .variable-color input" ,function(){
		loadToProfile(true)
	});
	
	$(document).on("click", "#autocomplete-suggestions .action", function(){
		let qname = $(this).siblings().eq(0).eq(0).children().eq(0).attr("name")
		let qengine = $(this).siblings().eq(1).text()
		chrome.storage.local.get("startpage_autocomplete", function(e){
			let queries = e.startpage_autocomplete.suggestions;
			queries.forEach(query => {
				if(query.query.toUpperCase() == qname.toUpperCase() && query.engine == qengine){
					queries.splice(queries.indexOf(query), 1)
				}
			});
	
			let startpage_autocomplete = e.startpage_autocomplete;
			chrome.storage.local.set({startpage_autocomplete:{
				enabled: startpage_autocomplete.enabled,
				suggestions: queries,
				last: startpage_autocomplete.last
			}})
			updateDisplay();
		})
	})

	$("#clearalldata").on("click", function(){
		Popup.open("clearalldata");
	});

	// engines

	$(document).on("focusin", "#search-engines .variable-engine input", function(){
				
		var name = $(this).attr("name")
		Engines.lastValidEntry = name
	});
	
	$(document).on("click", "#search-engines .action", function(){
		let name = $(this).parent().find(".variable-engine").children(0).val()
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			let engines = settings.search_engines;
			if(engines.length > 1){
				engines.forEach(engine => {
					if(engine.name == name){
						engines.splice(engines.indexOf(engine), 1)
					}
				});
		
				settings.search_engines = engines;
				chrome.storage.local.set({startpage_settings:settings});
				loadToProfile(true);
			}
		})
	})
	
	$(document).on("keypress", "#search-engines .variable-engine input", function(e){
		if(e.which == 13){
			let lastValid = Sidebar.lastValidEntry;
			let val = $(this).val()
			let name = $(this).attr("name")
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				engines = settings.search_engines;
	
				if(val.replace(/\s/g, '') == "" || val != name){
					if(lastValid != undefined){
						engines.filter(engine => engine.name == name)[0].name = lastValid;
						$("#search-engines .variable-engine input[name = '" + name + "']").val(lastValid)
						$("#search-engines .variable-engine input[name = '" + name + "']").attr("name", lastValid)
						settings.search_engines = engines;
						chrome.storage.local.set({startpage_settings: settings});
					}
				}
	
				loadToProfile(true);
			});	
		}
	})
	
	$(document).on("focusout", "#search-engines .variable-engine input" , function(){
		let lastValid = Engines.lastValidEntry;
		let val = $(this).val()
		let name = $(this).attr("name")
		chrome.storage.local.get("startpage_settings", function(e){
			settings = e.startpage_settings;
			engines = settings.search_engines;
	
			if(val.replace(/\s/g, '') == "" || val != name){
				if(lastValid != undefined){
					engines.filter(engine => engine.name == name)[0].name = lastValid;
					$("#search-engines .variable-engine input[name = '" + name + "']").val(lastValid)
					$("#search-engines .variable-engine input[name = '" + name + "']").attr("name", lastValid)
					settings.search_engines = engines;
					chrome.storage.local.set({startpage_settings: settings});

				}
			} else {
				chrome.storage.local.get("startpage_autocomplete", function(a){
					auto = a.startpage_autocomplete
					sugs = auto.suggestions;
	
					sugs.filter(sug => sug.engine == Engines.lastValidEntry).forEach(sug => {
						sug.engine = val
					})

					auto.suggestions = sugs
					chrome.storage.local.set({startpage_autocomplete: auto})
				})
			}

			loadToProfile(true);
		});				
	});

	$(document).on("focusout", "#search-engines .variable-color input" , function(){
		loadToProfile(true);
	});
	
	// profiles
	
	$(document).on("click", "#profile-list .edit", function(){
		removeElement("edit");
		let input = document.createElement("input");
		input.autocomplete= "off";
		input.id = "edit";
		input.spellcheck = false;
		$(this).parent().siblings().eq(0).append(input);
		Profile_io.editName = $(this).parent().siblings().eq(0).text()
		$("#edit").val(Profile_io.editName)
		$("#edit").focus();
	});
	
	$(document).on("focusout", "#edit" ,function(){
		alreadyExists = false;
		newName = $(this).val()
		chrome.storage.local.get("startpage_profiles", function(e){
			
			let startpage_profiles = e.startpage_profiles;
			startpage_profiles.forEach(profile => {
				if(profile.name == newName && profile.name != Profile_io.editName){
					alreadyExists = true;
				}
			});
	
			if(!alreadyExists && newName != ""){
				
				chrome.storage.local.get("startpage_selected_profile", function(a){
					let selected = a.startpage_selected_profile
					
					if(selected == Profile_io.editName){
						chrome.storage.local.set({
							startpage_selected_profile: newName
						});
					}
	
					startpage_profiles.filter(profile => profile.name == Profile_io.editName)[0].name = newName;
					
					chrome.storage.local.set({startpage_profiles: startpage_profiles})
	
					updateDisplay();
	
				});
			}
			// removeElement("edit")
		});
	});
	
	$(document).on("keydown", "#edit", function(ev){
		switch(ev.keyCode){
			case 13:
				alreadyExists = false;
				newName = $(this).val()
				chrome.storage.local.get("startpage_profiles", function(e){
					
					let startpage_profiles = e.startpage_profiles;
					startpage_profiles.forEach(profile => {
						if(profile.name == newName && profile.name != Profile_io.editName){
							alreadyExists = true;
						}
					});
	
					if(!alreadyExists && newName != ""){
						
						chrome.storage.local.get("startpage_selected_profile", function(a){
							let selected = a.startpage_selected_profile
							
							if(selected == Profile_io.editName){
								chrome.storage.local.set({
									startpage_selected_profile: newName
								});
							}
	
							startpage_profiles.filter(profile => profile.name == Profile_io.editName)[0].name = newName;
							
							chrome.storage.local.set({startpage_profiles: startpage_profiles})
	
							updateDisplay();
	
						});
					} else {
						console.log("nope")
						$("#edit").addClass("input-error");
					}
				});
			break;
		}
		$(this).removeClass("input-error")
	})
	
	$(document).on("click", "#profile-list .action", function(){
	
		var name = $(this).siblings().eq(0).eq(0).text();
	
		chrome.storage.local.get("startpage_profiles", function(e){
			let startpage_profiles = e.startpage_profiles;
			let index;
			startpage_profiles.forEach(profile => {
				if(profile.name == name){
					index = startpage_profiles.indexOf(profile)
					startpage_profiles.splice(index, 1)
				}
			});
			chrome.storage.local.set({startpage_profiles:startpage_profiles})
			if(index > 0){
				loadFromProfile(startpage_profiles[index-1].name)
			}
		})
	})
	
	$(document).on("click", "#profile-list .item-text", function(){
		if($(this).find("#edit").length == 0){
			let name = this.innerText;
			loadFromProfile(name, false);
		}
	})
	
	$(document).on("click", "#profile-list .property", function(ev){
		var setting
		switch($(this).children().text()){
			case "S":
				setting = "sidebar"
			break;
			case "B":
				setting = "blob"
			break;
			case "W":
				setting = "weather"
			break;
			case "":
				if($(this).children().eq(0).prop("class").includes("darkmode-o")){
					setting = "darkmode";
				}
			break;
			
			default:
			break;
		}
		if(setting != undefined){
	
			var name = $(this).siblings().eq(0).eq(0).text()
	
			chrome.storage.local.get("startpage_selected_profile", function(e){
				chrome.storage.local.get("startpage_profiles", function(a){
					let startpage_profiles = a.startpage_profiles;
					if(e.startpage_selected_profile == name){
						chrome.storage.local.get("startpage_settings", function(s){
							settings = s.startpage_settings;
							settings[setting] = !(startpage_profiles.filter(profile => profile.name == name)[0].settings[setting])
							chrome.storage.local.set({startpage_settings:settings});
	
							startpage_profiles.filter(profile => profile.name == name)[0].settings[setting] = !(startpage_profiles.filter(profile => profile.name == name)[0].settings[setting])
							chrome.storage.local.set({startpage_profiles: startpage_profiles})
	
							updateDisplay();
						})
						
					} else {
	
						let startpage_profiles = a.startpage_profiles;
						startpage_profiles.filter(profile => profile.name == name)[0].settings[setting] = !(startpage_profiles.filter(profile => profile.name == name)[0].settings[setting])
						chrome.storage.local.set({startpage_profiles: startpage_profiles})
	
						updateDisplay();
	
					}
				});
			});
		}
	});

	$("#profile-new").click(function(){Popup.open("newProfile")});

	$("#profile-import").click(function(){Profile_io.click("import")});

	$("#profile-export").click(function(){Profile_io.click("export")});

	$("#profile-text-import").bind('input propertychange', function() {
		try {
			Profile_io.import_temp = JSON.parse($("#profile-text-import").val())
			if(Profile_io.valid(Profile_io.import_temp)){
				$("#profile-import-confirm").addClass("profile-import-confirm-ready");
			}

		} catch(e){
			$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
			console.log(e)
			Profile_io.import_temp = undefined;
		}
	});

	$("#profile-text-import").on('keydown', function(ev) {
		if(ev.keyCode == 9) ev.preventDefault();
	});

	$("#profile-import-confirm").on("click", function(){
		if(Profile_io.import_temp != undefined){
			chrome.storage.local.get("startpage_profiles", function(e){
				let startpage_profiles = e.startpage_profiles, existing = []
				startpage_profiles.forEach(profile => {
					existing.push(profile.name)
				});
				if(Profile_io.import_temp.filter(profile => existing.includes(profile.name)).length != 0){
					Popup.open("overwriteProfiles");
				} else {
					Profile_io.import()
				}
			});
		}
	});
	
	$("#profile-text-export").on("click", function(){$(this).select()});

	$("#profile-text-export").on("keyup", function(ev){
		if(ev.keyCode == 67 && ev.ctrlKey) Profile_io.click();
	});
	
	// websites

	$(document).on("focusin", "#sidebar-websites .variable-website input", function(){
		var name = $(this).attr("name")
		Sidebar.lastValidEntry = name
	});
	
	$(document).on("click", "#sidebar-websites .action", function(){
		let name = $(this).parent().find(".variable-website").children(0).val()
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			let websites = settings.sidebar_websites;
			websites.forEach(website => {
				if(website.name == name){
					websites.splice(websites.indexOf(website), 1)
				}
			});
	
			settings.sidebar_websites = websites;
			chrome.storage.local.set({startpage_settings:settings});
			
			loadToProfile(true);
		})
	})
	
	$(document).on("keypress", "#sidebar-websites .variable-website input", function(e){
		if(e.which == 13){
			let lastValid = Sidebar.lastValidEntry;
			let val = $(this).val()
			let name = $(this).attr("name")
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				websites = settings.sidebar_websites;
	
				if(val.replace(/\s/g, '') == "" || val != name){
					if(lastValid != undefined){
						websites.filter(website => website.name == name)[0].name = lastValid;
						$("#sidebar-websites .variable-website input[name = '" + name + "']").val(lastValid)
						$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", lastValid)
						settings.sidebar_websites = websites;
						chrome.storage.local.set({startpage_settings: settings});
					}
				}
	
				loadToProfile(true);
			});	
		}
	})
	
	$(document).on("focusout", "#sidebar-websites .variable-website input" , function(){
		let lastValid = Sidebar.lastValidEntry;
		let val = $(this).val()
		let name = $(this).attr("name")
		chrome.storage.local.get("startpage_settings", function(e){
			settings = e.startpage_settings;
			websites = settings.sidebar_websites;
	
			if(val.replace(/\s/g, '') == "" || val != name){
				if(lastValid != undefined){
					websites.filter(website => website.name == name)[0].name = lastValid;
					$("#sidebar-websites .variable-website input[name = '" + name + "']").val(lastValid)
					$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", lastValid)
					settings.sidebar_websites = websites;
					chrome.storage.local.set({startpage_settings: settings});
				}
			}
			
			loadToProfile(true);
		});				
	});

	$(document).on("focusout", "#sidebar-websites .variable-url input" ,function(){
		loadToProfile(true)
	});

	$(document).on("focusout", "#sidebar-websites .variable-img input" ,function(){
		loadToProfile(true)
	});

	$(document).on("click", "#sidebar-websites .property", function(){
		url = $(this).parent().find(".variable-url").find("input").val();
		if(url.indexOf("://") > 0){
			autoIcon.get(url, $(this).parent().find(".variable-website").find("input").val());
			setTimeout(function(){
				loadToProfile(true)
				chrome.storage.local.set({startpage_autoIcon: {active: false, href:"", name:""}})
			}, 3000);
		}
	});
	
	// websites move
	
	$(document).on("mousedown", "#sidebar-websites .table-move img", function(e){
		Drag.sidebar.dragging = true;
		Drag.sidebar.element = $(this).parent().parent().parent().find(".variable-website").find("input").val()
		$(".drag").css("top", e.clientY - 13)
		$(".drag").css("left", e.clientX + 20)
		$(".drag").css("display", "block")
		return false;
	})
	
	$(document).on("mouseup", "#sidebar-websites", function(e){
		if(Drag.sidebar.dragging){
	
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				websites = settings.sidebar_websites;
	
				moveWebsiteFromTo(websites.indexOf(websites.filter(website => website.name == Drag.sidebar.element)[0]), Drag.sidebar.newIndex, settings)
	
				Drag.sidebar.dragging = false;
				$(".drag").css("display", "none")
			})
		}
	})
	
	$(document).on("mousemove", "#sidebar-websites", function(e){
		if(Drag.sidebar.dragging){
	
			let to = {name: "", d: 1000, above: undefined};
			Drag.sidebar.centers.forEach(center => {
				if(to.d > Math.abs(center.mid - e.pageY)){
					to.name = center.name;
					to.d = Math.abs(center.mid-e.pageY);
					to.above = center.mid-e.pageY > 0;
				}
			});
	
			let index = Drag.sidebar.centers.indexOf(Drag.sidebar.centers.filter(center => center.name == to.name)[0]);
	
			Drag.sidebar.newIndex = to.above ? index : index + 1
	
			$(".drag").css("top", e.clientY - 13)
			$(".drag").css("left", e.clientX + 20)
		}
	})

	// engine move

	$(document).on("mousedown", "#search-engines .table-move img", function(e){
		Drag.engines.dragging = true;
		Drag.engines.element = $(this).parent().parent().parent().find(".variable-engine").find("input").val()
		$(".drag").css("top", e.clientY - 13)
		$(".drag").css("left", e.clientX + 20)
		$(".drag").css("display", "block")
		return false;
	})
	
	$(document).on("mouseup", "#search-engines", function(e){
		if(Drag.engines.dragging){
	
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				engines = settings.search_engines;
	
				moveEngineFromTo(engines.indexOf(engines.filter(engine => engine.name == Drag.engines.element)[0]), Drag.engines.newIndex, settings)
	
				Drag.engines.dragging = false;
				$(".drag").css("display", "none")
			})
		}
	})
	
	$(document).on("mousemove", "#search-engines", function(e){
		if(Drag.engines.dragging){
	
			let to = {name: "", d: 1000, above: undefined};
			Drag.engines.centers.forEach(center => {
				if(to.d > Math.abs(center.mid - e.pageY)){
					to.name = center.name;
					to.d = Math.abs(center.mid-e.pageY);
					to.above = center.mid-e.pageY > 0;
				}
			});
	
			let index = Drag.engines.centers.indexOf(Drag.engines.centers.filter(center => center.name == to.name)[0]);

			Drag.engines.newIndex = to.above ? index :  index + 1
	
			$(".drag").css("top", e.clientY - 13)
			$(".drag").css("left", e.clientX + 20)
		}
	})

	// context move

	$(document).on("mousedown", "#context-menu .table-move img", function(e){
		Drag.context.dragging = true;
		Drag.context.element = $(this).parent().parent().parent().find(".variable-context").find("input").val()
		$(".drag").css("top", e.clientY - 13)
		$(".drag").css("left", e.clientX + 20)
		$(".drag").css("display", "block")
		return false;
	})
	
	$(document).on("mouseup", "#context-menu", function(e){
		if(Drag.context.dragging){
	
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				context_menu = settings.mains[mainIndex].context;
	
				moveContextFromTo(context_menu.indexOf(context_menu.filter(engine => engine.name == Drag.context.element)[0]), Drag.context.newIndex, settings)
	
				Drag.context.dragging = false;
				$(".drag").css("display", "none")
			})
		}
	})
	
	$(document).on("mousemove", "#context-menu", function(e){
		if(Drag.context.dragging){
	
			let to = {name: "", d: 1000, above: undefined};
			Drag.context.centers.forEach(center => {
				if(to.d > Math.abs(center.mid - e.pageY)){
					to.name = center.name;
					to.d = Math.abs(center.mid-e.pageY);
					to.above = center.mid-e.pageY > 0;
				}
			});
	
			let index = Drag.context.centers.indexOf(Drag.context.centers.filter(center => center.name == to.name)[0]);

			Drag.context.newIndex = to.above ? index :  index + 1

			console.log(Drag.context.newIndex)
	
			$(".drag").css("top", e.clientY - 13)
			$(".drag").css("left", e.clientX + 20)
		}
	})


	$(document).on("mouseup", function(e){
		if(Drag.sidebar.dragging){
			Drag.sidebar.dragging = false;
			$(".drag").css("display", "none")
		}

		if(Drag.engines.dragging){
			Drag.engines.dragging = false;
			$(".drag").css("display", "none")
		}

		if(Drag.context.dragging){
			Drag.context.dragging = false;
			$(".drag").css("display", "none")
		}
	})

	// context move



	// content

	for(let i = 0; i < 5; i++){
		$("#main-" + i).on("click", function(){
			loadMain(i);
		})
	}

	chrome.storage.local.get("startpage_settings", function(s){
		mains = s.startpage_settings.mains;
		for(let i = 0; i < 5; i++){
			$("#main-" + i).text(mains[i].name)
		}
	})

	$('.main .main-name').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].name = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);
		});
	});

	$('.main .main-cover').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].cover = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-outer').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].outer = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-inner').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].inner = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-fill').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].fill = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-bar').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].bar = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-img').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].img = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$('.main .main-url').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
	
			settings.mains[mainIndex].url = val;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);

			loadMainPreview(settings.mains[mainIndex])
		});
	});

	$(document).on("focusout", ".save-color", function(){
		let val = $(this).val();
		chrome.storage.local.get("startpage_saved_colors", function (s){
			let colors = s.startpage_saved_colors;
			if(colors.filter(color => color == val).length == 0){
				colors.splice(0, 0, val);
			}
			chrome.storage.local.set({startpage_saved_colors: colors})
		})
	})


	$(".main input").on("focusout", updateDisplay)

	$(".advanced").on("click", function(){
		chrome.storage.local.get("startpage_settings", function(s){
			let settings = s.startpage_settings;
			settings.mains[mainIndex].advanced = !settings.mains[mainIndex].advanced;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(true);

			checkAdvanced();
		})
	});

	// context

	$(document).on("focusin", "#context-menu .variable-context input", function(){
		var name = $(this).attr("name")
		Context.lastValidEntry = name
	});
	
	$(document).on("click", "#context-menu .action", function(){
		let name = $(this).parent().find(".variable-context").children(0).val()
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			let context_menu = settings.mains[mainIndex].context;
			context_menu.forEach(context => {
				if(context.name == name){
					context_menu.splice(context_menu.indexOf(context), 1)
				}
			});
	
			settings.mains[mainIndex].context = context_menu;
			chrome.storage.local.set({startpage_settings:settings});
			
			loadToProfile(false);
			loadMain(mainIndex);
		})
	})
	
	$(document).on("keypress", "#context-menu .variable-context input", function(e){
		if(e.which == 13){
			let lastValid = Context.lastValidEntry;
			let val = $(this).val()
			let name = $(this).attr("name")
			chrome.storage.local.get("startpage_settings", function(e){
				settings = e.startpage_settings;
				context_menu = settings.mains[mainIndex].context;
	
				if(val.replace(/\s/g, '') == "" || val != name){
					if(lastValid != undefined){
						context_menu.filter(context => context.name == name)[0].name = lastValid;
						$("#context-menu .variable-context input[name = '" + name + "']").val(lastValid)
						$("#context-menu .variable-context input[name = '" + name + "']").attr("name", lastValid)
						settings.mains[mainIndex].context = context_menu;
						chrome.storage.local.set({startpage_settings: settings});
					}
				}
	
				loadToProfile(false);
				loadMain(mainIndex);
			});	
		}
	})
	
	$(document).on("focusout", "#context-menu .variable-context input" , function(){
		let lastValid = Context.lastValidEntry;
		let val = $(this).val()
		let name = $(this).attr("name")
		chrome.storage.local.get("startpage_settings", function(e){
			settings = e.startpage_settings;
			context_menu = settings.mains[mainIndex].context;
	
			if(val.replace(/\s/g, '') == "" || val != name){
				if(lastValid != undefined){
					context_menu.filter(context => context.name == name)[0].name = lastValid;
					$("#context-menu .variable-context input[name = '" + name + "']").val(lastValid)
					$("#context-menu .variable-context input[name = '" + name + "']").attr("name", lastValid)
					settings.mains[mainIndex].context = context_menu;
					chrome.storage.local.set({startpage_settings: settings});
				}
			}
			
			loadToProfile(false);
			loadMain(mainIndex);
		});				
	});

	$(document).on("focusout", "#context-menu .variable-context-url input" ,function(){
		loadToProfile(false);
		loadMain(mainIndex);
	});

	// weather
	
	$('.weather .location .lat input').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			let location = settings.darksky_loc;
	
			if(val.split(".").length < 3){
				if(val.indexOf(".") == 0) {
					location.lat = Number.parseFloat("0" + val)
				} else if (val.indexOf(".") == val.length - 1) {
					location.lat = Number.parseFloat(val + "0")
				} else {
					location.lat = Number.parseFloat(val)
				}
			}
			settings.darksky_loc = location;
			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false)
		});
	});
	
	$('.weather .location .lon input').bind('input propertychange', function() {
		let val = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			let location = settings.darksky_loc;
	
			if(val.split(".").length < 3){
				if(val.indexOf(".") == 0) {
					location.lon = Number.parseFloat("0" + val)
				} else if (val.indexOf(".") == val.length - 1) {
					location.lon = Number.parseFloat(val + "0")
				} else {
					location.lon = Number.parseFloat(val)
				}
			}
			settings.darksky_loc = location;
			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);
		});
	});

	$('.weather .location input').on("focusout", updateDisplay);

	$("#darksky").bind('input propertychange', function() {
		newKey = $(this).val();
		chrome.storage.local.get("startpage_settings", function(e){
			let settings = e.startpage_settings;
			
			settings.darksky_key = newKey;

			chrome.storage.local.set({startpage_settings: settings})

			loadToProfile(false);
		});
	});
	
	$('#darksksy').on("focusout", updateDisplay);
	
	// side
	
	$.each($(".side-content h4"), function(i){
		$(this).on("click", function(ev){
			$([document.documentElement, document.body]).animate({
				scrollTop: anchor[i] + 185
			}, 500);
		})
	})

	// popup

	$(".popup-buttons > .confirm").click(function(e){
		Popup.confirm();
	});

	$(".popup-buttons > .cancel").click(function(e){
		Popup.close();
	});

	$(".check span").on("click", function () {
		$(this).siblings().eq(0).prop("checked", !$(this).siblings().eq(0).prop("checked"));
	});

	$("#popup-input").keydown(function(ev){
		$(this).removeClass("input-error")
		switch(ev.keyCode){
			case 13:
				Popup.confirm();
			break;
		}
	});

	$(document).keydown(function(ev){
		if($("#popup").css("display") != "none"){
			switch(ev.keyCode){
				case 27:
					Popup.close();
				break;
				default:
					$("#popup-input").focus();
				break;
			}
		}

		if(document.getElementById("edit") != null){
			switch(ev.keyCode){
				case 27:
					removeElement("edit")
				break;
				default:
					$("#edit").focus();
				break;
			}
		}
	});

	// CHECKBOXES

	checkboxes.forEach(checkbox => {
		if(checkbox != "darkmode_auto"){
			$("#" + checkbox + " input").on("change", function(){
	
				chrome.storage.local.get("startpage_settings", function(s){
					let settings = s.startpage_settings;
					settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
					chrome.storage.local.set({startpage_settings:settings})

					loadToProfile(true);
					loadMain(mainIndex);
				});
			})
		
			$("#" + checkbox + " span").on("click", function(){
				chrome.storage.local.get("startpage_settings", function(s){
					let settings = s.startpage_settings;
					settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
					chrome.storage.local.set({startpage_settings:settings})

					loadToProfile(true);
					loadMain(mainIndex);
				});
			})
		} else {
			$("#" + checkbox + " input").on("change", function(){

				chrome.storage.local.get("startpage_settings", function(s){
					let settings = s.startpage_settings;
					settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
					chrome.storage.local.set({startpage_settings:settings})

					loadToProfile(false)
					chrome.runtime.sendMessage({action: "update_dark"}, function(response) {
						updateDisplay();
						loadMain(mainIndex);
					});
				});
			})
		
			$("#" + checkbox + " span").on("click", function(){
				chrome.storage.local.get("startpage_settings", function(s){
					let settings = s.startpage_settings;
					settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
					chrome.storage.local.set({startpage_settings:settings})

					

					loadToProfile(false);
					chrome.runtime.sendMessage({action: "update_dark"}, function(response) {
						updateDisplay();
						loadMain(mainIndex);
					});
				});
			})
		}
	});

	// Autocomplete checkbox

	$("#autocomplete input").on("change", function(){

		chrome.storage.local.get("startpage_autocomplete", function(e){
			let startpage_autocomplete = e.startpage_autocomplete;
			chrome.storage.local.set({startpage_autocomplete:{
				enabled: $("#autocomplete input").prop("checked"),
				suggestions: startpage_autocomplete.suggestions,
				last: startpage_autocomplete.last
			}});
			updateDisplay();
		});
	});

	$("#autocomplete span").on("click", function(){

		chrome.storage.local.get("startpage_autocomplete", function(e){
			let startpage_autocomplete = e.startpage_autocomplete;
			chrome.storage.local.set({startpage_autocomplete:{
				enabled: $("#autocomplete input").prop("checked"),
				suggestions: startpage_autocomplete.suggestions,
				last: startpage_autocomplete.last
			}})
			updateDisplay();
		})

	});
});