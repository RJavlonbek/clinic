<?php include(SYSBASE."common/header.php"); ?>
<script type="text/javascript" src="<?php echo DOCBASE; ?>script.js"></script>
<style type="text/css">
	@media print {
		body{
			margin: 0;
			font-size: 14px;
		}
		#Header, #Footer { display: none !important; }
	}
	@page {
	    /*size: 86mm 55mm;*/
	    margin: 0.6cm;
	}
</style>
<body>
	<div class="administrator_top_text">
		Administrator
		<button class="administrator_settings_button administrator_settings_dialog_link">
			<i class="fa fa-lock"></i>
		</button>
	</div>
	<div id="administrator_settings_dialog" title="Parolni o'zgartirish">
		<form id="administrator_change_password_form" class="dialog_form">
			<label for="administrator_old_password">
				Eski parol: <input type="password" id="administrator_old_password" />
			</label>
			<label for="administrator_new_password">
				Yangi parol: <input type="password" id="administrator_new_password" />
			</label>
		</form>
	</div>
	<div id="tabs">
		<ul>
			<li class="administrator_tab_item" tab_item='products'><a href="#tabs-1">Savatcha</a></li>
			<li class="administrator_tab_item" tab_item='customers'><a href="#tabs-2">Mijozlar</a></li>
			<li class="administrator_tab_item" tab_item='staffs'><a href="#tabs-3">Xodimlar</a></li>
			<li class="administrator_tab_item" tab_item='organizations'><a href="#tabs-4">Tashkilotlar</a></li>
			<li class="administrator_tab_item" tab_item='analizes'><a href="#tabs-5">Analizlar</a></li>
			<li class="administrator_tab_item" tab_item='services'><a href="#tabs-6">Xizmatlar</a></li>
			<li class="administrator_tab_item" tab_item='districts'><a href="#tabs-7">Tumanlar</a></li>
			<li class="administrator_tab_item" tab_item='report'><a href="#tabs-8">Hisobot</a></li>
			<li class="administrator_tab_item" tab_item='personal_page'>
				<a href="#tabs-9">Shaxsiy sahifa</a>
			</li>
		</ul>
		<div id="tabs-1">
		</div>
		<div id="tabs-2">
		</div>
		<div id="tabs-3">
		</div>
		<div id="tabs-4">
		</div>
		<div id="tabs-5">
		</div>
		<div id="tabs-6">
		</div>
		<div id="tabs-7">
		</div>
		<div id="tabs-8">
		</div>
		<div id="tabs-9">
		</div>
	</div>
</body>
</html>