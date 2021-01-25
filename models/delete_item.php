<?php 
require("../common/define.php");
//global $db;
if(isset($_POST['item'])){
	if($_POST['item']=='product'){
		$sql="DELETE FROM `tovarlar` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}elseif($_POST['item']=='customer'){
		$sql="DELETE FROM `mijozlar` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
		$sql="DELETE FROM analiz_buyurtmalar WHERE mijoz_id=".$_POST['item_id'];
		$db->query($sql);
		$sql="DELETE FROM tashriflar WHERE mijoz_id=".$_POST['item_id'];
		$db->query($sql);
	}elseif($_POST['item']=='analize_order'){
		if($_POST['from'] && $_POST['till']){
			$customerId = $db->quote($_POST['item_id']);
			$from = $db->quote($_POST['from']);
			$till = $db->quote($_POST['till']);
			$sql="DELETE FROM analiz_buyurtmalar 
				WHERE mijoz_id=$customerId AND (sana BETWEEN $from AND $till)";
			$db->query($sql);
		}
	}elseif($_POST['item']=='org'){
		$sql="DELETE FROM `tashkilotlar` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}elseif($_POST['item']=='analize'){
		$sql="DELETE FROM `analizlar` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}elseif($_POST['item']=='service'){
		$sql="DELETE FROM `services` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}elseif($_POST['item']=='doctor'){
		$sql="DELETE FROM `xodimlar` WHERE rol='doktor' AND id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}elseif($_POST['item']=='district'){
		$sql="DELETE FROM `tumanlar` WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "successfully deleted";
		}
	}
}