$(function(){
	//global variables
	saved=0;
	customer_id=0;
	action="";
	item_id="";
	var expanded = false;
	getMatchingAnalizes=setTimeout(function(){},0);
	getMatchingCustomerNames=setTimeout(function(){},0);

	//$('div.content-for-print').hide();

	$('#organization').one('click',function(){
		var data={
			getOrganizationNames:1
		}
		$.ajax({
			type:"GET",
			url:'../common/get.php',
			data:data,
			success:function(data){
				var n=JSON.parse(data);
				var org_names=n.map((org,i)=>{
					return org.name;
				});
				$( "#organization" ).autocomplete({
					source: org_names,
					delay:1000,
					minLength:3
				});
			}
		});
	});

	$('#customer_name').on('input',function(){
		var th=$(this);
		customer_id=0;

		new Promise((resolve,reject)=>{
			autocompleteCustomer(th, resolve);
		}).then(()=>{
			setTimeout(function(){
				if($('ul.ui-autocomplete li').length>0){
					//alert($('ul.ui-autocomplete li').length+'matches');
					$('ul.ui-autocomplete li').on('click',function(){  // one existing customer is selected
						//alert('customer selected');
						if(!customer_id){
							var name=$(this).text();
							if(name.indexOf('(')>0 && name.charAt(name.length-1)==')'){
								var cus_id=name.substring(name.indexOf('(')+5,name.length-1);
								if(cus_id/1>0){
									var data={
										search_key:name,
										item:'customer'
									}
									$.ajax({
										type:"GET",
										url:'../common/get.php',
										data:data,
										success:function(data){
											$('#search_customer_dialog ol.customer_details').html(data);
											$('#customer_name').val($('.customer_details li[data_name="name"]').text());
											$('#datepicker').val($('.customer_details li[data_name="d_o_b"]').text());
											var region_id=$('.customer_details li[data_name="region_id"]').text();
											var district_id=$('.customer_details li[data_name="district_id"]').text();
											var org_name=$('.customer_details li[data_name="org_name"]').text();
											var phone=$('.customer_details li[data_name="phone"]').text();
											$('#customer_phone').val(phone);
											$('#organization').val(org_name);
											if(region_id){
												$('#regions').selectmenu('destroy');
												$('#regions option[region_id='+region_id+']').attr('selected','selected');
												$('#regions').selectmenu();
												district();
												if(district_id){
													$('#districts').selectmenu('destroy');
													$('#districts option[district_id='+district_id+']').attr('selected','selected');
													$('#districts').selectmenu();
												}
												$('#regions-menu').on('click',function(){
													district();
												});
											}
											$('#search_customer_dialog ol.customer_details').html('');
										}
									});
									customer_id=cus_id;
								}
							}else{
								customer_id=0;
							}
						}
					});
				};
			},1000);
		});
	});

	$('input[name="d_o_b"]').on('input change', function(e){
		//console.log('changed', $(this).val());
		let parts = $(this).val().split('-');
		for(let i=0; i< parts.length; i++){
			if((i==0 || i==1) && parts[i].length > 2){
				parts[i+1] = parts[i].substring(2, parts[i].length) + (parts[i+1] || '');
				parts[i] = parts[i][0] + parts[i][1];
			}

			if(i==2 && parts[i].length > 4){
				parts[i] = parts[i].substring(0, 4);
			}
		}
		$(this).val(parts.join('-'));
	});

	$('.registrator_bottom .save_button').on('click',function(){
		var user_id = $('input[name="user_id"]').val();
		var customer_name=$('.name_and_dob #customer_name').val();
		var customer_dob=$('.name_and_dob label[for="d_o_b"] input').val();
		var customer_region=$('.address_form select[name="region"] option:selected').attr('region_id');
		var customer_district=$('#districts option:selected').attr('district_id');
		var customer_org=$('.address_form #organization').val();
		var customer_phone=$('.name_and_dob #customer_phone').val();
		var time=$('.current_date').val();
		var analizes=$('div.chosen_analize');
		var getResultMethod=$('input[name="get-result-method"]:checked').val();
		var orders=[];
		for(var i=0;i<analizes.length;i++){
			var analize_id=analizes.eq(i).attr('analize_id');
			var analize_price=analizes.eq(i).find('.analize_price').text();
			var order=[analize_id,analize_price];
			orders[i]=order;
		}
	    var data={
	    	item:'customer',
			id:customer_id,
			user_id,
	    	name:customer_name,
	    	dob:customer_dob,
	    	region:customer_region,
	    	district:customer_district,
	    	org:customer_org,
	    	time:time,
	    	phone:customer_phone,
	    	orders:orders,
	    	getResultMethod
	    }
		if(customer_name && customer_dob && customer_org && orders.length>0){
		    $.ajax({
		    	type:"POST",
		    	url:"../models/add_item.php",
		    	data:data,
		    	success:function(data){
		    	    data=data.trim();
		    		if(data=='saved'){
		    			saved=1;
		    			alert('Saqlandi');
		    			location.reload();
		    		}else{
		    			if(data=='org_error'){
		    				alert('Tashkilot nomi noto\'g\'ri kiritilgan!');
		    			}
		    		}
		    	},
		    	error:function(xhr){
					alert(xhr.status+" error "+xhr.statusText);
				}
		    });
		}else{
			alert('Ma\'lumotlar yetarli emas');
		}
	});

	$('.registrator2_bottom .save_button').on('click',function(){
		var customer_name=$('.name_and_dob #customer_name').val();
		var customer_dob=$('.name_and_dob label[for="d_o_b"] input').val();
		var customer_region=$('.address_form select[name="region"] option:selected').attr('region_id');
		var customer_district=$('#districts option:selected').attr('district_id');
		var customer_org=$('.address_form #organization').val();
		var customer_phone=$('.name_and_dob #customer_phone').val();
		var time=$('.current_date').val();
		var serviceType = $('select#serviceTypes').val();
		var service = $('select#services').val();
		var doctor = $('select#doctors').val();

	    var data={
	    	item:'customer',
	    	id:customer_id,
	    	name:customer_name,
	    	dob:customer_dob,
	    	region:customer_region,
	    	district:customer_district,
	    	org:customer_org,
	    	time:time,
	    	phone:customer_phone,
	    	serviceType,
	    	service,
	    	price: $('select#services option:selected').attr('price'),
	    	doctor
	    }
	    console.log(data);
		if(customer_name && customer_dob && customer_org && service && doctor){
		    $.ajax({
		    	type:"POST",
		    	url:"../models/add_item.php",
		    	data:data,
		    	success:function(data){
		    	    data=data.trim();
		    		if(data=='saved'){
		    			saved=1;
		    			alert('Saqlandi');
		    			location.reload();
		    		}else{
		    			if(data=='org_error'){
		    				alert('Tashkilot nomi noto\'g\'ri kiritilgan!');
		    			}
		    		}
		    	},
		    	error:function(xhr){
					alert(xhr.status+" error "+xhr.statusText);
				}
		    });
		}else{
			alert('Ma\'lumotlar yetarli emas');
		}
	});

	$('.registrator_bottom .print_button').on('click',function(){
		// getting name
		var names=$('#customer_name').val().split(' ');
		if(names.length==1){
			var name=names[0];
		}else if(names.length==2 && names[1]!=''){
			var name1=names[0];
			var name2=names[1];
		}else{
			if(names[0]!=''){
				name1=names[0];
			}
			var name2='';
			for(var i=1;i<names.length;i++){
				name2+=' '+names[i];
			};
		}

		if(name){
			$('div.top .surname,div.bottom .sub_surname').text(name);
		}else if(name1 && name2){
			$('div.top .surname,div.bottom .sub_surname').text(name1);
			$('div.top .name,div.bottom .sub_name').text(name2);
		}
		$('div.top .d-o-b').text($('#datepicker').val());

		var chosenAnalizes=$('div.chosen_analizes div');

		// separating analyzes by room,  we create an array of objects
		var analizesByRoom=[];
		for(let i=0; i<chosenAnalizes.length; i++){
			var match=false;
			var an=chosenAnalizes.eq(i);
			var room_id=parseInt(an.attr('room_id'));
			an={
				price:an.find('span.analize_price').text(),
				name:an.contents().first().text()
			}
			for(let j=0; j<analizesByRoom.length; j++){
				if(analizesByRoom[j] && analizesByRoom[j].room_id==room_id){
					match=true;
					analizesByRoom[j].analizes.push(an);
				}
			}
			if(!match){
				analizesByRoom.push({
					room_id,
					analizes:[an]
				});
			}
		}

		var oneRoomHeader=$('div.top').html();
		$('div.top').remove();

		for(let i=0; i<analizesByRoom.length; i++){
			var anByRoom=analizesByRoom[i];
			var analizeRows='';
			var totalPrice=0;
			anByRoom.analizes.map((analize,index)=>{
				analizeRows+='<tr><td>'+analize.name+'</td><td>'+analize.price+'</td><td class="field"></td></tr>';
				totalPrice+=analize.price/1;
				return;
			});
			analizeRows+='<tr><td class="total" colspan=3> Umumiy narx : '+totalPrice+'</td></tr>';
			$('.content-for-print').html('<div class="top">'+oneRoomHeader+'<table class="analizes"></table></div>' + $('.content-for-print').html());
			$('.content-for-print .top').eq(0).find('table.analizes').html(analizeRows);
		}

		$('div.chosen_analizes div').each(function(){
			var $this=$(this);
			var analize_name=$this.contents().first().text();
			$('div.bottom p.sub_analizes').text($('div.bottom p.sub_analizes').text()+'| |'+analize_name);
		});

		if(saved){
			window.print();
		}else{
			if(confirm('Ma\'lumotlar saqlanmagan, saqlaysizmi?')){
				$('.registrator_bottom .save_button').click();
				window.print();
			}
		}
	});

	$('.selectBox').on('input',function() {
		var th=$(this);
		clearTimeout(getMatchingAnalizes);
		getMatchingAnalizes=setTimeout(function(){
			//alert('getting');
			var data={
				item:'analize',
				search_key:th.val()
			}
			$.ajax({
				type:"GET",
				data:data,
				url:'../common/get.php',
				success:function(data){
					$("#checkboxes").remove();
					$('.selectBox').after('<div id="checkboxes">'+data+'</div>');
					var checkboxes = $("#checkboxes");
					if($('.chosen_analizes div').length){
						var l=$('.chosen_analizes div').length;
						for(var i=0; i<l; i++){
							var analize_id=$('.chosen_analizes div').eq(i).attr('analize_id');
							$('#checkboxes input[id='+analize_id+']').attr('checked','checked');
						}
					}
					checkboxes.buttonset();
					$('#checkboxes label input').on('change',function(){
						var th=$(this);
						var chosen_analizes=$('.chosen_analizes div');
						if(th.is(':checked')){
							//alert('checked');
							var name=th.next().text();
							var old_p=th.next().next().text();
							var id=th.attr('id');
							var discount=th.attr('discount');
							var room_id=th.attr('room_id');
							p=Math.floor(discount*old_p/100+old_p/1);

							if(chosen_analizes.length){
								var last_chosen_analize=chosen_analizes.eq(chosen_analizes.length-1);
								last_chosen_analize.after("<div analize_id="+id+" room_id="+room_id+" old_price="+old_p+" class='chosen_analize'>"+name+"<span class='analize_price'>"+p+"</span><input class='discount_spinner' value="+discount+"></div>");
							}else{
								$('.chosen_analizes').html("<div analize_id="+id+" room_id="+room_id+" old_price="+old_p+" class='chosen_analize'>"+name+"<span class='analize_price'>"+p+"</span><input class='discount_spinner' value="+discount+"></div>");
							}
						}else{
							var id=th.attr('id');
							$('.chosen_analizes div[analize_id='+id+']').remove();
						}

						$('.discount_spinner').spinner();
						//alert('changed');

						$('#analizes_list .chosen_analize span.ui-spinner').on('input click',function(e){
							e.preventDefault();
							
							var chosenAnalize=$(this).closest('.chosen_analize');
							var disc=parseInt($(this).find('input').val()) || 0;
							var id=chosenAnalize.attr('analize_id');
							$('#checkboxes input[id='+id+']').attr('discount',disc);
							var old_price=chosenAnalize.attr('old_price');
							p=Math.floor(old_price/1 - disc*old_price/100);
							chosenAnalize.find('.analize_price').text(p);
							totalPrice();
						});
						totalPrice();
					});
				    checkboxes.show();
				    expanded = true;
				}
			});
		},800);
	});

	$('#tabs').tabs({active:false});
	$('#tabs .administrator_tab_item').on('click',function(){
		window.localStorage.setItem('administrator_tab_item',$(this).attr('tab_item'));
		getTabItem($(this).attr('tab_item'));
	});
	const activeTab=localStorage.getItem('administrator_tab_item');
	if(activeTab){
		console.log('activeTab',activeTab);
		if($('#tabs .administrator_tab_item[tab_item="'+activeTab+'"] a').length){
			setTimeout(()=>{
				$('#tabs .administrator_tab_item[tab_item="'+activeTab+'"] a').click();
			},0);
		}else{
			makeReady();
		}
	}else{
		getTabItem('products');
	}
	

//JQUERY_UI
	//$('#controlgroup').controlgroup();
	$( "#datepicker" ).datepicker({
		inline: true,
		dateFormat:'dd-mm-yy',
		changeYear:true,
		yearRange:'1930:2018'
	});

	$('.current_date').datepicker({
		dateFormat:'dd-mm-yy',
		inline: true
	});

	

	//toolbar buttons and corresponding dialogs

	$(".search_customer_dialog_link").on('click',function(event){
		$( "#search_customer_name" ).on('input',function(e){
			autocompleteCustomer($(this));
		});
		
		$('#search_customer_dialog').dialog('open');
		event.preventDefault();
	});

	$('#search_customer_dialog').dialog({
		modal:true,
		autoOpen: false,
		width: 500,
		buttons: [
			{
				text: "Ko'rish",
				click: function() {
					while($('#customer_report_details').html()){
						$('#customer_report_details').remove();
					}
					$('#search_customer_dialog').after('<div class="report_details" id="customer_report_details" title=""></div>');
					var data={
						report_details:'customer',
						name:$('#search_customer_dialog #search_customer_name').val()
					}
					$('#customer_report_details').attr('title',data.name);
					$("#customer_report_details").dialog({
						modal:true,
						autoOpen: false,
						width: 1000,
						position:{
							my:'center top',
							at:'center top-20',
							of:window
						}
					});
					$.ajax({
						type:"GET",
						data:data,
						url:"../common/get.php",
						success:function(data){
							$('#customer_report_details').html(data);
							$('#customer_report_details td.blank_result').on('click',function(){
								while($('.blank_result_dialog').html()){
									$('.blank_result_dialog').remove();
								}
								$('#customer_report_details').after('<div class="blank_result_dialog"></div>')
								$(".blank_result_dialog").dialog({
									modal:true,
									autoOpen: false,
									width: 1200,
									position:{
										my:'center top',
										at:'center top-20',
										of:window
									},
									buttons: [
										{
											text: "Print",
											click: function() {
												$('.blank_result_dialog').print();
												$( this ).dialog( "close" );
											}
										}
									]
								});
								var customer_id=$(this).attr('customer_id');
								var customer_name=$(this).attr('customer_name');
								var customer_dob=$(this).attr('customer_dob');
								var status=$(this).text().trim();
								if(status=='*'){
									var action=0;
								}else{
									var action='see';
								}
								var order_id=$(this).parent().attr('order_id');
								var data={
									blank:'see_blank_result',
									action:action,
									order_id:order_id
								}
								if(data.action){
									$.ajax({
										type:"GET",
										url:'../common/get.php',
										data:data,
										success:function(data){
											$('.blank_result_dialog').html(data);
											$('.blank_result_dialog .customer_id').text(customer_id);
											$('.blank_result_dialog .customer_name').text(customer_name);
											$('.blank_result_dialog .customer_dob').text(customer_dob);
										}
									});
									//$('#customer_report_details').dialog('close');
									$('.blank_result_dialog').dialog('open');
								}else{
									alert('Blanka natijasi hali tayyor emas!');
								}
							});
						}
					});
					$(this).dialog( "close" );
					$('#customer_report_details').dialog('open');
				}
			},
			{
				text: "Yangi tashrif",
				click: function() {
					var name=$('#search_customer_dialog #search_customer_name').val().trim();
					if(name){
						var data={
							search_key:name,
							item:'customer'
						}
						$.ajax({
							type:"GET",
							url:'../common/get.php',
							data:data,
							success:function(data){
								$('#search_customer_dialog ol.customer_details').html(data);
								$('#customer_name').val($('.customer_details li[data_name="name"]').text());
								$('#datepicker').val($('.customer_details li[data_name="d_o_b"]').text());
								var region_id=$('.customer_details li[data_name="region_id"]').text();
								var district_id=$('.customer_details li[data_name="district_id"]').text();
								var org_id=$('.customer_details li[data_name="org_id"]').text();
								if(region_id&&org_id){
									$('#organizations,#regions').selectmenu('destroy');
									$('#regions option[region_id='+region_id+']').attr('selected','selected');
									$('#regions').selectmenu();
									district();
									if(district_id){
										$('#districts').selectmenu('destroy');
										$('#districts option[district_id='+district_id+']').attr('selected','selected');
										$('#districts').selectmenu();
									}
									$('#organizations option[org_id='+org_id+']').attr('selected','selected');
									$('#organizations').selectmenu();
									$('#regions-menu').on('click',function(){
										district();
									});
								}
								customer_id=$('.customer_details li[data_name="customer_id"]').text();
								$('#search_customer_dialog ol.customer_details').html('');
							}
						});
						$( this ).dialog( "close" );
					}
				}
			}
		]
	});

	$('.registrator_settings_dialog_link').on('click',function(event){
		$('#registrator_change_password_form #registrator_old_password').val('');
		$('#registrator_change_password_form #registrator_new_password').val('');
		$('#registrator_change_password_form p.error').remove();
		$('#registrator_settings_dialog').dialog('open');
		event.preventDefault();
	});

	$('.administrator_settings_dialog_link').on('click',function(event){
		$('#administrator_change_password_form #administrator_old_password').val('');
		$('#administrator_change_password_form #administrator_new_password').val('');
		$('#administrator_change_password_form p.error').remove();
		$('#administrator_settings_dialog').dialog('open');
		event.preventDefault();
	});

	$('#registrator_settings_dialog').dialog({
		autoOpen: false,
		width: 500,
		buttons: [
			{
				text: "O'zgartirish",
				click: function() {
					$('#registrator_change_password_form p.error').remove();
					data={
						item:'staff',
						role:'registrator',
						id: $('#registrator_change_password_form input[name="user_id"]').val(),
						old_password:$('#registrator_change_password_form #registrator_old_password').val(),
						new_password:$('#registrator_change_password_form #registrator_new_password').val()
					}
					if(data.old_password&&data.new_password){
						$.ajax({
							url:'../models/change_item.php',
							type:"POST",
							data:data,
							success:function(data){
								if(data==1){
									alert("Parol o'zgartirildi");
									$('#registrator_settings_dialog').dialog( "close" );
								}else if(data==0){
									$('#registrator_change_password_form #registrator_old_password').after("<p class='error'>Parol noto\'g\'ri kiritilgan</p>");
								}
							}
						});
					}else{
						$( this ).dialog( "close" );
					}
				}
			},
			{
				text: "Bekor qilish",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});

	$('#administrator_settings_dialog').dialog({
		autoOpen: false,
		width: 500,
		buttons: [
			{
				text: "O'zgartirish",
				click: function() {
					$('#administrator_change_password_form p.error').remove();
					data={
						item:'staff',
						role:'admin',
						old_password:$('#administrator_change_password_form #administrator_old_password').val(),
						new_password:$('#administrator_change_password_form #administrator_new_password').val()
					}
					if(data.old_password&&data.new_password){
						$.ajax({
							url:'../models/change_item.php',
							type:"POST",
							data:data,
							success:function(data){
								if(data==1){
									alert("Parol o'zgartirildi");
									$('#administrator_settings_dialog').dialog( "close" );
								}else if(data==0){
									$('#administrator_change_password_form #administrator_old_password').after("<p class='error'>Parol noto\'g\'ri kiritilgan</p>");
								}
							}
						});
					}else{
						$( this ).dialog( "close" );
					}
				}
			},
			{
				text: "Bekor qilish",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});

	$('.registrator_analize_results_dialog_link').on('click', function(e){
		let th=$(this);
		th.addClass('btn-loading');
		// do some stuff with ajax
		let data={
			registrator_analize_results:true
		}
		$.ajax({
			url:'../common/get.php',
			type:'GET',
			data:data,
			success:function(data){
				$('#registrator_analize_results_dialog .registrator_analize_results_dialog_body').html(data);
				$('#registrator_analize_results_dialog').dialog('open');
				th.removeClass('btn-loading');

				$('#registrator_analize_results_dialog .registrator_analize_results_dialog_body td.blank').on('click',function(){
					while($("#blank_dialog").html()){
						$("#blank_dialog").remove();
					}
					var customer_name=$(this).parent().find('td.customer_name').text();
					var customer_dob=$(this).parent().find('td.customer_dob').text();
					var customer_id=$(this).parent().find('td.customer_id').text();
					var order_id=$(this).parent().attr('order_id');
					var blank_name=$(this).parent().find('td.blank').text();
					if(!blank_name){
						return;
					}
					action='see';
					$(this).parent().parent().after('<div id="blank_dialog" action='+action+'></div>');
					$('#blank_dialog').attr('title',customer_name);
					var data={
						action,
						blank:blank_name,
						order_id:order_id
					}
					$.ajax({
						type:"GET",
						data:data,
						url:"../common/get.php",
						success:function(data){
							$('#blank_dialog').html(data);
							$('#blank_dialog .customer_id').text(customer_id);
							$('#blank_dialog .customer_name').text(customer_name);
							$('#blank_dialog .customer_dob').text(customer_dob);

							$("#blank_dialog" ).dialog({
								modal:true,
								autoOpen: false,
								width: 1200,
								position:{
									my:'center top',
									at:'center top-20',
									of:window
								},
								buttons: [
									{
										text: "Print",
										click: function() {
											$('#blank_dialog').print({});
											$( this ).dialog( "close" );
										}
									}
								]
							});
							$('.blank-result-condition input').checkboxradio();
							$( "#blank_dialog" ).dialog( "open" );
							event.preventDefault();
						}	
					});
					event.preventDefault();
				});
			},
			error:(err)=>{
				console.error(err);
			}
		});
	});
	$('#registrator_analize_results_dialog').dialog({
		width:'100%',
		modal:true,
		autoOpen: false,
		position:{
			my: 'center top',
			at: 'center top',
			of: window
		}
	});



//   J-QUERY-UI END     
	$('#regions, #services, select#doctors').selectmenu();
	$('.get-result-method input').checkboxradio();
	$('#regions-menu').on('click',function(){
		district();
	});
	district();

	$('.registrator2-services-list .after-service-type').hide();

	$('select#serviceTypes').selectmenu({
		change:(event, ui)=>{
			let data={
				getServiceOptions:true,
				serviceType: ui.item.value
			}
			$.ajax({
				type:"GET",
				url:"../common/get.php",
				data:data,
				success:function(data){
					//alert(data);
					$('#services').selectmenu('destroy');

					$('#services').html(data);
					$('#services').selectmenu({
						change:(event, ui)=>{
							let total_price = ui.item.element.attr('price');
							$('.total_price_form').text("Umumiy narx : "+total_price);
						}
					});
					$('.registrator2-services-list .after-service-type').fadeIn(500);
				}
			});

			data={
				getDoctorOptions:true,
				serviceType: ui.item.value
			}
			$.ajax({
				type:"GET",
				url:"../common/get.php",
				data:data,
				success:function(data){
					//alert(data);
					$('select#doctors').selectmenu('destroy');

					$('select#doctors').html(data);
					$('select#doctors').selectmenu();
					$('.registrator2-services-list .after-service-type').fadeIn(500);
				}
			});
		}
	});
	
	$('.add').hide();
});

function totalPrice(){
	var total_price=0;
	var chosen_analizes_prices=$('.chosen_analize .analize_price');
	for(var i=0;i<chosen_analizes_prices.length;i++){
		total_price+=chosen_analizes_prices.eq(i).text()/1;
	}
	$('.total_price_form').text("Umumiy narx : "+total_price);
}

function district(){
	$('select[name="district"]').remove();
	var region_id=$('#regions option:selected').attr('region_id');
	var data={
		region:region_id
	}
	$.ajax({
		type:"GET",
		url:"../common/get.php",
		data:data,
		success:function(data){
			//alert(data);
			$('select#regions').next().after("<select name='district' id='districts'>"+data+"</select>");
			$('#districts').selectmenu();
		}
	});
}

function getTabItem(tab_item='',options={}){
	console.log('getting tab item',tab_item);
	tab_id=$('#tabs .administrator_tab_item[tab_item='+tab_item+']').find('a').attr('href');
	var data={
		tab_item:tab_item,
		key:options.key,
		from:options.from,
		till:options.till
	}
	$.ajax({
		url:'../common/get.php',
		type:'GET',
		data:data,
		success:function(data){
			$(tab_id).html(data);
			
			if(tab_item=='report'){
				var now=new Date();

				//prepare year
				var current_year=now.getFullYear();
				var content='';
				for(var i=2018;i<=current_year;i++){
					let selected = i==current_year ? 'selected="selected"' : '';
					content+='<option ' + selected + '>'+i+'</option>';
				}
				$(tab_id + ' .custom_time #from_time .custom_year').html(content);
				$(tab_id + ' .custom_time #till_time .custom_year').html(content);

				//prepare month
				var current_month=now.getMonth()+1;
				$('.custom_time .custom_month option[month='+current_month+']').attr('selected','selected');

				// prepare day
				dayOfMonth(tab_id+ ' #from_time');
				dayOfMonth(tab_id+ ' #till_time', now.getDate());

				// buttons
				$('#show-report-button, #archive-button').button();

				$(tab_id + ' .custom_time select').on('change',function(e){
					if(!$(this).is('.custom_day')){
						dayOfMonth(tab_id + ' #'+$(this).parent().attr('id'), $(this).siblings().filter('.custom_day').val());
					}
				});
				$('.report-top-bar #show-report-button').on('click',function(){
					var th=$(this);
					var registrator = $('.user-filter #registrator option:selected').attr("registrator_id").trim();
					th.addClass('btn-loading');
					$('#report_tabs').remove();
					var report_type='custom_time';
					if(report_type=='custom_time'){
						from=new Date($('.custom_time #from_time .custom_year option:selected').html(),$('.custom_time #from_time .custom_month option:selected').attr('month')-1,$('.custom_time #from_time .custom_day option:selected').html());
						from=from.getTime()/1000;
						till=new Date($('.custom_time #till_time .custom_year option:selected').html(),$('.custom_time #till_time .custom_month option:selected').attr('month')-1,$('.custom_time #till_time .custom_day option:selected').html(),23,59);
						till=till.getTime()/1000;
						var data={
							report_type:report_type,
							from:from,
							till:till,
							registrator
						}
					}else{
						var data={
							report_type:report_type
						}
					}
					if(data.report_type){
						$.ajax({
							type:"GET",
							data:data,
							url:"../common/get.php",
							success:function(data){
								th.removeClass('btn-loading');
								$('.report-top-bar').after("<div id='report_tabs'>"+data+"</div>");

								if($('#report_tabs .table_report_organizations tr').length<=2){
									$('#report_tabs-1').html('Ma\'lumotlar mavjud emas!');
								}

								if($('#report_tabs .table_report_analizes tr').length<=2){
									$('#report_tabs-2').html('Ma\'lumotlar mavjud emas!');
								}

								$('#report_tabs').tabs();
								$('#report_tabs button.print-button').button().on('click',function(){
									printTable('#report_tabs div[aria-hidden="false"] table');
								});
								
								//alert('done');
								$('#report_tabs #report_tabs-1 tr.organization').on('click',function(event){
									while($("#organization_report_details").html()){
										$("#organization_report_details").remove();
									}
									var org_name=$(this).find('td').eq(0).text();
									$(this).parent().after('<div class="report_details" id="organization_report_details"></div>');
									$('#organization_report_details').attr('title',org_name);
									var bonus=$(this).find('.org_bonus_percent').text().trim();
									bonus=bonus.substring(1,bonus.length-2);
									var data={
										report_details:'organization',
										id:$(this).attr('item_id'),
										org_bonus:bonus,
										org_name:org_name,
										from:from,
										till:till
									}
									$.ajax({
										type:"GET",
										data:data,
										url:"../common/get.php",
										success:function(data){
											$('#organization_report_details').html(data);
											$("#organization_report_details" ).dialog({
												modal:true,
												maxHeight:1000,
												autoOpen: false,
												width: 1000,
												position:{
													my:'center top',
													at:'center top-20',
													of:window
												},
												buttons: [
													{
														text: "Print",
														click: function() {
															printTable('#organization_report_details table');
														}
													}
												]
											});
											$( "#organization_report_details" ).dialog( "open" );
											event.preventDefault();
										}	
									});
									event.preventDefault();
								});

								var tables=$('table');
								for(var i=0;i<tables.length;i++){
									var rows=tables.eq(i).find('tr');
									rows.eq(0).css('background-color','#e0e0ff');
									for(var j=1;j<rows.length;j+=2){
										rows.eq(j).css('background-color','#efefef');
									}
								}
							}
						});
					}
				});

				// $('.report-top-bar #archive-button').on('click',function(){
				// 	$('#report_tabs').remove();
				// 	$.ajax({
				// 		type:'GET',
				// 		url:'../common/get.php',
				// 		data:{
				// 			json_archive:true
				// 		},
				// 		success:function(data){
				// 			//var archives=JSON.parse(data.trim());
				// 			$('.report-top-bar').after('<div id="archive-content">' + data + '</div>');
				// 		}
				// 	})
				// });
			}else if(tab_item=='products'){
				$( "#add_product_dialog_link" ).on('click',function( event ) {
					$('#add_product_form label[for="quantity"]').html('');
					action="add";
					$( "#add_product_dialog #name").val('');
					$( "#add_product_dialog #price").val('');
					$('#add_product_form label[for="quantity"]').html('Miqdor: <input type="text" name="quantity" id="quantity">');
					$( "#add_product_dialog #quantity").val('');
					$('#add_product_form #quantity').spinner();
					$( "#add_product_dialog" ).dialog( "open" );
					event.preventDefault();
				});

				$( ".change_product_dialog_link" ).on('click',function( event ) {
					$('#add_product_form label[for="quantity"]').html('');
					action="change";
					item_id=$(this).attr('item_id');
					name=$(this).parent().siblings().eq(0).text();
					quantity=$(this).parent().siblings().eq(1).text();
					price=$(this).parent().siblings().eq(2).text();
					$( "#add_product_dialog #name").val(name);
					$( "#add_product_dialog #price").val(price);
					$('#add_product_form label[for="quantity"]').html('Miqdor: <input type="text" name="quantity" id="quantity">');
					$( "#add_product_dialog #quantity").val(quantity);
					$('#add_product_form #quantity').spinner();
					$( "#add_product_dialog" ).dialog( "open" );
					event.preventDefault();
				});

				$("#add_product_dialog" ).dialog({
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								if(action=='add'){
									file='add_item';
								}else if (action=='change'){
									file='change_item';
								}
								data={
									item:'product',
									item_id:item_id,
									name:$('#add_product_form #name').val(),
									price:$('#add_product_form #price').val(),
									quantity:$('#add_product_form #quantity').val()
								}
								if(data.name&&data.price&&data.quantity){
									$.ajax({
										type:"POST",
										url:"../models/"+file+".php",
										data:data,
										success:function(data){
											getTabItem('products');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
			}else if(tab_item=='customers'){
				var now=new Date();

				//prepare year
				var current_year=now.getFullYear();
				var content='';
				for(var i=2018;i<=current_year;i++){
					let selected='';
					if(i==current_year){
						selected='selected="selected"';
					}
					content+='<option year="'+i+'" '+selected+'>'+i+'</option>';
				}
				$(tab_id + ' .custom_time #from_time .custom_year').html(content);
				$(tab_id + ' .custom_time #till_time .custom_year').html(content);

				//prepare month
				var current_month=now.getMonth()+1;
				$('.custom_time .custom_month option[month='+current_month+']').attr('selected','selected');

				// prepare day
				let chosenDayFrom=(options.from && options.till) ? $('.custom_time #from_time .custom_day').attr('value') : now.getDate();
				let chosenDayTill=(options.from && options.till) ? $('.custom_time #till_time .custom_day').attr('value') : now.getDate();
				dayOfMonth(tab_id + ' #from_time', chosenDayFrom);
				dayOfMonth(tab_id + ' #till_time', chosenDayTill);

				// select previously chosen values
				if(options.from && options.till){
					// year
					$('.custom_year option').removeAttr('selected');
					$('.custom_time #from_time .custom_year option[year='+$('.custom_time #from_time .custom_year').attr('value')+']').attr('selected','selected');
					$('.custom_time #till_time .custom_year option[year='+$('.custom_time #till_time .custom_year').attr('value')+']').attr('selected','selected');

					//month
					$('.custom_month option').removeAttr('selected');
					$('.custom_time #from_time .custom_month option[month='+$('.custom_time #from_time .custom_month').attr('value')+']').attr('selected','selected');
					$('.custom_time #till_time .custom_month option[month='+$('.custom_time #till_time .custom_month').attr('value')+']').attr('selected','selected');

					//day
					$('.custom_day option').removeAttr('selected');
					$('.custom_time #from_time .custom_day option[day='+$('.custom_time #from_time .custom_day').attr('value')+']').attr('selected','selected');
					$('.custom_time #till_time .custom_day option[day='+$('.custom_time #till_time .custom_day').attr('value')+']').attr('selected','selected');
				}

				// change handler for month and year so that days in chosen month can be corrected
				$('.custom_time select').on('change',function(e){
					if(!$(this).is('.custom_day')){
						let chosenDay=$(this).siblings().filter('.custom_day').val();
						dayOfMonth(tab_id + ' #' + $(this).parent().attr('id'), chosenDay);
					}
				});

				// buttons
				$('#filter-by-date').button();

				$( ".change_customer_dialog_link" ).on('click',function( event ) {
					//alert('clicked');
					action="change";
					item_id=$(this).attr('item_id');
					//alert($('#add_product_dialog').attr('title'));
					name=$(this).parent().siblings().eq(1).text();
					dob=$(this).parent().siblings().eq(2).text();
					org=$(this).parent().siblings().eq(3).text();
					phone=$(this).parent().siblings().eq(6).text();
					$( "#change_customer_dialog #customer_name").val(name);
					$( "#change_customer_dialog #customer_dob").val(dob);
					$( "#change_customer_dialog #org_for_customer").val(org);
					$( "#change_customer_dialog #customer_phone").val(phone);
					$('#org_for_customer').one('click',function(){
						var data={
							getOrganizationNames:1
						}
						$.ajax({
							type:"GET",
							url:'../common/get.php',
							data:data,
							success:function(data){
								var org_names=JSON.parse(data);
								for(var i=0;i<org_names.length;i++){
									org_names[i]=org_names[i].name;
								}
								$( "#org_for_customer" ).autocomplete({
									source: org_names,
									delay:2000
								});
							}
						});
					});
					$( "#change_customer_dialog" ).dialog( "open" );
					event.preventDefault();
				});
				$("#change_customer_dialog" ).dialog({
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Saqlash",
							click: function() {;
								if(action=='add'){
									file='add_item';
								}else if (action=='change'){
									file='change_item';
								}
								data={
									item:'customer',
									item_id:item_id,
									name:$('#change_customer_dialog #customer_name').val(),
									dob:$('#change_customer_dialog #customer_dob').val(),
									org:$('#change_customer_dialog #org_for_customer').val(),
									phone:$('#change_customer_dialog #customer_phone').val()
								}
								if(data.name&&data.dob){
									$.ajax({
										type:"POST",
										url:"../models/"+file+".php",
										data:data,
										success:function(data){
											if(data=='saved'){
												getTabItem('customers');
											}else if(data=='org_error'){
												alert('Tashkilot nomi noto\'g\'ri kiritilgan!');
											}
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
				$('.toolbar .search-button').click(()=>{
					var key=$('.toolbar input.search-customer-key').val();
					if(key){
						getTabItem(tab_item,{key});
					}
				});

				$('.toolbar #filter-by-date').click(function(){
					$(this).addClass('btn-loading');

					if($(this).attr('action')=='filter'){
						let from=new Date($('.custom_time #from_time .custom_year option:selected').html(),$('.custom_time #from_time .custom_month option:selected').attr('month')-1,$('.custom_time #from_time .custom_day option:selected').html());
						from=from.getTime()/1000;
						let till=new Date($('.custom_time #till_time .custom_year option:selected').html(),$('.custom_time #till_time .custom_month option:selected').attr('month')-1,$('.custom_time #till_time .custom_day option:selected').html(),23,59);
						till=till.getTime()/1000;
						getTabItem(tab_item, {...options, from, till});
					}else if($(this).attr('action')=='cancel'){
						getTabItem(tab_item, {key:options.key});
					}
					
				});
			}else if(tab_item=='analizes'){
				$( ".add_analize_dialog_link" ).on('click',function( event ) {
					action="add";
					$( "#add_analize_dialog #analize_name").val('');
					$( "#add_analize_dialog #analize_price").val('');
					$( "#add_analize_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".add_analize_type_dialog_link" ).on('click',function( event ) {
					$( "#add_analize_type_dialog #analize_type").val('');
					$( "#add_analize_type_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".change_analize_dialog_link" ).on('click',function( event ) {
					action="change";
					item_id=$(this).attr('item_id');
					$('#add_analize_dialog').attr('title','Ozgartirish');

					//getting values from table boxes
					var name=$(this).parent().siblings().eq(0).text();
					var price=$(this).parent().siblings().eq(1).text();
					var room_id=$(this).parent().siblings().eq(2).attr('room_id');
					var laborant_id=$(this).parent().siblings().eq(3).attr('laborant_id');
					var blank_id=$(this).parent().siblings().eq(4).attr('blank_id');
					var analize_type=$(this).closest('table').attr('analize-type-id');
					$( "#add_analize_dialog #analize_name").val(name);
					$( "#add_analize_dialog #analize_price").val(price);

					//set analize type
					$('#analize_types').selectmenu('destroy');
					$('#analize_types option[selected="selected"]').removeAttr('selected');
					$('#analize_types option[type_id="'+analize_type+'"]').attr('selected','selected');
					$('#analize_types').selectmenu();

					// set blank
					$('#analize_blanks').selectmenu('destroy');
					$('#analize_blanks option[selected="selected"]').removeAttr('selected');
					$('#analize_blanks option[blank_id="'+blank_id+'"]').attr('selected','selected');
					$('#analize_blanks').selectmenu();

					// set room
					$('#analize_rooms').selectmenu('destroy');
					$('#analize_rooms option[selected="selected"]').removeAttr('selected');
					$('#analize_rooms option[room_id="'+room_id+'"]').attr('selected','selected');
					$('#analize_rooms').selectmenu();

					// set laborant
					$('#laborants').selectmenu('destroy');
					$('#laborants option[selected="selected"]').removeAttr('selected');
					$('#laborants option[laborant_id="'+laborant_id+'"]').attr('selected','selected');
					$('#laborants').selectmenu();

					$( "#add_analize_dialog" ).dialog( "open" );
					event.preventDefault();
				});
				$('#add_analize_dialog select').selectmenu();
				$("#add_analize_dialog" ).dialog({
					modal:true,
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								if(action=='add'){
									file='add_item';
								}else if (action=='change'){
									file='change_item';
								}
								data={
									item:'analize',
									item_id:item_id,
									name:$('#add_analize_form #analize_name').val(),
									type:$('#add_analize_form #analize_types option:selected').attr('type_id'),
									price:$('#add_analize_form #analize_price').val(),
									room:$('#add_analize_form #analize_rooms option:selected').attr('room_id'),
									laborant:$('#add_analize_form #laborants option:selected').attr('laborant_id'),
									blank:$('#add_analize_form #analize_blanks option:selected').attr('blank_id')
								}
								if(data.name&&data.price){
									$.ajax({
										type:"POST",
										url:"../models/"+file+".php",
										data:data,
										success:function(data){
											getTabItem('analizes');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
				$("#add_analize_type_dialog" ).dialog({
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								data={
									item:'analize_type',
									name:$('#add_analize_type_form #analize_type').val()
								}
								if(data.name){
									$.ajax({
										type:"POST",
										url:"../models/add_item.php",
										data:data,
										success:function(data){
											getTabItem('analizes');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
			}else if(tab_item=='services'){
				$( ".add_service_dialog_link" ).on('click',function( event ) {
					action="add";
					$( "#add_service_dialog #service_name").val('');
					$( "#add_service_dialog #service_price").val('');
					$( "#add_service_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".add_service_type_dialog_link" ).on('click',function( event ) {
					$( "#add_service_type_dialog #service_type").val('');
					$( "#add_service_type_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".change_service_dialog_link" ).on('click',function( event ) {
					action="change";
					item_id=$(this).attr('item_id');
					$('#add_service_dialog').attr('title','Ozgartirish');

					//getting values from table boxes
					var name=$(this).parent().siblings().eq(0).text();
					var service_type=$(this).closest('table').attr('service-type-id');
					var price=$(this).parent().siblings().eq(2).text();
					
					$( "#add_service_dialog #service_name").val(name);
					$( "#add_service_dialog #service_price").val(price);

					//set service type
					$('#service_types').selectmenu('destroy');
					$('#service_types option[selected="selected"]').removeAttr('selected');
					$('#service_types option[type_id="'+service_type+'"]').attr('selected','selected');
					$('#service_types').selectmenu();

					$( "#add_service_dialog" ).dialog( "open" );
					event.preventDefault();
				});
				$('#add_service_dialog select').selectmenu();
				$("#add_service_dialog" ).dialog({
					modal:true,
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								if(action=='add'){
									file='add_item';
								}else if (action=='change'){
									file='change_item';
								}
								data={
									item:'service',
									item_id:item_id,
									name:$('#add_service_form #service_name').val(),
									type:$('#add_service_form #service_types option:selected').attr('type_id'),
									price:$('#add_service_form #service_price').val()
								}
								if(data.name&&data.price){
									$.ajax({
										type:"POST",
										url:"../models/"+file+".php",
										data:data,
										success:function(data){
											getTabItem('services');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
				$("#add_service_type_dialog" ).dialog({
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								data={
									item:'service_type',
									name:$('#add_service_type_form #service_type').val()
								}
								if(data.name){
									$.ajax({
										type:"POST",
										url:"../models/add_item.php",
										data:data,
										success:function(data){
											getTabItem('services');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
			}else if(tab_item=='personal_page'){
				$('#personal-page-tabs').tabs();
				$('#personal-page-tabs .print-button, #personal-page-tabs .export-excel-button').button();
				$('#personal-page-tabs .print-button').on('click',function(e){
					$('#personal-page-tabs .archive-table').print();
				});

				$('#personal-page-tabs .export-excel-button').on('click',function(){
					exportTableToExcel('archive-table',$(this).attr('filename'));

					$.ajax({
						url:'../common/get.php',
						data:{
							json_archive_exported:true
						},
						type:'GET',
						success:function(data){
							console.log('json files removed');
						}
					});
				});
			}else if(tab_item=='staffs'){
				$( ".add_doctor_dialog_link" ).on('click',function( event ) {
					action="add";
					$( "#add_doctor_dialog #doctor_name").val('');
					$( "#add_doctor_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".change_doctor_dialog_link" ).on('click',function( event ) {
					action="change";
					item_id=$(this).attr('item_id');
					$('#add_doctor_dialog').attr('title','Ozgartirish');

					//getting values from table boxes
					var name=$(this).parent().siblings().eq(0).text();
					var service_type=$(this).parent().siblings().eq(2).attr('service-type-id');
					
					$( "#add_doctor_dialog #doctor_name").val(name);

					//set doctor type
					$('#service_types').selectmenu('destroy');
					$('#service_types option[selected="selected"]').removeAttr('selected');
					$('#service_types option[type_id="'+service_type+'"]').attr('selected','selected');
					$('#service_types').selectmenu();

					$( "#add_doctor_dialog" ).dialog( "open" );
					event.preventDefault();
				});
				$('#add_doctor_dialog select').selectmenu();
				$("#add_doctor_dialog" ).dialog({
					modal:true,
					autoOpen: false,
					width: 500,
					buttons: [
						{
							text: "Ok",
							click: function() {;
								if(action=='add'){
									file='add_item';
								}else if (action=='change'){
									file='change_item';
								}
								data={
									item:'doctor',
									item_id:item_id,
									name:$('#add_doctor_form #doctor_name').val(),
									serviceType:$('#add_doctor_form #service_types option:selected').attr('type_id')
								}
								if(data.name){
									$.ajax({
										type:"POST",
										url:"../models/"+file+".php",
										data:data,
										success:function(data){
											getTabItem('staffs');
										},
										error:function(xhr){
											alert(xhr.status+" error "+xhr.statusText);
										}
									});
								}else{
									alert("request was not sent");
								}
								$( this ).dialog( "close" );
							}
						},
						{
							text: "Bekor qilish",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					]
				});
			}
			var tables=$('table');
			for(var i=0;i<tables.length;i++){
				var rows=tables.eq(i).find('tr');
				rows.eq(0).css('background-color','#e0e0ff');
				for(var j=1;j<rows.length;j+=2){
					rows.eq(j).css('background-color','#efefef');
				}
			}
			makeReady();
		}
	});
}

function dayOfMonth(selector, value=''){
	var custom_day=$(selector + ' .custom_day');
	var time=new Date(custom_day.next().next().find('option:selected').text(),custom_day.next().find('option:selected').attr('month')-1,1);
	time=time.getTime()/1000;
	var data={
		year_and_month:time
	}
	$.ajax({
		type:"GET",
		data:data,
		url:'../common/get.php',
		success:function(data){
			var content='';
			for(var j=1;j<=data;j++){
				var selected='';
				if(value==j){
					selected='selected="selected"';
				}
				content+='<option day="'+j+'" '+selected+'>'+j+'</option>';
			}
			custom_day.html(content);
		}
	});
}

function makeReady(){
	$('.delete_item_button, .change_item_button, .add_item_button, .registrator_bottom .print_button,.registrator_bottom .save_button, .registrator_search_button,.registrator_settings_button,.administrator_settings_button, .registrator_analize_results_button').button();
	// Links to open the dialog
	

	$('#add_org_dialog_link').on('click',function( event ) {
		//alert('add');
		action="add";
		//$("#add_org_dialog label['for=org_customers']").show();
		$( "#add_org_dialog #org_name").val('');
		$( "#add_org_dialog #org_bonus").val('');
		$( "#add_org_dialog" ).dialog( "open" );
		event.preventDefault();
	});

	$( ".change_org_dialog_link" ).on('click',function( event ) {
		//alert('clicked');
		action="change";
		item_id=$(this).attr('item_id');
		$('#add_analize_dialog').attr('title','Ozgartirish');
		//alert($('#add_analize_dialog').attr('title'));
		name=$(this).parent().siblings().eq(0).text();
		bonus=$(this).parent().siblings().eq(1).text();
		$( "#add_org_dialog #org_name").val(name);
		$("#add_org_dialog #org_bonus").val(bonus);
		$( "#add_org_dialog" ).dialog( "open" );
		event.preventDefault();
	});

	$( ".add_district_dialog_link" ).on('click',function( event ) {
		//alert('add');
		action="add";
		$( "#add_district_dialog #district_name").val('');
		$( "#add_district_dialog").dialog( "open" );
		event.preventDefault();
	});

	$( ".change_district_dialog_link" ).on('click',function( event ) {
		//alert('clicked');
		action="change";
		item_id=$(this).attr('item_id');
		//alert($('#add_district_dialog').attr('title'));
		name=$(this).parent().siblings().eq(0).text();
		$( "#add_district_dialog #district_name").val(name);
		$( "#add_district_dialog" ).dialog( "open" );
		event.preventDefault();
	});

	//dialogs

	$('#add_org_dialog').dialog({
		autoOpen: false,
		width: 500,
		buttons: [
			{
				text: "Saqlash",
				click: function() {;
					if(action=='add'){
						file='add_item';
					}else if (action=='change'){
						file='change_item';
					}
					data={
						item:'org',
						item_id:item_id,
						name:$('#add_org_form #org_name').val(),
						bonus:$('#add_org_form #org_bonus').val()
					}
					if(data.name){
						$.ajax({
							type:"POST",
							url:"../models/"+file+".php",
							data:data,
							success:function(data){
								getTabItem('organizations');
							},
							error:function(xhr){
								alert(xhr.status+" error "+xhr.statusText);
							}
						});
					}else{
						alert("request was not sent");
					}
					$( this ).dialog( "close" );
				}
			},
			{
				text: "Bekor qilish",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});

	$("#add_district_dialog").dialog({
		autoOpen: false,
		width: 500,
		buttons: [
			{
				text: "Saqlash",
				click: function() {
					if(action=='add'){
						file='add_item';
					}else if (action=='change'){
						file='change_item';
					}
					data={
						item:'district',
						item_id:item_id,
						name:$('#add_district_form #district_name').val(),
						region:$('#add_district_form option:selected').attr('region_id')
					}
					if(data.name){
						$.ajax({
							type:"POST",
							url:"../models/"+file+".php",
							data:data,
							success:function(data){
								getTabItem('districts');
							},
							error:function(xhr){
								alert(xhr.status+" error "+xhr.statusText);
							}
						});
					}else{
						alert("request was not sent");
					}
					$( this ).dialog( "close" );
				}
			},
			{
				text: "Bekor qilish",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});

	$( "#district_regions,#districts,#organizations,#analizes").selectmenu();

	$('.delete_item_button').on('click',function(){
		item=$(this).attr('item');
		item_id=$(this).attr('item_id');
		tab_item=$(this).attr('tab_item');
		let from = $(this).attr('from');
		let till = $(this).attr('till');
		data={
			item:item,
			item_id:item_id,
			from,
			till
		}
		if(confirm("Chindan o'chirmoqchimisiz?")){
			$.ajax({
				type:"POST",
				url:"../models/delete_item.php",
				data:data,
				success:function(data){
					getTabItem(tab_item);
				},
				error:function(){
					alert("An error occured");
				}
			});
		}
	});
}

function autocompleteCustomer(input, resolve=()=>{}){
	clearTimeout(getMatchingCustomerNames);
	getMatchingCustomerNames=setTimeout(()=>{
		try{
			input.autocomplete('destroy');
		} catch{
			console.log('unable to destroy');
		}
		
		$.get("../common/get.php",data={
			getCustomerNames:1,
			key:input.val(),
			limit:30
		},function(data){
			var names=[];
			//$('#customer_names').html(data);
			//var n=$('#customer_names li');
			//alert(n.lenginput+' customers');
			var n=JSON.parse(data);
			for(var i=0;i<n.length;i++){
				names[i]=n[i];
			}
			input.autocomplete({
				source: names
			});
			input.autocomplete('search');
			resolve();
		});
	},1000);
}

function printTable(selector){
	var table=$(selector);
	table.print({
		NoPrintSelector:'.no-print',
		title:''
	});
}

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    filename = filename?filename+'.xls':'report.xls';
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);

    var tableHTML = "<table border='2px'><tr>";
    for(var j = 0 ; j < tableSelect.rows.length ; j++) 
    {     
    	if(tableSelect.rows[j]){
    		tableHTML=tableHTML+tableSelect.rows[j].innerHTML+"</tr>";
    	}
    }
    tableHTML=tableHTML+"</table>";
	tableHTML=tableHTML.replace(/<span[^>]*>|<\/span>/g, "");
	tableHTML=tableHTML.replace(/<a[^>]*>|<\/a>/g, "");

	var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
	tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

	tableHTML=tab_text+tableHTML+'</body></html>';

	//console.log(tableHTML);

	var blob=new Blob(["\ufeff", tableHTML],{ type: "application/vnd.ms-excel" });

	console.log(blob);
	saveAs(blob, filename);
}

