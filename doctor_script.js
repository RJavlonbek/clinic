$(function(){
	$('td.blank').on('click',function(){
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
		if($(this).parent().find('td.filled_time').text()==''){
			var action='fill';
		}else{
			var action='change';
		}
		$(this).parent().parent().after('<div id="blank_dialog" action='+action+'></div>');
		$('#blank_dialog').attr('title',customer_name);
		var data={
			action:action,
			blank:blank_name,
			order_id:order_id
		}
		$.ajax({
			type:"GET",
			data:data,
			url:"../common/get.php",
			success:function(data){
				$('#blank_dialog').html(data);
				var fields=$('#blank_dialog table td');
				$('#blank_dialog .customer_id').text(customer_id);
				$('#blank_dialog .customer_name').text(customer_name);
				$('#blank_dialog .customer_dob').text(customer_dob);
				$('#blank_dialog .footer_date').html('Дата: <input type="text" size=11 value="'+$('.footer_date .value').text()+'">');
				$('#blank_dialog .footer_doctor_name').html('Врач-лаборант: <input type="text" size=20 value="'+$('.footer_doctor_name .value').text()+'">');
				for(var i=0;i<fields.length;i++){
					var old_content=fields.eq(i).text();
					fields.eq(i).html('<input type="text" value="'+old_content+'"/>');
				}
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
						// {
						// 	text: "Print",
						// 	click: function() {
						// 		var input=$('#blank_dialog td input');
						// 		for(var i=0;i<input.length;i++){
						// 			var val=input.eq(i).val();
						// 			input.eq(i).parent().html(val);
						// 		}
						// 		$('#blank_dialog .footer_date').html('Дата: <span class="value">'+$('#blank_dialog .footer_date').find('input').val()+'</span>');
						// 		$('#blank_dialog .footer_doctor_name').html('Врач-лаборант: <span class="value">'+$('#blank_dialog .footer_doctor_name').find('input').val()+'</span>');
						// 		$('#blank_dialog').print({
						// 		});
						// 		$( this ).dialog( "close" );
						// 	}
						// },
						{
							text: "Saqlash",
							click:function(){
								var table=$('#blank_dialog table');
								var input=$('#blank_dialog td input');
								// getting anlize results according to filled input fields and appropriate names for that values
								// each blank table has value and name column, I am taking them as a key of fields
								var nameColumnNumber='';
								var valueColumnNumber='';
								let columns=0;
								var results=[];
								let firstRow=table.find('tr').first();
								//number of columns
								columns=firstRow.children().length;
								// valueColumnNumber and nameColumnNumber
								firstRow.find('th').each(function(index){
									if($(this).attr('col')=='value'){
										valueColumnNumber=index;
									}
									if($(this).attr('col')=='name'){
										nameColumnNumber=index;
									}
								});
								for(var i=0;i<input.length;i++){
									var th=input.eq(i);

									//storing result to array
									let row=th.closest('tr');
									let cells=row.children();
									let filledValue='';
									let name='';
									if(cells.length==columns){
										filledValue=th.closest('tr').children().eq(valueColumnNumber).find('input').val();
										name=th.closest('tr').children().eq(nameColumnNumber).text();
									}else{
										let difference=columns - cells.length;
										filledValue=th.closest('tr').children().eq(valueColumnNumber - difference).find('input').val();
										name=th.closest('tr').children().eq(nameColumnNumber - difference).text();
									}
									if(filledValue){
										results.push({
											name,
											value:filledValue
										});
									}

									// removing input tags
									var val=input.eq(i).val();
									input.eq(i).parent().html(val);
								}
								var json={
									customerName : customer_name,
									customerDob : customer_dob,
									blankName:blank_name,
									orderId:order_id,
									date: $('#blank_dialog .footer_date input').val() ? $('#blank_dialog .footer_date input').val() : '',
									results
								}
								console.log(json);
								$('#blank_dialog .footer_date').html('Дата: <span class="value">'+$('#blank_dialog .footer_date').find('input').val()+'</span>');
								$('#blank_dialog .footer_doctor_name').html('Врач-лаборант: <span class="value">'+$('#blank_dialog .footer_doctor_name').find('input').val()+'</span>');
								var action=$('#blank_dialog').attr('action');
								var blankResultCondition=$('#blank_dialog input[name="blank-result-condition"]:checked').val();
								if(action=='fill'){
									var content=$('#blank_dialog .blank_main').html()+'<span class="footer_date">'+$('#blank_dialog .footer_date').html()+'</span><span class="footer_doctor_name">'+$('#blank_dialog .footer_doctor_name').html()+'</span>';
								}else if(action=='change'){
									var content=$('#blank_dialog .blank_main').html();
								}
								var data={
									item:'blank',
									blankResultCondition,
									content:content,
									json:JSON.stringify(json),
									action:action,
									order_id:order_id
								}
								$.ajax({
									type:"POST",
									url:'../models/add_item.php',
									data:data,
									success:function(data){
										//location.reload();
									},
									error:function(err){
										console.log('error on saving filled blank',err);
									}
								});
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

	$(window).on('keydown',function(e){
		let table=$('#blank_dialog table');
		let activeInput=table.find('tr td input:focus');
		if(activeInput && activeInput.length){
			let input='null';
			switch(e.keyCode){
				case 37:
					//left
					console.log('left');
					break;
				case 38:
					// up
					let prevRow=activeInput.closest('tr').prev();
					while(input=='null'){
						if(prevRow.length){
							if(prevRow.find('td input').length){
								input=prevRow.find('td input').eq(0);
								input.focus();
							}else{
								prevRow=prevRow.prev();
							}
						}else{
							input='';
						}
					}
					break;
				case 39:
					// right
					console.log('right');
					break;
					
				case 40:
					//down
					let nextRow=activeInput.closest('tr').next();
					while(input=='null'){
						if(nextRow.length){
							if(nextRow.find('td input').length){
								input=nextRow.find('td input').eq(0);
								input.focus();
							}else{
								nextRow=nextRow.next();
							}
						}else{
							input='';
						}
					}
					break;
				default:
					break;
			}
		}
	});
});