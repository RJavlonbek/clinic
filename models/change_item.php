<?php 
require("../common/define.php");
//global $db;

if(isset($_POST['item'])){
	if($_POST['item']=='product'){
		$name=$db->quote($_POST['name']);
		$price=$db->quote($_POST['price']);
		$quantity=(int)($_POST['quantity']) ? $db->quote((int)($_POST['quantity'])):0;
		$sql="UPDATE `tovarlar` SET nom=".$name.", miqdor=".$quantity.", tannarx=".$price." WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "Successfully changed";
		}
	}elseif($_POST['item']=='customer'){
		$name=$db->quote($_POST['name']);
		$dob=$db->quote(strtotime($_POST['dob']));
		$phone=$db->quote($_POST['phone']);
		$org_name=$db->quote($_POST['org']);
		$org_id=$db->query("SELECT id FROM tashkilotlar WHERE nom LIKE $org_name");
		$org_id=$org_id->fetchAll(PDO::FETCH_ASSOC);
		$org_id=count($org_id)==1?$org_id[0]['id']:0;
		if($org_id){
			$sql="UPDATE `mijozlar` SET ism=$name, t_sana=$dob, tashkilot_id=$org_id,telefon=$phone WHERE id=".$_POST['item_id'];
			$db->query($sql);
			echo 'saved';
		}else{
			echo "org_error";
		}
	}elseif($_POST['item']=='org'){
		$name=$db->quote($_POST['name']);
		$bonus=$db->quote($_POST['bonus']);
		$sql="UPDATE `tashkilotlar` SET nom=$name,bonus=$bonus WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "Successfully changed";
		}
	}elseif($_POST['item']=='analize'){
		$item_id=$db->quote($_POST['item_id']);
		$name=$db->quote($_POST['name']);
		$type_id=$db->quote($_POST['type']);
		$price=$db->quote($_POST['price']);
		$blank_id=$db->quote($_POST['blank']);
		$room_id=$db->quote($_POST['room']);
		$laborant_id=$db->quote($_POST['laborant']);
		$sql="UPDATE `analizlar` SET nom=$name, tur_id=$type_id, narx=$price, blanka_id=$blank_id, xona_id=$room_id, laborant_id=$laborant_id WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "Successfully changed";
		}
	}elseif($_POST['item']=='service'){
		$item_id=$db->quote($_POST['item_id']);
		$name=$db->quote($_POST['name']);
		$serviceType=$db->quote($_POST['type']);
		$price=$db->quote($_POST['price']);

		$sql="UPDATE `services` SET name=$name, service_type=$serviceType, price=$price WHERE id=$item_id";
		$result=$db->query($sql);
		if($result){
			echo "successfully updated";
		}
	}elseif($_POST['item']=='doctor'){
		$item_id=$db->quote($_POST['item_id']);
		$name=$db->quote($_POST['name']);
		$serviceType=$db->quote($_POST['serviceType']);

		$sql="UPDATE `xodimlar` SET ism=$name, service_type=$serviceType WHERE rol='doktor' AND id=$item_id";
		$result=$db->query($sql);
		if($result){
			echo "successfully updated";
		}
	}elseif($_POST['item']=='district'){
		$name=$db->quote($_POST['name']);
		$region_id=$db->quote($_POST['region']);
		$sql="UPDATE `tumanlar` SET nom=".$name.",viloyat_id=".$region_id." WHERE id=".$_POST['item_id'];
		$result=$db->query($sql);
		if($result){
			echo "Successfully changed";
		}
	}elseif($_POST['item']=='staff'){
		if(isset($_POST['old_password'])){
			if(isset($_POST['role'])){
				$role=$db->quote($_POST['role']);
				$id = $_POST['id'] ? $db->quote($_POST['id']) : "";
				$old_password=$db->quote($_POST['old_password']);
				$new_password=$db->quote($_POST['new_password']);

				$sql="SELECT parol FROM xodimlar WHERE rol=$role";
				
				if($id) {
					$sql = $sql . " AND id=$id";
				}
				
				$password=$db->query($sql);
				$password=$password->fetchAll(PDO::FETCH_ASSOC);
				$status=0;
				foreach($password as $p){
					if("'".$p['parol']."'"==$old_password){
						$status=1;
					}
				}
				if($status){
					$sql="UPDATE xodimlar SET parol=$new_password WHERE rol=$role";
					if($id) {
						$sql = $sql . " AND id=$id";
					}
					$result=$db->query($sql);
				}
				echo $status;
			}
		}
	}
}