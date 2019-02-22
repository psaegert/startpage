chrome.storage.local.get('startpage_settings', function(e){
	if(e.startpage_settings == undefined){
		chrome.storage.local.set({startpage_settings:{
			darkmode: false,
			darkmode_auto: false,
			blob: true,
			sidebar: true,
			sidebar_websites:[],
			weather: true,
		}});
	}

	chrome.storage.local.get('startpage_profiles', function(a){
		chrome.storage.local.get('startpage_settings', function(s){
			if(a.startpage_profiles == undefined){
				chrome.storage.local.set({startpage_profiles:[{name: "Default", settings:s.startpage_settings}]});
			}

			chrome.storage.local.get('startpage_selected_profile', function(sp){
				if(sp.startpage_selected_profile == undefined){
					chrome.storage.local.get('startpage_profiles', function(pr){
						if(pr.startpage_profiles.filter(profile => profile.name == "Default").length != 0){
							chrome.storage.local.set({startpage_selected_profile:"Default"});
						} else {
							chrome.storage.local.set({startpage_selected_profile:""});
						}
					});
				}
			});
		});
	});
});

chrome.storage.local.get('startpage_autocomplete', function(e){
	let startpage_autocomplete = e.startpage_autocomplete;
	if(startpage_autocomplete == undefined){
		chrome.storage.local.set({startpage_autocomplete:{
			enabled: true,
			suggestions: [],
			last: ""
		}});
	}
});

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
								i.src = e.startpage_settings.darkmode ? "bin_dark.jpg" : "bin.jpg";
							});
							i.className = "bin";

							d.appendChild(i)

						a.appendChild(d);

					tr.appendChild(a);

				
				$("#autocomplete-suggestions  tbody").append(tr)

			});

			$(document).on("focusin","#autocomplete-suggestions .variable-item input", function(){
				var name = $(this).attr("name")
				autocompleteLastValidEntry = name
			});

			$("#autocomplete-suggestions .variable-item input").bind('input propertychange', function() {
				let val = $(this).val()
				let name = $(this).attr("name")
				let engine = $(this).parent().siblings().eq(0).text()
				chrome.storage.local.get("startpage_autocomplete", function(e){
					startpage_autocomplete = e.startpage_autocomplete;
					suggestions = startpage_autocomplete.suggestions;
					console.log(suggestions.filter(sug => sug.query.toUpperCase() == val.toUpperCase() && sug.engine == engine))
					if(val.replace(/\s/g, '') != "" && suggestions.filter(sug => sug.query.toUpperCase() == val.toUpperCase() && sug.engine == engine).length == 0){
						suggestions.filter(sug => sug.query == name)[0].query = val;
						$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", val);
						startpage_autocomplete.suggestions = suggestions;
						chrome.storage.local.set({startpage_autocomplete: {
							enabled: startpage_autocomplete.enabled,
							suggestions: suggestions,
							last: startpage_autocomplete.last
						}})
					}
				});
			});

			$(document).on("keypress", "#autocomplete-suggestions .variable-item input", function(e){
				if(e.which == 13){
					console.log("subnit")
					let val = $(this).val()
					let name = $(this).attr("name")
					let engine = $(this).parent().siblings().eq(0).text()
					
					chrome.storage.local.get("startpage_autocomplete", function(e){
						startpage_autocomplete = e.startpage_autocomplete;
						suggestions = startpage_autocomplete.suggestions;
	
						if(val.replace(/\s/g, '') == "" || val != name){
							if(autocompleteLastValidEntry != undefined){
								suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine)[0].query = autocompleteLastValidEntry;
								$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").val(autocompleteLastValidEntry)
								$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", autocompleteLastValidEntry)
								startpage_autocomplete.suggestions = suggestions;
								chrome.storage.local.set({startpage_autocomplete: {
									enabled: startpage_autocomplete.enabled,
									suggestions: suggestions,
									last: startpage_autocomplete.last
								}})
							}
						}
					});	
	
					$(this).blur();
				}
			})

			$(document).on("focusout", "#autocomplete-suggestions .variable-item input" ,function(){

				let val = $(this).val()
				let name = $(this).attr("name")
				let engine = $(this).parent().siblings().eq(0).text()
				
				chrome.storage.local.get("startpage_autocomplete", function(e){
					startpage_autocomplete = e.startpage_autocomplete;
					suggestions = startpage_autocomplete.suggestions;

					if(val.replace(/\s/g, '') == "" || val != name){
						if(autocompleteLastValidEntry != undefined){
							console.log(suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine))
							suggestions.filter(sug => sug.query.toUpperCase() == name.toUpperCase() && sug.engine == engine)[0].query = autocompleteLastValidEntry;
							$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").val(autocompleteLastValidEntry)
							$("#autocomplete-suggestions .variable-item input[name = '" + name + "'][alt ='" + engine + "']").attr("name", autocompleteLastValidEntry)
							startpage_autocomplete.suggestions = suggestions;
							chrome.storage.local.set({startpage_autocomplete: {
								enabled: startpage_autocomplete.enabled,
								suggestions: suggestions,
								last: startpage_autocomplete.last
							}})
						}
					}
				});				
			});

			$("#autocomplete-suggestions .action").click(function(){
				let qname = $(this).siblings().eq(0).eq(0).children().eq(0).attr("name")
				let qengine = $(this).siblings().eq(1).text()
				chrome.storage.local.get("startpage_autocomplete", function(e){
					let queries = e.startpage_autocomplete.suggestions;
					queries.forEach(query => {
						console.log(query, name)
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
									ni.src = e.startpage_settings.darkmode ? "edit.png" : "edit_dark.png";
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
								i.src = e.startpage_settings.darkmode ? "bin_dark.jpg" : "bin.jpg";
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

			$("#profile-list .edit").on("click", function(){
				removeElement("edit");
				let input = document.createElement("input");
				input.id = "edit";
				input.spellcheck = false;
				$(this).parent().siblings().eq(0).append(input);
				let name = $(this).parent().siblings().eq(0).text()
				$("#edit").val(name)
				$("#edit").focus();

				$(document).on("focusout","#edit",function(){
					removeElement("edit")
				});

				$("#edit").keydown(function(ev){
					switch(ev.keyCode){
						case 13:
							alreadyExists = false;
							chrome.storage.local.get("startpage_profiles", function(e){
								
								let startpage_profiles = e.startpage_profiles;
								startpage_profiles.forEach(profile => {
									if(profile.name == $("#edit").val() && profile.name != name){
										alreadyExists = true;
									}
								});
		
								if(!alreadyExists && $("#edit").val() != ""){
									newName = $("#edit").val()
									
									chrome.storage.local.get("startpage_selected_profile", function(a){
										let selected = a.startpage_selected_profile
										
										if(selected == name){
											chrome.storage.local.set({
												startpage_selected_profile: newName
											});
										}

										startpage_profiles.filter(profile => profile.name == name)[0].name = newName;
										
										chrome.storage.local.set({startpage_profiles: startpage_profiles})
			
										updateDisplay();

									});
								} else {
									// console.log("nope")
									$("#edit").addClass("popup-input-error");
								}
							});
						break;
					}
				})
			});


			$("#profile-list .action").click(function(){

				var name = $(this).siblings().eq(0).eq(0).text();

				chrome.storage.local.get("startpage_profiles", function(e){
					let startpage_profiles = e.startpage_profiles;
					startpage_profiles.forEach(profile => {
						if(profile.name == name){
							startpage_profiles.splice(startpage_profiles.indexOf(profile), 1)
						}
					});
					chrome.storage.local.set({startpage_profiles:startpage_profiles})
					updateDisplay();
				})
			})

			$("#profile-list .item-text").click(function(){
				if($(this).find("#edit").length == 0){
					let name = this.innerText;
					loadFromProfile(name, false)
				}
			})

			$("#profile-list .property").click(function(ev){
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
		}	

		$("#profile-text-export").text(JSON.stringify(e.startpage_profiles, null, 6));
	})
	
	chrome.storage.local.get("startpage_settings", function(e){

		$('#darkmode input').prop("checked", e.startpage_settings.darkmode);

		$('#sidebar input').prop("checked", e.startpage_settings.sidebar);

		let websites = e.startpage_settings.sidebar_websites;
			$("#sidebar-websites tbody").html("<tr><th>Name</th><th>URL</th><th>Icon</th></tr>")
			websites.forEach(website => {
				let tr = document.createElement("tr");

					let n = document.createElement("td");
					n.className = "variable-website";

						let ninp = document.createElement("input");
						ninp.value = website.name;
						ninp.name = website.name;
						ninp.spellcheck = false;

						n.appendChild(ninp);

					tr.appendChild(n);

					let url = document.createElement("td");
					url.className = "variable-url";

						let urlinp = document.createElement("input");
						urlinp.value = website.url;
						urlinp.spellcheck = false;

						url.appendChild(urlinp);

					tr.appendChild(url);

					let img = document.createElement("td");
					img.className = "variable-img";

						let imginp = document.createElement("input");
						imginp.value = website.img;
						imginp.spellcheck = false;

						img.appendChild(imginp);

					tr.appendChild(img);


					let a = document.createElement("td");
					a.className = "action";

						let d = document.createElement("div");
						d.className = "table-icon";

							let i = document.createElement("img");
							chrome.storage.local.get('startpage_settings', function(e){
								i.src = e.startpage_settings.darkmode ? "bin_dark.jpg" : "bin.jpg";
							});
							i.className = "bin";

							d.appendChild(i)

						a.appendChild(d);

					tr.appendChild(a);

				
				$("#sidebar-websites tbody").append(tr)

			});

			$(document).on("keypress", "#sidebar-websites .variable-website input", function(e){
				if(e.which == 13){
					let val = $(this).val()
					let name = $(this).attr("name")
					chrome.storage.local.get("startpage_settings", function(e){
						settings = e.startpage_settings;
						websites = settings.sidebar_websites;

						if(val.replace(/\s/g, '') == "" || val != name){
							if(Sidebar.lastValidEntry != undefined){
								websites.filter(website => website.name == name)[0].name = Sidebar.lastValidEntry;
								$("#sidebar-websites .variable-website input[name = '" + name + "']").val(Sidebar.lastValidEntry)
								$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", Sidebar.lastValidEntry)
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings});
							}
						}
					});	
	
					$(this).blur();
				}
			})

			$(document).on("focusout", "#sidebar-websites .variable-website input" , function(){

				let val = $(this).val()
				let name = $(this).attr("name")
				chrome.storage.local.get("startpage_settings", function(e){
					settings = e.startpage_settings;
					websites = settings.sidebar_websites;

					if(val.replace(/\s/g, '') == "" || val != name){
						if(Sidebar.lastValidEntry != undefined){
							websites.filter(website => website.name == name)[0].name = Sidebar.lastValidEntry;
							$("#sidebar-websites .variable-website input[name = '" + name + "']").val(Sidebar.lastValidEntry)
							$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", Sidebar.lastValidEntry)
							settings.sidebar_websites = websites;
							chrome.storage.local.set({startpage_settings: settings});
						}
					}
				});				
			});


			$("#sidebar-websites .action").click(function(){
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
					updateDisplay();
				})
			})

		let tr = document.createElement("tr");

		let n = document.createElement("td");
		n.className = "add-website";

			let ninp = document.createElement("input");
			ninp.spellcheck = false;
			ninp.placeholder = "Name"

			n.appendChild(ninp);

		tr.appendChild(n);


		let u = document.createElement("td");
		u.className = "add-url";

			let uinp = document.createElement("input");
			uinp.spellcheck = false;
			uinp.placeholder = "http(s)://www.example.com"

			u.appendChild(uinp);

		tr.appendChild(u);


		let im = document.createElement("td");
		im.className = "add-img";

			let iminp = document.createElement("input");
			iminp.spellcheck = false;
			iminp.placeholder = "example.png"

			im.appendChild(iminp);

		tr.appendChild(im);

		$("#sidebar-websites tbody").append(tr)


		$(document).on("focusin","#sidebar-websites .variable-website input", function(){
			var name = $(this).attr("name")
			Sidebar.lastValidEntry = name
		});
		
		$("#sidebar-websites input").bind('input propertychange', function() {
			Sidebar.focusedInput = {name: $(this).parent().prop("class") == "add-website" ? $(this).val() : $(this).parent().siblings().eq(0).children().eq(0).val(), input:$(this).parent().prop("class").slice().slice(3, 100)}
			if($(this).parent().prop("class").includes("add")){
				if(!Sidebar.checkEmpty()){
					chrome.storage.local.get("startpage_settings" , function(e){
						chrome.storage.local.get("startpage_selected_profile", function(sp){
							chrome.storage.local.get("startpage_profiles", function(p){
								let selected = sp.startpage_selected_profile
								let startpage_profiles = p.startpage_profiles
								let settings = e.startpage_settings
								let websites = settings.sidebar_websites
								if(!Sidebar.exists(websites)){
									websites.push({
										name: $(".add-website input").val(),
										url: $(".add-url input").val(),
										img: $(".add-img input").val()
									})
									settings.sidebar_websites = websites;
									chrome.storage.local.set({startpage_settings: settings})

									if(selected != ""){
										startpage_profiles.filter(profile => profile.name == selected)[0].settings.sidebar_websites = websites
										chrome.storage.local.set({startpage_profiles: startpage_profiles})
									}

									updateDisplay();

								}
							});
						});

					})
				}
			} else {
				let val = $(this).val()
				switch($(this).parent().prop("class")){
					case "variable-website":
						let name = $(this).attr("name")
						chrome.storage.local.get("startpage_settings", function(e){
							let settings = e.startpage_settings;
							let websites = settings.sidebar_websites;
							if(val.replace(/\s/g, '') != "" && websites.filter(website => website.name == val).length == 0){
								websites.filter(website => website.name == name)[0].name = val;
								$("#sidebar-websites .variable-website input[name = '" + name + "']").attr("name", val);
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})
							}
						});
					break;
					case "variable-url":
						var editName = $(this).parent().parent().find(".variable-website").find("input").attr("name");
						chrome.storage.local.get("startpage_settings", function(e){
							let settings = e.startpage_settings;
							let websites = settings.sidebar_websites;
							if(val.replace(/\s/g, '') != "" && websites.filter(website => website.name == editName).length == 1){
								websites.filter(website => website.name == editName)[0].url = val;
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})
							}
						});
					break;
					case "variable-img":
						var editName = $(this).parent().parent().find(".variable-website").find("input").attr("name");
						chrome.storage.local.get("startpage_settings", function(e){
							let settings = e.startpage_settings;
							let websites = settings.sidebar_websites;
							if(websites.filter(website => website.name == editName).length == 1){
								websites.filter(website => website.name == editName)[0].img = val;
								settings.sidebar_websites = websites;
								chrome.storage.local.set({startpage_settings: settings})
							}
						});
					break;
				}
			}
		});


		$('#blob input').prop("checked", e.startpage_settings.blob);
		

		$('#weather input').prop("checked", e.startpage_settings.weather);

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
		}

		$("#sidebar-websites tr").eq($("#sidebar-websites tr").length - 2).find(".variable" + Sidebar.focusedInput.input + " input").focus();

		Sidebar.focusedInput = {input: undefined, name: undefined};

	})

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

function removeElement(elementId) {
	var element = document.getElementById(elementId);
	if(element != null){
		element.parentNode.removeChild(element);
	}
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
						$("#profile-import-confirm").removeClass("profile-import-confirm-ready");
						$("#profile-export").addClass("button-action-active")
						$("#profile-import").removeClass("button-action-active")
					})
				break;
				case "import":
					$("#profile-text-export").hide();
					$("#profile-text-import").show();
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
					updateDisplay();
				});
			});
		},
		valid: function(profiles){
			let valid = true;
			profiles.forEach(profile => {
				if(typeof(profile.name) !== "string" || profile.name == "") valid = false;
				if(typeof(profile.settings) !== "object") valid = false;
				if(typeof(profile.settings.blob) !== "boolean") valid = false;
				if(typeof(profile.settings.darkmode) !== "boolean") valid = false;
				if(typeof(profile.settings.darkmode_auto) !== "boolean") valid = false;
				if(typeof(profile.settings.sidebar) !== "boolean") valid = false;
				if(!Array.isArray(profile.settings.sidebar_websites)) valid = false;
				if(typeof(profile.settings.weather) !== "boolean") valid = false;
			});

			return valid;
		},
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
			$("#popup-input").removeClass("popup-input-error")
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
							$("#popup-input").addClass("popup-input-error");
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
				if($(":focus").parent().siblings().children().eq(0).val().replace(/\s/g, '') == "") return true;
				// if($(":focus").parent().siblings().children().eq(1).val().replace(/\s/g, '') == "") return true;
			}
			return false;
		},
		exists:function(websites){
			return websites.filter(website => {
				return website.name == $(".add-website input").val()
			}).length != 0;
		},
		focusedInput: {name: undefined, input:undefined},
		lastValidEntry: undefined
	},
	checkboxes = [
		"darkmode",
		"darkmode_auto",
		"sidebar",
		"blob",
		"weather"
	],
	autocompleteLastValidEntry;

$(function(){

	updateDisplay();

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
		$(this).removeClass("popup-input-error")
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
		$("#" + checkbox + " input").on("change", function(){

			chrome.storage.local.get("startpage_settings", function(s){
				let settings = s.startpage_settings;
				settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
				chrome.storage.local.set({startpage_settings:settings})

				chrome.storage.local.get("startpage_profiles", function(e){
					chrome.storage.local.get("startpage_selected_profile", function(a){
						let startpage_profiles = e.startpage_profiles;
						startpage_profiles.filter(profile => profile.name == a.startpage_selected_profile)[0].settings[checkbox] = $("#" + checkbox + " input").prop("checked");
						chrome.storage.local.set({startpage_profiles:startpage_profiles})
						updateDisplay();
					});
				})
			})

		})
	
		$("#" + checkbox + " span").on("click", function(){

			chrome.storage.local.get("startpage_settings", function(s){
				let settings = s.startpage_settings;
				settings[checkbox] =  $("#" + checkbox + " input").prop("checked");
				chrome.storage.local.set({startpage_settings:settings})

				chrome.storage.local.get("startpage_profiles", function(e){
					chrome.storage.local.get("startpage_selected_profile", function(a){
						let startpage_profiles = e.startpage_profiles;
						startpage_profiles.filter(profile => profile.name == a.startpage_selected_profile)[0].settings[checkbox] = $("#" + checkbox + " input").prop("checked");
						chrome.storage.local.set({startpage_profiles:startpage_profiles})
						updateDisplay();
					});
				})
			})

		})
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


	// PATH

	document.getElementById("path").innerText = chrome.extension.getURL("/startpage/startpage.html")

	// PROFILES

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

	// BASIC

	// Autocomplete

	$("#clearalldata").on("click", function(){
		Popup.open("clearalldata");
	});

})

