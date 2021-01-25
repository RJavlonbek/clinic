<?php
require('define.php');
if(isset($_GET['search_key'])){
	if($_GET['item']=='analize'){ 
		$analizes=getAnalizes('all',0,0,$_GET['search_key']); 
    	foreach ($analizes as $analize) { ?>
      		<label for="<?=$analize['id'];?>">
        		<input discount="0" type="checkbox" id="<?=$analize['id'];?>" room_id="<?=$analize['xona_id'];?>">
        		<span class="analize_name"><?=$analize['nom'];?></span>
        		<span class="analize_price"><?=$analize['narx'];?></span>
    		</label>
    	<?php } 
	}elseif($_GET['item']=='customer'){
		$name=$_GET['search_key'];
		$start=strrpos($name,' ')+1;
		$end=strrpos($name, ')');
		$customer_id=substr($name,$start,$end-$start);
		if($customer_id){
			$customer=getCustomers($customer_id);?>
			<li data_name='customer_id'><?=$customer_id;?></li>
			<li data_name='name'><?=$name;?></li>
			<li data_name='d_o_b'><?=date('d/m/Y',$customer['t_sana']);?></li>
			<li data_name="region_id"><?=$customer['viloyat_id'];?></li>
			<li data_name="district_id"><?=$customer['tuman_id'];?></li>
			<li data_name="org_name"><?=$customer['tashkilot'];?></li>
			<li data_name="phone"><?=$customer['telefon'];?></li>
		<?php }
	}
}
if(isset($_GET['report_type'])){ ?>
	<ul>
		<li><a href="#report_tabs-1" class="a_admin">Tashkilotlar</a></li>
		<li><a href="#report_tabs-2" class="a_admin">Analizlar</a></li>
		<li><a href="#report_tabs-3" class="a_admin">Mijozlar</a></li>
		<li><a href="#report_tabs-4" class="a_admin">Doktorlar</li>
	</ul>
	<div id="report_tabs-1">
		<?php if($_GET['report_type']=='custom_time'){ 
			$organizations=getOrganizations($_GET['report_type'],$_GET['from'],$_GET['till']);
		}else{
			$organizations=getOrganizations($_GET['report_type']);
		} ?>
		<table class="table_report_organizations">
			<th>Tashkilot</th>
			<th>Mijozlar</th>
			<th>Analizlar</th>
			<th>Umumiy summa</th>
			<th>Bonus</th>
			<?php $total_customers=0;
			$total_analizes=0;
			$total_sum=0;
			$total_bonus=0;
			foreach($organizations as $organization){ 
				$total_customers+=$organization['num_customers'];
				$total_analizes+=$organization['num_analizes'];
				$total_sum+=$organization['sum_price'];
				$total_bonus+=$organization['sum_price']/100*$organization['bonus'];
				?>
				<tr item_id='<?=$organization['tashkilot_id'];?>' class='organization'>
					<td class="clickable"><?=$organization['nom'];?></td>
					<td><?=$organization['num_customers'];?></td>
					<td><?=$organization['num_analizes'];?></td>
					<td><?=$organization['sum_price'];?></td>
					<td>
						<span class="org_bonus_quantity">
							<?=$organization['sum_price']/100*$organization['bonus'];?>
						</span>
						<?php $bonus_percent=$organization['bonus']?$organization['bonus']:0; ?>
						<span class="org_bonus_percent">
							(<?=$bonus_percent;?>%)
						</span>
					</td>
				</tr>
			<?php } ?>
			<tr>
				<th>Jami</th>
				<th><?=$total_customers;?></th>
				<th><?=$total_analizes;?></th>
				<th><?=$total_sum;?></th>
				<th><?=$total_bonus;?></th>
			</tr>
		</table>
		<div class="print-button-box">
			<button class="print-button">Print</button>
		</div>
		<div class="report_details" id="organization_report_details" title="asd">	</div>
	</div>
	<div id="report_tabs-2">
		<?php if($_GET['report_type']=='custom_time'){ ?>
			<table class="table_report_analizes">
				<tr>
					<th>Analiz</th>
					<th>Narx (hozirgi)</th>
					<th>Analiz soni</th>
					<th>Umumiy summa</th>
				</tr>
				<?php 
				$total_price=0;
				$total_customers=0;
				$total_sum=0;
				$types=getAnalizeTypes();
				foreach($types as $type){
					$total_type_price=0;
					$total_type_customers=0;
					$total_type_sum=0;
					$analizes=getAnalizes($_GET['report_type'],$_GET['from'],$_GET['till'],'',$type['id']); 
					if(count($analizes)>0){ ?>
						<tr>
							<th colspan="4"><?=$type['nom'];?></th>
						</tr>
						<?php 
						foreach ($analizes as $analize){ 
							$total_type_price+=$analize['narx'];
							$total_type_customers+=$analize['num_customers'];
							$total_type_sum+=$analize['sum_price'];?>
							<tr>
								<td><?=$analize['nom'];?></td>
								<td><?=$analize['narx'];?></td>
								<td><?=$analize['num_customers'];?></td>
								<td><?=$analize['sum_price'];?></td>
							</tr>
						<?php } 
						$total_price+=$total_type_price;
						$total_customers+=$total_type_customers;
						$total_sum+=$total_type_sum;
						?>
						<tr>
							<th>Jami</th>
							<th> - </th>
							<th><?=$total_type_customers;?></th>
							<th><?=$total_type_sum;?></th>
						</tr>
					<?php } 
				} ?>
				<tr>
					<th>Umumiy</th>
					<th> - </th>
					<th><?=$total_customers;?></th>
					<th><?=$total_sum;?></th>
				</tr>
			</table>
			<div class="print-button-box">
				<button class="print-button">Print</button>
			</div>
			<div class="report_details" id="analize_report_details">

			</div>
		<?php } ?>
	</div>
	<div id="report_tabs-3">
		<?php $customers=getCustomers(null, null, null, $_GET['from'], $_GET['till']);?>
		<table class="table_customers">
			<th class="id_column">Id</th>
			<th>Ismi</th>
			<th>Tug'ilgan yil</th>
			<th>Tashkilot nomi</th>
			<th>Topshirgan analizlar</th>
			<th>Telefon</th>
			<?php 
			$i=0;
			$analizesCount=0;
			foreach($customers as $customer){ 
				$i++; 
				$analizesCount+=$customer['analizlar_soni']; ?>
				<tr>
					<td><?=$customer['mijoz_id'];?></td>
					<td><?=$customer['ism'];?></td>
					<td><?=date("Y",$customer['t_sana']);?></td>
					<td><?=$customer['tashkilot'];?></td>
					<td><?=$customer['analizlar_soni'];?></td>
					<td><?=$customer['telefon'];?></td>
				</tr>
			<?php } ?>
			<tr>
				<th>Jami</th>
				<th><?=$i;?></th>
				<th colspan="2"></th>
				<th><?=$analizesCount;?></th>
				<th></th>
			</tr>
		</table>
		<div class="print-button-box">
			<button class="print-button">Print</button>
		</div>
	</div>
	<div id="report_tabs-4">
		<?php if($_GET['report_type']=='custom_time'){ 
			$organizations=getOrganizations($_GET['report_type'],$_GET['from'],$_GET['till']);
		}else{
			$organizations=getORganizations($_GET['report_type']);
		} ?>
		<table class="table_report_organizations">
			<th>Tashkilot</th>
			<th>Mijozlar</th>
			<th>Analizlar</th>
			<th>Umumiy summa</th>
			<th>Bonus</th>
			<?php $total_customers=0;
			$total_analizes=0;
			$total_sum=0;
			$total_bonus=0;
			foreach($organizations as $organization){ 
				$total_customers+=$organization['num_customers'];
				$total_analizes+=$organization['num_analizes'];
				$total_sum+=$organization['sum_price'];
				$total_bonus+=$organization['sum_price']/100*$organization['bonus'];
				?>
				<tr item_id='<?=$organization['tashkilot_id'];?>' class='organization'>
					<td class="clickable"><?=$organization['nom'];?></td>
					<td><?=$organization['num_customers'];?></td>
					<td><?=$organization['num_analizes'];?></td>
					<td><?=$organization['sum_price'];?></td>
					<td>
						<span class="org_bonus_quantity">
							<?=$organization['sum_price']/100*$organization['bonus'];?>
						</span>
						<?php $bonus_percent=$organization['bonus']?$organization['bonus']:0; ?>
						<span class="org_bonus_percent">
							(<?=$bonus_percent;?>%)
						</span>
					</td>
				</tr>
			<?php } ?>
			<tr>
				<th>Jami</th>
				<th><?=$total_customers;?></th>
				<th><?=$total_analizes;?></th>
				<th><?=$total_sum;?></th>
				<th><?=$total_bonus;?></th>
			</tr>
		</table>
		<div class="print-button-box">
			<button class="print-button">Print</button>
		</div>
		<div class="report_details" id="organization_report_details" title="asd">	</div>
	</div>
<?php }
if(isset($_GET['report_details'])){
	$report_details=$_GET['report_details'];
	if($report_details=='organization'){
		$customers=getCustomersByOrg($_GET['id'],$_GET['from'],$_GET['till']);
		$bonus=$_GET['org_bonus'];
		$total=0; ?>
		<table>
			<tr>
				<th colspan="3">Vaqt</th>
				<th colspan="3">Tashkilot</th>
			</tr>
			<tr>
				<th colspan="3">
					<?=date('j-F Y',$_GET['from']);?> ---------- <?=date('j-F Y',$_GET['till']);?>
				</th >
				<th colspan="3">
					<?=$_GET['org_name'];?>
				</th>
			</tr>
			<tr>
				<th>Sana</th>
				<th>Id</th>
				<th>Ism</th>
				<th>Analiz</th>
				<th>Summa</th>
				<th>Bonus (<?=$bonus;?>%)</th>
			</tr>
			<?php 
			$total_price=0;
			$total_bonus=0;
			foreach($customers as $customer){ 
				foreach($customer['buyurtmalar'] as $order){ 
					$total_price+=$order['analiz_narx'];
					$total_bonus+=$order['analiz_narx']/100*$bonus; ?>
					<tr>
						<td class="org_report_details_analize_time">
							<?=date('j F G:i',$order['sana']);?>
						</td>
						<td><?=$customer['mijoz_id'];?></td>
						<td><?=$customer['ism'];?></td>
						<td class="org_report_details_analize_name">
							<?=$order['nom'];?>
							<?php if($order['result_condition']){
								if($order['result_condition']=='good'){ ?>
									<span class="text-success"> (Ijobiy)</span>
								<?php }else{ ?>
									<span class="text-danger"> (Salbiy)</span>
								<?php }
							} ?>
						</td>
						<td class="org_report_details_analize_price"><?=$order['analiz_narx'];?></td>
						<td><?=$order['analiz_narx']/100*$bonus;?></td>	
					</tr>
				<?php } 
			} ?>
			<tr>
				<th colspan="4">Jami</th>
				<th><?=$total_price;?></th>
				<th><?=$total_bonus;?></th>
			</tr>
		</table>
	<?php }elseif ($report_details=='customer') {
		$name=$_GET['name'];
		$start=strrpos($name,' ')+1;
		$end=strrpos($name, ')');
		$customer_id=substr($name,$start,$end-$start);
		$customer=getCustomers($customer_id);
		$analizes=getAnalizesByCus($customer_id); ?>
		<div class="mb-2">
			<span>
				<b>Tug'ilgan sana:</b> <?=date('j F Y',$customer['t_sana']);?>
			</span>
		    <span class="float-right">
		    	<b>Tashkilot:</b> <?=$customer['tashkilot'];?>
		    </span>
		</div>
		<table>
			<th>Analiz</th>
			<th>Narx</th>
			<th>Vaqt</th>
			<th>Natija</th>
			<?php $total_price=0;
			foreach($analizes as $analize){ 
				$total_price+=$analize['analiz_narx']; ?>
				<tr order_id="<?=$analize['id'];?>">
					<td><?=$analize['nom'];?></td>
					<td><?=$analize['analiz_narx'];?></td>
					<td><?=date('d.m.Y G:i',$analize['sana']);?></td>
					<td class="blank_result" customer_id="<?=$analize['mijoz_id'];?>" customer_dob="<?=date('Y',$customer['t_sana']);?>" customer_name="<?=$customer['ism'];?>">
						<?php if($analize['tolgan_vaqt']){
							echo date('d.m.Y G:i',$analize['tolgan_vaqt']);
							if($analize['result_condition']){
								echo($analize['result_condition']=='good' ? '<span class="text-success"> (Ijobiy)</span>' : '<span class="text-danger"> (Salbiy)</span>');
							} ?>
							<i class="fa fa-print"> </i>
						<?php }else{
							echo '*';
						} ?>
					</td>
				</tr>
			<?php } ?>
			<tr>
				<th style="">Jami</th>
				<th><?=$total_price;?></th>
				<th></th>
				<th></th>
			</tr>
		</table>
	<?php }
}
if(isset($_GET['json_archive_exported'])){
	// AJAX call when daily archive was exported to excel, and this will handle it
	$jsonArchiveDir='../blanka/json-arxiv';
	$exportedJsonsDir=$jsonArchiveDir.'/exported';
	if(!is_dir($exportedJsonsDir)){
		mkdir($exportedJsonsDir);
	}
	$jsonFiles=glob($jsonArchiveDir.'/*.json');
	foreach($jsonFiles as $file){
		$filename=basename($file);
		rename($file, $exportedJsonsDir.'/'.$filename);
	}
}
if(isset($_GET['region'])){
	$districts=getDistricts($_GET['region']);
	foreach($districts as $district){ ?>
		<option district_id="<?=$district['id'];?>"><?=$district['nom'];?></option>
	<?php }
}
if(isset($_GET['getServiceOptions'])){
	$services=getServicesByType($_GET['serviceType']);
	echo '<option disabled selected>Xizmat</option>';
	foreach($services as $service){ ?>
		<option service_id="<?=$service['id'];?>" value="<?=$service['id'];?>" price="<?=$service['price'];?>">
			<?=$service['name'];?>
			<span class="service-price"> - <?=$service['price'];?></span>
		</option>
	<?php }
}
if(isset($_GET['getDoctorOptions'])){
	$doctors=getDoctors($_GET['serviceType']);
	echo '<option disabled selected>Doktor tanlang</option>';
	foreach($doctors as $doctor){ ?>
		<option doctor_id="<?=$doctor['id'];?>" value="<?=$doctor['id'];?>" ><?=$doctor['ism'];?></option>
	<?php }
}
if(isset($_GET['getCustomerNames'])){
	if($_GET['getCustomerNames']){
		$key=$_GET['key'];
		$limit=$_GET['limit'];
		$customerNames=getCustomerNames($key, $limit);
		$names=[];
		foreach ($customerNames as $customerName) {
			//echo("<li customer_id=".$customerName['id'].">".$customerName['name']."  (ID: ".$customerName['id'].")</li>");
			$names[]=$customerName['name']."  (ID: ".$customerName['id'].")";
		}
		echo json_encode($names);
	}
}
if(isset($_GET['getOrganizationNames'])){
	if($_GET['getOrganizationNames']){
		$organizationNames=getOrganizationNames();
		echo json_encode($organizationNames);
	}
}
if(isset($_GET['tab_item'])){
	$tab_item=$_GET['tab_item'];
	if($tab_item=='customers'){
		$key=isset($_GET['key']) ? $_GET['key'] :"";
		$from=$_GET['from'] ? $_GET['from'] : strtotime('today');
		$till=$_GET['till'] ? $_GET['till'] : strtotime('tomorrow');
		$limit=($from && $till) ? 0 : 100;
		$customers=getCustomers(null, $limit, $key, $from, $till); ?>
		<div class="toolbar">
			<div class="d-inine-flex float-left">
				<div class="custom_time">
					<span id="from_time">
						<select class="custom_day" value="<?=date('j',$from); ?>" >
							<option>2</option>
						</select>
						<select class="custom_month" value="<?= date('n',$from); ?>" >
							<option month=1>Yanvar</option>
							<option month=2>Fevral</option>
							<option month=3>Mart</option>
							<option month=4>Aprel</option>
							<option month=5>May</option>
							<option month=6>Iyun</option>
							<option month=7>Iyul</option>
							<option month=8>Avgust</option>
							<option month=9>Sentabr</option>
							<option month=10>Oktabr</option>
							<option month=11>Noyabr</option>
							<option month=12>Dekabr</option>
						</select>
						<select class='custom_year' value="<?=date('Y',$from); ?>" >
							<option>2018</option>
							<option>2019</option>
							<option>2020</option>
						</select>
						dan
					</span>
					<span id="till_time">
						<select class="custom_day" value="<?=date('j',$till); ?>" >
						</select>
						<select class="custom_month" value="<?= date('n',$till); ?>" >
							<option month=1>Yanvar</option>
							<option month=2>Fevral</option>
							<option month=3>Mart</option>
							<option month=4>Aprel</option>
							<option month=5>May</option>
							<option month=6>Iyun</option>
							<option month=7>Iyul</option>
							<option month=8>Avgust</option>
							<option month=9>Sentabr</option>
							<option month=10>Oktabr</option>
							<option month=11>Noyabr</option>
							<option month=12>Dekabr</option>
						</select>
						<select class='custom_year' value="<?=date('Y',$till); ?>" >
							<option>2018</option>
						</select>
						gacha
					</span>
					<button id="filter-by-date" action="<?='filter';?>">
						<?=($from && $till) ? 'Filtrlash' : 'Filtrlash';?>
					</button>
				</div>
			</div>
			<input type="text" name="key" class="search-customer-key" placeholder="mijozni qidirish" value="<?=isset($_GET['key']) ? $_GET['key'] :""; ?>" />
			<button class="ui-button ui-widget ui-corner-all search-button">
			    <span class="ui-icon ui-icon-search"></span>
			</button>
		</div>
		<table class="table_customers">
			<th class="id_column">Id</th>
			<th>Ismi</th>
			<th>Tug'ilgan yili</th>
			<th>Tashkilot nomi</th>
			<th>Topshirgan sanasi</th>
			<th>Topshirgan analizlar</th>
			<th>Telefon</th>
			<th>Actions</th>
			<?php foreach($customers as $customer){ ?>
				<tr>
					<td><?=$customer['mijoz_id'];?></td>
					<td><?=$customer['ism'];?></td>
					<td><?=date("Y",$customer['t_sana']);?></td>
					<td><?=$customer['tashkilot'];?></td>
					<td><?=$customer['analiz_sana'];?></td>
					<td><?=$customer['analizlar_soni'];?></td>
					<td><?=$customer['telefon'];?></td>
					<td>
						<button class="change_item_button change_customer_dialog_link" 
						item="customer" item_id="<?=$customer['c_id'];?>">
							<i class="fa fa-pencil"></i>
						</button>
						<button  class="delete_item_button"
							item="analize_order" 
							tab_item='customers' 
							item_id="<?=$customer['c_id'];?>" 
							from = "<?= $from; ?>" 
							till = "<?= $till; ?>"
						>
							<i class="fa fa-close"></i>
						</button>
					</td>
				</tr>
			<?php } ?>
		</table>
		<div id="change_customer_dialog" title="Mijoz ma'lumotlari">
			<form id="change_customer_form" class="dialog_form">
				<label for="customer_name">
					Ismi:<input type="text" name="name" required="required" id="customer_name">
				</label>
				<label for="customer_dob">
					Tug'ilgan sanasi:<input type="text" name="price" required="required" id="customer_dob">
				</label>
				<label for="org_for_customer">
					Tashkilot:
					<input type="text" id="org_for_customer" placeholder="Tashkilot nomi">
					<ul id="organization_names_for_customer">	</ul>
				</label>
				<label for="customer_phone">
					Telefon:
					<input type="text" id="customer_phone">
				</label>
			</form>
		</div>
	<?php }elseif($tab_item=='staffs'){
		$staffs=getStaffs(); ?>
		<button class="add_item_button add_doctor_dialog_link">
			<i class="fa fa-plus-circle"></i> Doktor qo'shish
		</button>
		<table class="table_cart">
			<th>Ism</th>
			<th>Vazifa</th>
			<th>Mutaxassislik</th>
			<th>Actions</th>
			<?php foreach($staffs as $staff){ ?>
				<tr>
					<td><?=$staff['ism'];?></td>
					<td><?=$staff['rol'];?></td>
					<td service-type-id="<?=$staff['service_type'];?>"><?=$staff['speciality'];?></td>
					<td>
						<?php if($staff['rol']=='doktor'){ ?>
							<button class="change_item_button change_doctor_dialog_link" 
								item="doctor" item_id=<?=$staff['id'];?>>
								<i class="fa fa-pencil"></i>
							</button>
							<button  class="delete_item_button" 
								item="doctor" tab_item='staffs' item_id=<?=$staff['id'];?>>
								<i class="fa fa-close"></i>
							</button>
						<?php } ?>
					</td>
				</tr>
			<?php } ?>
		</table>
		<div id="add_doctor_dialog" title='Doktor'>
			<?php $serviceTypes=getserviceTypes();?>
			<form id="add_doctor_form" class="dialog_form">
				<label for="doctor_name">
					F.I.Sh: <input type="text" name="name" required="required" id="doctor_name">
				</label>
				<label for="service_types">
					Mutaxassislik: 
					<select id="service_types">
						<?php foreach($serviceTypes as $serviceType){ ?>
							<option type_id="<?=$serviceType['id'];?>"><?=$serviceType['name'];?></option>
						<?php } ?>
					</select>
				</label>
			</form>
		</div>
	<?php }elseif($tab_item=='organizations'){ ?>
		<button id="add_org_dialog_link" class="add_item_button">
			<i class="fa fa-plus-circle"></i> Tashkilot qo'shish
		</button>
		<?php $organizations=getOrganizations(); ?>
		<table class="table_cart">
			<th>Tashkilot</th>
			<th>Bonus (%)</th>
			<th>Mijozlar soni</th>
			<th>Actions</th>
			<?php foreach($organizations as $organization){ ?>
				<tr>
					<td><?=$organization['nom']; ?></td>
					<td><?=$organization['bonus']?$organization['bonus']:'0';?></td>
					<td><?=$organization['mijozlar'];?></td>
					<td>
						<button class="change_item_button change_org_dialog_link" 
						item="org" item_id=<?=$organization['id'];?>>
							<i class="fa fa-pencil"></i>
						</button>
						<button  class="delete_item_button" 
						item="org" tab_item='organizations' item_id=<?=$organization['id'];?>>
							<i class="fa fa-close"></i>
						</button>
					</td>
				</tr>
			<?php } ?>
		</table>

		<div id="add_org_dialog" title='Tashkilot'>
			<form id="add_org_form" class="dialog_form">
				<label for="org_name">
					Tashkilot nomi:<input type="text" name="name" required="required" id="org_name">
				</label>
				<label for="org_bonus">
					Bonus (%):<input type="text" required="required" id="org_bonus">
				</label>
			</form>
		</div>
	<?php }elseif ($tab_item=='analizes'){ ?>
		<button class="add_item_button add_analize_dialog_link">
			<i class="fa fa-plus-circle"></i> Analiz qo'shish
		</button>
		<button class="add_item_button add_analize_type_dialog_link">
			<i class="fa fa-plus-circle"></i> Analiz turi qo'shish
		</button>
		<?php $analize_types=getAnalizeTypes();
		foreach($analize_types as $analize_type){ ?>
			<h3 class="analize_type_name"><?php echo $analize_type['nom'];?></h3>
			<table class="table_cart" analize-type-id="<?=$analize_type['id'];?>">
				<th>Analiz</th>
				<th>Narx</th>
				<th>Xona</th>
				<th>Doktor</th>
				<th>Blanka</th>
				<th>Actions</th>
				<?php $analizes=getAnalizesByType($analize_type['id']);
				foreach ($analizes as $analize) { ?>
					<tr>
						<td><?php echo $analize['nom'];?></td>
						<td><?php echo $analize['narx'];?></td>
						<td room_id=<?=$analize['xona_id'] ? $analize['xona_id'] : 0; ?>><?=$analize['xona'];?></td>
						<td laborant_id=<?=$analize['laborant_id'] ? $analize['laborant_id'] : 0; ?>><?=$analize['laborant'];?></td>
						<td blank_id=<?=$analize['blanka_id']?$analize['blanka_id']:0;?>><?php echo $analize['blanka'];?></td>
						<td>
							<button class="change_item_button change_analize_dialog_link" 
							item="analize" item_id=<?=$analize['id'];?>>
								<i class="fa fa-pencil"></i>
							</button>
							<button  class="delete_item_button" 
							item="analize" tab_item='analizes' item_id=<?=$analize['id'];?>>
								<i class="fa fa-close"></i>
							</button>
						</td>
					</tr>
				<?php }?>
			</table>
		<?php } ?>
		<div id="add_analize_dialog" title='Analiz'>
			<?php $analizeTypes=getAnalizeTypes();?>
			<form id="add_analize_form" class="dialog_form">
				<label for="analize_name">
					Analiz nomi:<input type="text" name="name" required="required" id="analize_name">
				</label>
				<label for="analize_types">
					Analiz turi
					<select id="analize_types">
						<?php foreach($analizeTypes as $analizeType){ ?>
							<option type_id="<?=$analizeType['id'];?>"><?=$analizeType['nom'];?></option>
						<?php } ?>
					</select>
				</label>
				<label for="analize_price">
					Narxi:<input type="text" name="price" required="required" id="analize_price">
				</label>
				<label for="analize_rooms">
					Xona
					<select id="analize_rooms">
						<!-- <option room_id='0'>...</option> -->
						<?php
						$rooms=getAnalizeRooms();
						foreach ($rooms as $room) { ?>
							<option room_id="<?=$room['id'];?>"><?=$room['name'];?></option>
						<?php } ?>
					</select>
				</label>
				<label for="laborants">
					Laborant
					<select id="laborants">
						<?php
						$laborants=getLaborants();
						foreach ($laborants as $laborant) { ?>
							<option laborant_id="<?=$laborant['id'];?>"><?=$laborant['ism'];?></option>
						<?php } ?>
					</select>
				</label>
				<label for="analize_blanks">
					Blanka
					<select id="analize_blanks">
						<option blank_id='0'>...</option>
						<?php
						$blanks=getBlanks();
						foreach ($blanks as $blank) { ?>
							<option blank_id="<?=$blank['id'];?>"><?=$blank['nom'];?></option>
						<?php } ?>
					</select>
				</label>
			</form>
		</div>
		<div id="add_analize_type_dialog" title='Analiz turi'>
			<form id="add_analize_type_form" class="dialog_form">
				<label for="analize_name">
					Analiz turi:<input type="text" name="name" required="required" id="analize_type">
				</label>
			</form>
		</div>
	<?php }elseif($tab_item=='services'){ ?>
		<button class="add_item_button add_service_dialog_link">
			<i class="fa fa-plus-circle"></i> Qo'shish
		</button>
		<button class="add_item_button add_service_type_dialog_link">
			<i class="fa fa-plus-circle"></i> Mutaxassislik qo'shish
		</button>
		<?php $service_types=getServiceTypes();
		foreach($service_types as $service_type){ 
			$services = getServicesByType($service_type['id']);
			if(count($services)){ ?>
				<h3 class="analize_type_name"><?php echo $service_type['name'];?></h3>
				<table class="table_cart" service-type-id="<?=$service_type['id'];?>">
					<th>Xizmat</th>
					<th>Mutaxassislik</th>
					<th>Narx</th>
					<th>Actions</th>
					<?php foreach ($services as $service) { ?>
						<tr>
							<td><?php echo $service['name'];?></td>
							<td><?=$service['service_type'];?></td>
							<td><?php echo $service['price'];?></td>
							<td>
								<button class="change_item_button change_service_dialog_link" 
								item="service" item_id=<?=$service['id'];?>>
									<i class="fa fa-pencil"></i>
								</button>
								<button  class="delete_item_button" 
								item="service" tab_item='services' item_id=<?=$service['id'];?>>
									<i class="fa fa-close"></i>
								</button>
							</td>
						</tr>
					<?php }?>
				</table>
			<?php } ?>
		<?php } ?>
		<div id="add_service_dialog" title='Xizmat'>
			<?php $serviceTypes=getserviceTypes();?>
			<form id="add_service_form" class="dialog_form">
				<label for="service_name">
					Xizmat nomi:<input type="text" name="name" required="required" id="service_name">
				</label>
				<label for="service_types">
					Mutaxassislik
					<select id="service_types">
						<?php foreach($serviceTypes as $serviceType){ ?>
							<option type_id="<?=$serviceType['id'];?>"><?=$serviceType['name'];?></option>
						<?php } ?>
					</select>
				</label>
				<label for="analize_price">
					Narxi:<input type="text" name="price" required="required" id="service_price">
				</label>
			</form>
		</div>
		<div id="add_service_type_dialog" title="Mutaxassislik qo'shish">
			<form id="add_service_type_form" class="dialog_form">
				<label for="service_type">
					Mutaxassislik:<input type="text" name="name" required="required" id="service_type">
				</label>
			</form>
		</div>
	<?php }elseif ($tab_item=='districts') { ?>
		<button class="add_item_button add_district_dialog_link">
			<i class="fa fa-plus-circle"></i> Tuman qo'shish
		</button>
		<?php $regions=getRegions();
		foreach($regions as $region){ ?>
			<h3 class="region_name"><?php echo $region['nom'];?></h3>
			<table class="table_cart">
				<th>Tuman</th>
				<th>Actions</th>
				<?php $districts=getDistricts($region['id']);
				foreach ($districts as $district) { ?>
					<tr>
						<td><?php echo $district['nom'];?></td>
						<td>
							<button class="change_item_button change_district_dialog_link" 
							item="district" item_id=<?=$district['id'];?>>
								<i class="fa fa-pencil"></i>
							</button>
							<button  class="delete_item_button" 
							item="district" tab_item='districts' item_id=<?=$district['id'];?>>
								<i class="fa fa-close"></i>
							</button>
						</td>
					</tr>
				<?php }?>
			</table>
		<?php } ?>
		<div id="add_district_dialog" title='Tuman||Shahar'>
			<form id="add_district_form" class="dialog_form">
				<label for="district_name">
					Tuman nomi:<input type="text" name="name" required="required" id="district_name">
				</label>
				<label for="district_regions">
					Viloyat:
					<select id="district_regions">
						<?php foreach($regions as $region){ ?>
							<option region_id="<?=$region['id'];?>"><?=$region['nom'];?></option>
						<?php } ?>
					</select>
				</label>
			</form>
		</div>
	<?php }elseif($tab_item=='report'){ ?>
		<div class="report-top-bar d-flex">
			<div class="custom_time">
				<span id="from_time">
					<select class="custom_day">
						<option>2</option>
					</select>
					<select class="custom_month">
						<option month=1>Yanvar</option>
						<option month=2>Fevral</option>
						<option month=3>Mart</option>
						<option month=4>Aprel</option>
						<option month=5>May</option>
						<option month=6>Iyun</option>
						<option month=7>Iyul</option>
						<option month=8>Avgust</option>
						<option month=9>Sentabr</option>
						<option month=10>Oktabr</option>
						<option month=11>Noyabr</option>
						<option month=12>Dekabr</option>
					</select>
					<select class='custom_year'>
						<option>2018</option>
						<option>2019</option>
						<option>2020</option>
					</select>
					dan
				</span>
				<span id="till_time">
					<select class="custom_day">
					</select>
					<select class="custom_month">
						<option month=1>Yanvar</option>
						<option month=2>Fevral</option>
						<option month=3>Mart</option>
						<option month=4>Aprel</option>
						<option month=5>May</option>
						<option month=6>Iyun</option>
						<option month=7>Iyul</option>
						<option month=8>Avgust</option>
						<option month=9>Sentabr</option>
						<option month=10>Oktabr</option>
						<option month=11>Noyabr</option>
						<option month=12>Dekabr</option>
					</select>
					<select class='custom_year'>
						<option>2018</option>
					</select>
					gacha
				</span>
				<button id="show-report-button">Ko'rsatish</button>
			</div>
		</div>
		<div id="report_tabs">

		</div>
	<?php }elseif($tab_item=='products'){ ?>
		<button id="add_product_dialog_link" class="add_item_button">
			<i class="fa fa-plus-circle"></i> Tovar qo'shish
		</button>
		<?php $products=getProducts();?>
		<div class="main_table">
			<table class="table_cart">
				<th>Tovar nomi</th>
				<th>Miqdor</th>
				<th>Tannarxi</th>
				<th>Umumiy summa</th>
				<th>Actions</th>
				<?php $total_price=0;
				$total_quantity=0;
				$total_sum=0;
				foreach($products as $product){ 
					$total_sum+=$product['tannarx']*$product['miqdor'];
					$total_price+=$product['tannarx'];
					$total_quantity+=$product['miqdor']; ?>
					<tr>
						<td><?php echo $product['nom'];?></td>
						<td><?php echo $product['miqdor'];?></td>
						<td><?php echo $product['tannarx'];?></td>
						<td><?php echo $product['tannarx']*$product['miqdor'];?></td>
						<td>
							<button class="change_item_button change_product_dialog_link" 
							item="product" item_id=<?=$product['id'];?>>
								<i class="fa fa-pencil"></i>
							</button>
							<button  class="delete_item_button" 
							item="product" tab_item='products' item_id=<?=$product['id'];?>>
								<i class="fa fa-close"></i>
							</button>
						</td>
					</tr>
				<?php } ?>
				<tr>
					<th>Jami</th>
					<th><?=$total_quantity;?></th>
					<th><?=$total_price;?></th>
					<th><?=$total_sum;?></th>
					<th></th>
				</tr>
			</table>
		</div>
		<div id="add_product_dialog" title='Yangi mahsulot'>
			<form id="add_product_form" class="dialog_form">
				<label for="name">
					Mahsulot nomi:<input type="text" name="name" required="required" id="name">
				</label>
				<label for="price">
					Tannarxi:<input type="text" name="price" required="required" id="price">
				</label>
				<label for="quantity">
					Miqdor: <input type="text" name="quantity" id="quantity">
				</label>
			</form>
		</div>
	<?php }elseif($tab_item=='personal_page'){ ?>
		<div id="personal-page-tabs">
			<ul>
				<li><a href="#personal-page-tabs-1" class="a_admin">Kunlik arxiv</a></li>
			</ul>
			<div id="personal-page-tabs-1">
				<?php 
				$jsonFiles=glob('../blanka/json-arxiv/*.json');
				if(count($jsonFiles)){ ?>
					<table class="archive-table" id="archive-table">
						<thead>
							<tr class="">
								<th>Sana</th>
								<th>Mijoz</th>
								<th>Tug'. yil</th>
								<th>Natija</th>
							</tr>
						</thead>
						<?php 
						foreach($jsonFiles as $jsonFile){
							$fileContent=file_get_contents($jsonFile);
							$decodedFileContent=json_decode($fileContent);
							if($decodedFileContent){ ?>
								<tr>
									<td><?=$decodedFileContent->date;?></td>
									<td><?=$decodedFileContent->customerName;?></td>
									<td><?=$decodedFileContent->customerDob; ?></td>
									<td>
										<?php 
										if(count($decodedFileContent->results)){
											foreach($decodedFileContent->results as $result){
												echo '<b>'.$result->name.':</b> '.'<i>'.$result->value.'</i>; ';
											}
										}else{
											echo '-';
										} 
										?>
									</td>
								</tr>
							<?php }
						}
						?>
					</table>
					<div class="print-button-box">
						<button class="export-excel-button" filename="arxiv-<?=date('d.m.Y');?>">Excelga jo'natish</button>
						<button class="print-button">Print</button>
					</div>
				<?php }else{ ?>
					<h3>Barcha ma'lumotlar excelga olingan</h3>
				<?php } ?>
			</div>
		</div>
	<?php }
}
if(isset($_GET['year_and_month'])){
	echo date('t',$_GET['year_and_month']);
}
if(isset($_GET['blank'])){
	if($_GET['action']=='fill'){
		$blank_name=$_GET['blank'];
		$blank_file=fopen('../blanka/html/'.$blank_name.'.html','r');
		$blank_top_file=fopen('../blanka/blanka_top.html','r');
		$blank_content=fread($blank_file,filesize('../blanka/html/'.$blank_name.'.html'));
		$blank_top_content=fread($blank_top_file,filesize('../blanka/blanka_top.html'));
		$blank_content=$blank_top_content.'<div class="blank_main">'.$blank_content.'</div>';
		fclose($blank_file);
		$blank_content.='<span class="footer_date">Дата:<span class="value">'.date('d/m/Y').'</span></span><span class="footer_doctor_name">Врач-лаборант:<span class="value"></span></span>';

		$blank_content.='<div class="blank-result-condition">';
		$blank_content.='<label>Natija: </label>';
		$blank_content.='<label for="good">Ijobiy</label><input type="radio" name="blank-result-condition" id="good" value="good" checked>';
		$blank_content.='<label for="bad">Salbiy</label><input type="radio" name="blank-result-condition" id="bad" value="bad">';
		$blank_content.='</div>';
	}elseif($_GET['action']=='change'){
		$order_id=$_GET['order_id'];
		if(is_file('../blanka/arxiv/'.$order_id)){
			$blank_file=fopen('../blanka/arxiv/'.$order_id,'r');
			$blank_top_file=fopen('../blanka/blanka_top.html','r');
			$blank_content=fread($blank_file,filesize('../blanka/arxiv/'.$order_id));
			$blank_top_content=fread($blank_top_file,filesize('../blanka/blanka_top.html'));
			$blank_content=$blank_top_content.'<div class="blank_main">'.$blank_content.'</div>';
			fclose($blank_file);
		}else{
			$blank_name=$_GET['blank'];
			$blank_file=fopen('../blanka/html/'.$blank_name.'.html','r');
			$blank_top_file=fopen('../blanka/blanka_top.html','r');
			$blank_content=fread($blank_file,filesize('../blanka/html/'.$blank_name.'.html'));
			$blank_top_content=fread($blank_top_file,filesize('../blanka/blanka_top.html'));
			$blank_content=$blank_top_content.'<div class="blank_main">'.$blank_content.'</div>';
			fclose($blank_file);
			$blank_content.='<span class="footer_date">Дата:<span class="value"></span></span><span class="footer_doctor_name">Врач-лаборант:<span class="value"></span></span>';
		}

		$blank_content.='<div class="blank-result-condition">';
		$blank_content.='<label>Natija: </label>';
		$blank_content.='<label for="good">Ijobiy</label><input type="radio" name="blank-result-condition" id="good" value="good" checked>';
		$blank_content.='<label for="bad">Salbiy</label><input type="radio" name="blank-result-condition" id="bad" value="bad">';
		$blank_content.='</div>';
	}elseif($_GET['action']=='see'){
		$order_id=$_GET['order_id'];
		if(is_file('../blanka/arxiv/'.$order_id)){
			$blank_file=fopen('../blanka/arxiv/'.$order_id,'r');
			$blank_top_file=fopen('../blanka/blanka_top.html','r');
			$blank_content=fread($blank_file,filesize('../blanka/arxiv/'.$order_id));
			$blank_top_content=fread($blank_top_file,filesize('../blanka/blanka_top.html'));
			$blank_content=$blank_top_content.'<div class="blank_main">'.$blank_content.'</div>';
			fclose($blank_file);
		}else{
			$blank_name=$_GET['blank'];
			$blank_file=fopen('../blanka/html/'.$blank_name.'.html','r');
			$blank_top_file=fopen('../blanka/blanka_top.html','r');
			$blank_content=fread($blank_file,filesize('../blanka/html/'.$blank_name.'.html'));
			$blank_top_content=fread($blank_top_file,filesize('../blanka/blanka_top.html'));
			$blank_content=$blank_top_content.'<div class="blank_main">'.$blank_content.'</div>';
			fclose($blank_file);
			$blank_content.='<span class="footer_date">Дата:<span class="value">'.date('d/m/Y').'</span></span><span class="footer_doctor_name">Врач-лаборант:<span class="value"></span></span>';
		}
	}
	if($blank_content){
		echo $blank_content;
	}else{
		echo 'xato';
	}
}
if(isset($_GET['registrator_analize_results'])){ 
	?>
	<table>
		<tr>
			<th>ID</th>
			<th>Registratsiya</th>
			<th>Ism</th>
			<th>Tug'. y.</th>
			<th>Analiz</th>
			<th>Blanka</th>
			<th>To'ldirildi</th>
			<th>O'zgartirildi</th>
		</tr>
		<?php 
		if(isset($_COOKIE['userid']) && $_COOKIE['userid']){
			$orders=getOrdersForRegistrator();
			foreach($orders as $order){ ?>
				<tr order_id="<?=$order['id'];?>">
					<td class="customer_id"><?=$order['mijoz_id'];?></td>
					<td><?=date('j F G:i',$order['sana']);?></td>
					<td class="customer_name"><?=$order['ism'];?></td>
					<td class="customer_dob"><?=date('Y',$order['t_sana']);?></td>
					<td><?=$order['analiz'];?></td>
					<td class="blank"><?=$order['blanka'];?></td>
					<td class="filled_time"><?=$order['tolgan_vaqt']?date('j F G:i',$order['tolgan_vaqt']):'';?></td>
					<td class="changed_time"><?=$order['ozgargan_vaqt']?date('j F G:i',$order['ozgargan_vaqt']):'';?></td>
				</tr>
			<?php }
		} ?>
	</table>
	<?php 
}
?>
