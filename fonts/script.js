$(function(){
	//global variables
	saved=0;
	customer_id=0;
	action="";
	item_id="";
	var expanded = false;
	getMatchingAnalizes=setTimeout(function(){},0);

	//$('div.content-for-print').hide();

	$('#organization').on('click',function(){
		var data={
			getOrganizationNames:1
		}
		$.ajax({
			type:"GET",
			url:'../common/get.php',
			data:data,
			success:function(data){
				$('ul#organization_names').html(data);
				var org_names=[];
				var n=$('ul#organization_names li');
				for(var i=0;i<n.length;i++){
					org_names[i]=n.eq(i).text();
				}
				$( "#organization" ).autocomplete({
					source: org_names,
					delay:1000,
					minLength:3
				});
				$('ul#organization_names li').remove();
			}
		});
	});

	$("#customer_name").one('click',function(){
		var names=[];
		setTimeout(function(){
			$.get("../common/get.php",data={getCustomerNames:1},function(data){
				$('#customer_names').html(data);
				var n=$('#customer_names li');
				//alert(n.length+' customers');
				for(var i=0;i<n.length;i++){
					names[i]=n.eq(i).text();
				}
				$( "#customer_name" ).autocomplete({
					source: names,
					delay:2000,
					minLength:3
				});
			});
		});
	});

	$('#customer_name').on('input',function(){
		customer_id=0;
		setTimeout(function(){
			if($('ul.ui-autocomplete li').length>0){
				//alert($('ul.ui-autocomplete li').length+'matches');
				$('ul.ui-autocomplete li').on('click',function(){
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
		},3200);
	});

	$('.registrator_bottom .save_button').on('click',function(){
		var customer_name=$('.name_and_dob #customer_name').val();
		var customer_dob=$('.name_and_dob label[for="d_o_b"] input').val();
		var customer_region=$('.address_form select[name="region"] option:selected').attr('region_id');
		var customer_district=$('#districts option:selected').attr('district_id');
		var customer_org=$('.address_form #organization').val();
		var customer_phone=$('.name_and_dob #customer_phone').val();
		var time=$('.current_date').val();
		var analizes=$('div.chosen_analize');
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
	    	name:customer_name,
	    	dob:customer_dob,
	    	region:customer_region,
	    	district:customer_district,
	    	org:customer_org,
	    	time:time,
	    	phone:customer_phone,
	    	orders:orders
	    }
		if(customer_name&&customer_dob&&customer_org&&orders.length>0){
		    $.ajax({
		    	type:"POST",
		    	url:"../models/add_item.php",
		    	data:data,
		    	success:function(data){
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
		$('div.top table').html('');
		$('div.chosen_analizes div').each(function(){
			var $this=$(this);
			var analize_price=$this.find('span.analize_price').text();
			var analize_name=$this.contents().first().text();
			$('<tr><td>'+analize_name+'</td><td>'+analize_price+'</td><td class="field"></td></tr>').appendTo('div.top table.analizes');
			$('div.bottom p.sub_analizes').text($('div.bottom p.sub_analizes').text()+'| |'+analize_name);
		});
		var total_price=$('span.total_price_form').text();
		$('<tr><td class="total" colspan=3>'+total_price+'</td></tr>').appendTo('div.top table');
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
						for(var i=0;i<l;i++){
							var analize_id=$('.chosen_analizes div').eq(i).attr('analize_id');
							$('#checkboxes input[id='+analize_id+']').attr('checked','checked');
						}
					}
					checkboxes.buttonset();
					$('#checkboxes label input').on('change',function(){
						var chosen_analizes=$('.chosen_analizes div');
						if($(this).is(':checked')){
							//alert('checked');
							var name=$(this).next().text();
							var old_p=$(this).next().next().text();
							var id=$(this).attr('id');
							var discount=$(this).attr('discount');
							p=Math.floor(discount*old_p/100+old_p/1);

							if(chosen_analizes.length){
								var last_chosen_analize=chosen_analizes.eq(chosen_analizes.length-1);
								last_chosen_analize.after("<div analize_id="+id+" old_price="+old_p+" class='chosen_analize'>"+name+"<span class='analize_price'>"+p+"</span><input class='discount_spinner' value="+discount+"></div>");
							}else{
								$('.chosen_analizes').html("<div analize_id="+id+" old_price="+old_p+" class='chosen_analize'>"+name+"<span class='analize_price'>"+p+"</span><input class='discount_spinner' value="+discount+"></div>");
							}
						}else{
							var id=$(this).attr('id');
							$('.chosen_analizes div[analize_id='+id+']').remove();
						}

						$('.discount_spinner').spinner();
						//alert('changed');

						$('#analizes_list .chosen_analize span.ui-spinner').on('click',function(){
							//alert('clicked');
							var disc=$(this).find('input').attr('aria-valuenow');
							var id=$(this).parent().attr('analize_id');
							$('#checkboxes input[id='+id+']').attr('discount',disc);
							var old_price=$(this).parent().attr('old_price');
							p=Math.floor(disc*old_price/100+old_price/1);
							$(this).parent().find('.analize_price').text(p);
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

	getTabItem('products');


	$('#tabs .administrator_tab_item').on('click',function(){
		getTabItem($(this).attr('tab_item'));
	});

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

	// $('current_date').val()
	
	
	$('#tabs').tabs();
	

	//buttons

	$(".search_customer_dialog_link").on('click',function(event){
		names=[];
		$.get("../common/get.php",data={getCustomerNames:1},function(data){
			$('#customer_names').html(data);
			var n=$('#customer_names li');
			for(var i=0;i<n.length;i++){
				names[i]=n.eq(i).text();
			}
			$( "#search_customer_name" ).autocomplete({
				source: names,
				delay:1000,
				minLength:3
			});
		});
		
		$('#search_customer_dialog').dialog('open');
		event.preventDefault();
	});

	$('#search_customer_dialog').dialog({
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
												var content=$('.blank_result_dialog').html();
												var data={
													content:content
												}
												$.ajax({
													type:"POST",
													url:'../common/print.php',
													data:data,
													success:function(data){

													}
												});
												$( this ).dialog( "close" );
												window.open('https://ishonch/laboratoriya/common/print.php');
											}
										}
									]
								});
								var customer_id=$(this).attr('customer_id');
								var customer_name=$(this).attr('customer_name');
								var customer_dob=$(this).attr('customer_dob');
								var status=$(this).html();
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
									$('#customer_report_details').dialog('close');
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
		]
	});

	$('.registrator_settings_dialog_link').on('click',function(event){
		$('#registrator_change_password_form #registrator_old_password').val('');
		$('#registrator_change_password_form #registrator_new_password').val('');
		$('#registrator_change_password_form p.error').remove();
		$('#registrator_settings_dialog').dialog('open');
		event.preventDefault();
	})

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

//   J-QUERY-UI END     
	$('#regions').selectmenu();
	$('#regions-menu').on('click',function(){
		district();
	});
	district();
	
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

function getTabItem(tab_item=''){
	tab_id=$('#tabs .administrator_tab_item[tab_item='+tab_item+']').find('a').attr('href');
	var data={
		tab_item:tab_item
	}
	$.ajax({
		url:'../common/get.php',
		type:'GET',
		data:data,
		success:function(data){
			$(tab_id).html(data);
			
			if(tab_item=='report'){
				var now=new Date();
				var current_year=now.getFullYear();
				var content='';
				for(var i=2018;i<=current_year;i++){
					content+='<option>'+i+'</option>';
				}
				$('.custom_time #from_time .custom_year').html(content);
				$('.custom_time #till_time .custom_year').html(content);
				var current_month=now.getMonth()+1;
				$('.custom_time .custom_month option[month='+current_month+']').attr('selected','selected');
				dayOfMonth('from_time');
				dayOfMonth('till_time');
				$('.custom_time select').on('change',function(){
					if(!$(this).is('.custom_day')){
						dayOfMonth($(this).parent().attr('id'));
					}
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
							till:till
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
								$('.custom_time').after("<div id='report_tabs'>"+data+"</div>");
								$('#report_tabs').css({"margin-top":"20px"});
								if($('#report_tabs .table_report_organizations tr').length<=2){
									$('#report_tabs-1').html('Ma\'lumotlar mavjud emas!');
								}
								if($('#report_tabs .table_report_analizes tr').length<=2){
									$('#report_tabs-2').html('Ma\'lumotlar mavjud emas!');
								}
								$('#report_tabs').tabs();
								//alert('done');
								$('#report_tabs #report_tabs-1 tr.organization').on('click',function(event){
									var data={
										clear:1
									}
									$.ajax({
										type:"POST",
										url:'../common/print.php',
										data:data
									});
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
															var data={
																content:$('#organization_report_details').html()
															}
															$.ajax({
																type:"POST",
																url:'../common/print.php',
																data:data,
																success:function(data){

																}
															});
															window.open('https://ishonch/laboratoriya/common/print.php');
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
					$('#org_for_customer').on('click',function(){
						var data={
							getOrganizationNames:1
						}
						$.ajax({
							type:"GET",
							url:'../common/get.php',
							data:data,
							success:function(data){
								$('ul#organization_names_for_customer').html(data);
								var org_names=[];
								var n=$('ul#organization_names_for_customer li');
								for(var i=0;i<n.length;i++){
									org_names[i]=n.eq(i).text();
								}
								$( "#org_for_customer" ).autocomplete({
									source: org_names
								});
								while($('ul#organization_names_for_customer').children().length>0){
									$('ul#organization_names_for_customer li').remove();
								}
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
			}else if(tab_item=='analizes'){
				$( ".add_analize_dialog_link" ).on('click',function( event ) {
					action="add";
					$( "#add_analize_dialog #analize_name").val('');
					$( "#add_analize_dialog #analize_price").val('');
					$( "#add_analize_dialog").dialog( "open" );
					event.preventDefault();
				});
				$( ".change_analize_dialog_link" ).on('click',function( event ) {
					action="change";
					item_id=$(this).attr('item_id');
					$('#add_analize_dialog').attr('title','Ozgartirish');
					var name=$(this).parent().siblings().eq(0).text();
					var price=$(this).parent().siblings().eq(1).text();
					var blank_id=$(this).parent().siblings().eq(2).attr('blank_id');
					$( "#add_analize_dialog #analize_name").val(name);
					$( "#add_analize_dialog #analize_price").val(price);
					$('#analize_blanks').selectmenu('destroy');
					$('#analize_blanks option[selected="selected"]').removeAttr('selected');
					$('#analize_blanks option[blank_id="'+blank_id+'"]').attr('selected','selected');
					$('#analize_blanks').selectmenu();
					$( "#add_analize_dialog" ).dialog( "open" );
					event.preventDefault();
				});
				$('#analize_types,#analize_blanks').selectmenu();
				$("#add_analize_dialog" ).dialog({
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

function dayOfMonth(time){
	var custom_day=$('.custom_time #'+time+' .custom_day');
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
				content+='<option>'+j+'</option>';
			}
			custom_day.html(content);
		}
	});
}

function makeReady(){
	$('.delete_item_button, .change_item_button, .add_item_button, .registrator_bottom .print_button,.registrator_bottom .save_button, .registrator_search_button,.registrator_settings_button,.administrator_settings_button').button();
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
		data={
			item:item,
			item_id:item_id
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

