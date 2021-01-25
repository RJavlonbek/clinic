<?php include(SYSBASE."common/header.php"); ?>
<style type="text/css">
	@media print {
		body{
			margin: 0;
			font-size: 14px;
		}
		#Header, #Footer { display: none !important; }
		#blank_dialog{
			background: #fff;
			border: 0;
		}
	}
	@page {
	    margin: 0.6cm;
	}
</style>
<script type="text/javascript" src="<?php echo DOCBASE; ?>doctor_script.js"></script>
<body>
	<div class="doctor_top_text">Laborant</div>
<div class="doctor_main">
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
			$orders=getOrders($_COOKIE['userid']);
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
</div>
</body>