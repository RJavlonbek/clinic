<?php require(SYSBASE."common/header.php");?>
<script type="text/javascript" src="<?php echo DOCBASE; ?>script.js"></script>
<div class="registrator_main">
	<div class="registrator_top_text">
		<input name="current_date" class="current_date" size="10" value="<?=date('d-m-Y');?>">
		Registratsiya
	</div>

	<div id="search_customer_dialog" title="Mijozlardan izlash">
		<form class="dialog_form">
			<label for="search_customer_name">
				F.I.Sh: <input type="text" id="search_customer_name" />
			</label>
		</form>
		<ul id="customer_names">

		</ul>
		<ol class="customer_details">

		</ol>
	</div>
	<div class="report_details" id="customer_report_details" title="">	</div>

	<div id="registrator_settings_dialog" title="Parolni o'zgartirish">
		<form id="registrator_change_password_form" class="dialog_form">
			<label for="registrator_old_password">
				Eski parol: <input type="password" id="registrator_old_password" />
			</label>
			<label for="registrator_new_password">
				Yangi parol: <input type="password" id="registrator_new_password" />
			</label>
		</form>
	</div>

	<div id="registrator_analize_results_dialog" title="Analiz natijalari">
		<div class="registrator_analize_results_dialog_body">
			
		</div>
	</div>

	<div id="controlgroup">
		<div id="registrator_top">
			<div class="name_and_dob">
				<label for="name">
					<span class="text_form">F . I . Sh : </span>
					<input type="text" placeholder="" class="text_input_for_registration" id="customer_name">
				</label>
				<label for="d_o_b">
					<span class="text_form">Tug'ilgan sanasi : </span>
					<input name="d_o_b" id="datepicker" class="text_input_for_datapicker">
				</label>
				<input type="text" id="customer_phone" placeholder="Telefon raqami">
			</div>
			<div class="address_form">
				<select name="region" class="forregion" id="regions">
					<?php $regions=getRegions();
					foreach($regions as $region){ ?>
						<option region_id="<?=$region['id'];?>"><?=$region['nom'];?></option>
					<?php } ?>
				</select>
				<select name="district" id="districts">
					<?php $districts=getDistricts();
					foreach($districts as $district){ ?>
						<option district_id="<?=$district['id'];?>"><?=$district['nom'];?></option>
					<?php } ?>
				</select>
				<input type="text" id="organization" placeholder="Tashkilot nomi">
			</div>
		</div> <!-- end top -->
		<div id="analizes_list" class="registrator2-services-list">
			<div class="prices_form"> <!-- appears when one or more analizes are chosen -->
				<select name="serviceType" class="forregion" id="serviceTypes" data-placeholder="mutaxassislik">
					<option disabled selected>Mutaxassislik tanlang</option>
					<?php $serviceTypes=getServiceTypes();
					foreach($serviceTypes as $serviceType){ ?>
						<option service-type-id="<?=$serviceType['id'];?>" value="<?=$serviceType['id'];?>" ><?=$serviceType['name'];?></option>
					<?php } ?>
				</select>
				<div class="after-service-type">
					<select name="doctor" id="doctors">

					</select>
					<select name="service" id="services">
						
					</select>
				</div>
				<div class="chosen_analizes">	</div>
				<span class="total_price_form">	Umumiy narx : 0</span>
				<span class="time_for_registrator"><?=date('j/n/Y G:i');?></span>
				<span class="registrator2_bottom">
					<button class="save_button">Saqlash</button>
				</span>
			</div>
		</div>
	</div>	
</div>
<div class="content-for-print">
	<div class="top">
		<p class="surname"></p>
		<p class="name"></p>
		<p class="d-o-b"></p>
	</div>
	<div class="bottom">
		<p class="sub_surname"></p>
		<p class="sub_name"></p>
		<p class="sub_analizes"></p>
	</div>
</div> 
</body>
</html>