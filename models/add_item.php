<?php 
require("../common/define.php");
//global $db;
if(isset($_POST['item'])){
	if($_POST['item']=='product'){
		$name=$db->quote($_POST['name']);
		$price=$db->quote($_POST['price']);
		$quantity=(int)($_POST['quantity']) ? $db->quote((int)($_POST['quantity'])):0;
		$sql="INSERT INTO `tovarlar` (nom,tannarx,miqdor) VALUES ($name,$price,$quantity)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='org'){
		$name=$db->quote($_POST['name']);
		$bonus=$db->quote($_POST['bonus']);
		$sql="INSERT INTO `tashkilotlar` (nom,bonus) VALUES ($name,$bonus)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='analize'){
		$name=$db->quote($_POST['name']);
		$type_id=$db->quote($_POST['type']);
		$price=$db->quote($_POST['price']);
		$blank_id=$db->quote($_POST['blank']);
		$room_id=$db->quote($_POST['room']);
		$laborant_id=$db->quote($_POST['laborant']);
		$sql="INSERT INTO `analizlar` (nom,narx,tur_id,blanka_id,xona_id,laborant_id) VALUES ($name,$price,$type_id,$blank_id,$room_id,$laborant_id)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='analize_type'){
		$name=$db->quote($_POST['name']);
		$sql="INSERT INTO `analiz_turlar` (nom) VALUES ($name)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='service'){
		$name=$db->quote($_POST['name']);
		$serviceType=$db->quote($_POST['type']);
		$price=$db->quote($_POST['price']);

		$sql="INSERT INTO `services` (name, service_type, price) VALUES ($name, $serviceType, $price)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='service_type'){
		$name=$db->quote($_POST['name']);
		$sql="INSERT INTO `service_types` (name) VALUES ($name)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='doctor'){
		$name=$db->quote($_POST['name']);
		$serviceType=$db->quote($_POST['serviceType']);

		$sql="INSERT INTO `xodimlar` (ism, rol, service_type) VALUES ($name, 'doktor', $serviceType)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='customer'){
		//customer data
		$customer_id=$_POST['id'];
		$name=$db->quote($_POST['name']);
		$dob = $db->quote(strtotime(implode('-', array_reverse(explode('-', $_POST['dob'])))));
		$region=$db->quote($_POST['region']);
		$district=$db->quote($_POST['district']);
		$phone=$db->quote($_POST['phone']);
		$get_result_method=isset($_POST['getResultMethod']) ? $db->quote($_POST['getResultMethod']) : '';
		$org_name=$db->quote($_POST['org']);
		$org_id=$db->query("SELECT id FROM tashkilotlar WHERE nom LIKE $org_name");
		$org_id=$org_id->fetchAll(PDO::FETCH_ASSOC);
		$org_id=count($org_id)==1?$org_id[0]['id']:0;
		$time=strtotime($_POST['time']);
		$time=$db->quote(mktime((int)date('H'),(int)date('i'),0,(int)date('m',$time),(int)date('d',$time),(int)date('Y',$time)));
		if($org_id){
			if(!$customer_id){
				$sql="INSERT INTO `mijozlar` (ism,t_sana,viloyat_id,tuman_id,tashkilot_id,telefon, get_result) VALUES ($name,$dob,$region,$district,$org_id,$phone, $get_result_method)";
				$result=$db->query($sql);
				if($result){
					$sql="SELECT id FROM `mijozlar`";
					$query=$db->query($sql);
					$data=$query->fetchAll(PDO::FETCH_ASSOC);
					$customer_id=$data[count($data)-1];
					$customer_id=$customer_id['id'];
				}
				$sql="UPDATE tashkilotlar SET mijozlar=mijozlar+1 WHERE id=$org_id";
				$db->query($sql);
			}else{
				$sql="INSERT INTO tashriflar (mijoz_id,sana) VALUES (".$customer_id.",$time)";
				$db->query($sql);
				$sql="UPDATE `mijozlar` SET t_sana=$dob,viloyat_id=$region,tuman_id=$district,telefon=$phone, get_result=$get_result_method WHERE id=".$customer_id;
				$db->query($sql);
			}

			//customer orders
			if(isset($_POST['orders']) && count($_POST['orders'])){
				for($i=0;$i<count($_POST['orders']);$i++){
					$analize_id=$db->quote($_POST['orders'][$i][0]);
					$analize_price=$db->quote($_POST['orders'][$i][1]);
					$sql="INSERT INTO `analiz_buyurtmalar` (
						mijoz_id,
						analiz_id, 
						tashkilot_id, 
						analiz_narx,
						sana,
						tolgan_vaqt,
						ozgargan_vaqt,
						tolandi,
						get_result_method
					) VALUES (".$customer_id.", $analize_id, $org_id, $analize_price, $time, 0, 0, 0, $get_result_method)";
					$db->query($sql);
				}
				echo 'saved';
			}elseif(isset($_POST['service']) && isset($_POST['serviceType'])){
				$service_id = $db->quote($_POST['service']);
				$doctor_id = $db->quote($_POST['doctor']);
				$price = $db->quote($_POST['price']);

				$sql = "INSERT INTO service_orders (customer_id, service_id, organization_id, price, doctor_id, time) VALUES (".$customer_id.", $service_id, $org_id, $price, $doctor_id, $time)";
				$db->query($sql);
				echo 'saved';
			}else{
				echo 'error';
			}
			
			
		}else{
			echo "org_error";
		}	
	}elseif($_POST['item']=='district'){
		$name=$db->quote($_POST['name']);
		$region_id=$db->quote($_POST['region']);
		$sql="INSERT INTO `tumanlar` (nom,viloyat_id) VALUES ($name,$region_id)";
		$result=$db->query($sql);
		if($result){
			echo "successfully added";
		}
	}elseif($_POST['item']=='blank'){
		$order_id=$_POST['order_id'];
		$blankResultCondition=$db->quote($_POST['blankResultCondition']);
		$content=$_POST['content'];
		$sql="SELECT mijoz_id,analiz_id,blanka_id,sana FROM analiz_buyurtmalar JOIN analizlar ON analiz_buyurtmalar.analiz_id=analizlar.id WHERE analiz_buyurtmalar.id=".$order_id;
		$d=$db->query($sql);
		$d=$d->fetchAll(PDO::FETCH_ASSOC);
		$from=$d[0]['sana']-24*3600;
		$till=$d[0]['sana']+24*3600;
		if($d[0]['blanka_id']){
			$sql="SELECT analiz_buyurtmalar.id FROM analiz_buyurtmalar 
				JOIN analizlar ON analiz_buyurtmalar.analiz_id=analizlar.id 
				WHERE analiz_buyurtmalar.mijoz_id=".$d[0]['mijoz_id']." 
				AND analizlar.blanka_id=".$d[0]['blanka_id']." 
				AND (analiz_buyurtmalar.sana BETWEEN ".$from." AND ".$till.");";
			$order_ids=$db->query($sql);
			$order_ids=$order_ids->fetchAll(PDO::FETCH_ASSOC);
			foreach($order_ids as $order){
				$order_id=$order['id'];

				// saving html data
				if(is_dir('../blanka/arxiv')){
					file_put_contents('../blanka/arxiv/'.$order_id,$content);
				}else{
					mkdir('../blanka/arxiv');
					file_put_contents('../blanka/arxiv/'.$order_id,$content);
				}

				// saving json data
				if(isset($_POST['json'])){
					$json=$_POST['json'];
					if(!is_dir('../blanka/json-arxiv')){
						mkdir('../blanka/json-arxiv');	
					}
					file_put_contents('../blanka/json-arxiv/'.$order_id.'.json', $json);
				}


				if($_POST['action']=='fill'){
					$sql="UPDATE analiz_buyurtmalar SET result_condition=$blankResultCondition, tolgan_vaqt=".strtotime('now')." WHERE id=".$order_id;
				}elseif($_POST['action']=='change'){
					$sql="UPDATE analiz_buyurtmalar SET result_condition=$blankResultCondition, ozgargan_vaqt=".strtotime('now')." WHERE id=".$order_id;
				}
				if($sql){
					$db->query($sql);
				}
			}
		}
	}
}