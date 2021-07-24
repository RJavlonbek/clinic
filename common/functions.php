<?php
function logIn($name,$password){
	global $db;
	$sql="SELECT id,parol,login,rol FROM xodimlar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	$activeUser=false;
	foreach ($data as $user) {
		if($user['login']==$name && $user['parol']==$password){
			$activeUser=$user;
		}
	}
	return $activeUser;
}

function getActiveUser(){
	global $db;
	if(!isset($_COOKIE["userid"])){
		return false;
	}
	$user_id = $_COOKIE["userid"];
	$user = $db->query("SELECT * FROM xodimlar WHERE id=$user_id");
	$user=$user->fetchAll(PDO::FETCH_ASSOC);
	if(!count($user)){
		return false;
	}
	return $user[0];
}


//     	SAVATCHA 
function getProducts(){
	global $db;
	$sql="SELECT * FROM tovarlar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}


//   MIJOZLAR
function getCustomers($customer_id=0, $limit=0, $key='', $from=0, $till=0, $registrator="all"){
	global $db;
	//$limit=$db->quote($limit);
	if($customer_id){
		$sql="SELECT *,COUNT(analiz_buyurtmalar.mijoz_id) AS a_s,mijozlar.id AS c_id, tashkilotlar.nom as tashkilot, analiz_buyurtmalar.id as a_ad
			FROM mijozlar INNER JOIN analiz_buyurtmalar ON mijozlar.id=analiz_buyurtmalar.mijoz_id 
			JOIN tashkilotlar ON mijozlar.tashkilot_id=tashkilotlar.id
			WHERE mijozlar.id=$customer_id 
			GROUP BY mijozlar.id ORDER BY analiz_buyurtmalar.sana DESC";
	}else{

		$sql="SELECT *,COUNT(analiz_buyurtmalar.mijoz_id) AS analizlar_soni,mijozlar.id AS c_id, tashkilotlar.nom as tashkilot
				FROM mijozlar 
				INNER JOIN analiz_buyurtmalar ON mijozlar.id=analiz_buyurtmalar.mijoz_id
				JOIN tashkilotlar ON tashkilotlar.id = analiz_buyurtmalar.tashkilot_id
				WHERE (mijozlar.ism LIKE '%$key%' OR tashkilotlar.nom LIKE '%$key%' OR mijozlar.id LIKE '%$key%') ";
		
		if($from && $till){
			$sql.="AND analiz_buyurtmalar.sana BETWEEN $from AND $till ";
		}

		if($registrator && $registrator != "all"){
			$sql = $sql . " AND analiz_buyurtmalar.user_id=$registrator";
		}

		$sql.=" GROUP BY analiz_buyurtmalar.mijoz_id ORDER BY analiz_buyurtmalar.sana DESC ";
		
		if($limit){
			$sql.="LIMIT $limit ";
		}
	}
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	for($i=0;$i<count($data);$i++) {
		// $sql="SELECT * FROM tashkilotlar WHERE id=".$data[$i]['tashkilot_id'];
		// $query=$db->query($sql);
		// $org=$query->fetch(PDO::FETCH_ASSOC);
		// $data[$i]+=array('tashkilot'=>$org['nom']);
		// $data[$i]+=array('analizlar_soni'=>$data[$i]['a_s']);
		$data[$i]+=array('analiz_sana'=>date('d F Y',$data[$i]['sana']));
	}
	//print_r($data);
	if($customer_id){
		return $data[0];
	}else{
		return $data;
	}
}
function getCustomerNames($key='', $limit=0){
	global $db;
	$sql="SELECT ism,id FROM mijozlar WHERE ism LIKE '%$key%' OR id LIKE '%$key%' ORDER BY id DESC LIMIT $limit";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	$customer_names=array();
	foreach ($data as $customer) {
		$customer_names[]=array('name'=>$customer['ism'],'id'=>$customer['id']);
	}
	return $customer_names;
}
function getCustomersByOrg($org_id,$from=0,$till=0){
	global $db;
	$sql="SELECT * FROM mijozlar 
		JOIN analiz_buyurtmalar ON mijozlar.id=analiz_buyurtmalar.mijoz_id 
		WHERE analiz_buyurtmalar.tashkilot_id=$org_id 
		AND (analiz_buyurtmalar.sana BETWEEN $from AND $till) 
		GROUP BY mijozlar.id";

	$sql = "SELECT *, mijozlar.ism, analizlar.nom
		FROM analiz_buyurtmalar
		JOIN mijozlar ON mijozlar.id = analiz_buyurtmalar.mijoz_id
		JOIN analizlar ON analizlar.id = analiz_buyurtmalar.analiz_id
		WHERE analiz_buyurtmalar.tashkilot_id=$org_id 
		AND (analiz_buyurtmalar.sana BETWEEN $from AND $till)";

	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);

	// for($i=0; $i < count($data); $i++){
	// 	$customer_id=$data[$i]['mijoz_id'];
	// 	$sql="SELECT *, analizlar.nom 
	// 		FROM analiz_buyurtmalar 
	// 		JOIN analizlar ON analiz_buyurtmalar.analiz_id = analizlar.id 
	// 		WHERE mijoz_id = $customer_id AND (sana BETWEEN $from AND $till) AND analiz_buyurtmalar";
	// 	$orders=$db->query($sql);
	// 	$orders=$orders->fetchAll(PDO::FETCH_ASSOC);

	// 	$data[$i]+=array('buyurtmalar'=>$orders);
	// }

	return $data;
}

//   ANALIZLAR 
function getAnalizeTypes(){
	global $db;
	$sql="SELECT * FROM analiz_turlar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
} 
function getAnalizes($time='all',$from=0,$till=0,$key='',$type_id=0, $registrator = 'all'){
	global $db;
	$t=0;
	if($time=='custom_time'){
		$sql="SELECT *,COUNT(DISTINCT analiz_buyurtmalar.mijoz_id) AS num_customers,SUM(analiz_buyurtmalar.analiz_narx) AS sum_price 
		FROM analizlar JOIN analiz_buyurtmalar ON analizlar.id=analiz_buyurtmalar.analiz_id 
		WHERE analiz_buyurtmalar.sana BETWEEN $from AND $till 
		GROUP BY analizlar.nom 
		ORDER BY analiz_buyurtmalar.sana";

		if($type_id){
			$sql="SELECT *, analizlar.nom as nom, COUNT(DISTINCT analiz_buyurtmalar.mijoz_id) AS num_customers,SUM(analiz_buyurtmalar.analiz_narx) AS sum_price 
				FROM analizlar JOIN analiz_buyurtmalar ON analizlar.id=analiz_buyurtmalar.analiz_id 
				JOIN tashkilotlar ON tashkilotlar.id = analiz_buyurtmalar.tashkilot_id
				WHERE (analizlar.tur_id=$type_id) AND (analiz_buyurtmalar.sana BETWEEN $from AND $till)";

			if($registrator && $registrator != "all"){
				$sql = $sql . " AND analiz_buyurtmalar.user_id=$registrator";
			}

			$sql = $sql . " GROUP BY analizlar.nom ORDER BY analiz_buyurtmalar.sana";
		}
	}else{
		$sql="SELECT * FROM analizlar WHERE nom LIKE '%$key%'";
	}
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getAnalizesByType($type_id){
	global $db;
	$sql="SELECT *,blankalar.nom AS blanka,analizlar.nom AS nom,analizlar.id AS id,analiz_xonalar.name as xona,xodimlar.ism as laborant FROM analizlar LEFT JOIN blankalar ON analizlar.blanka_id=blankalar.id LEFT JOIN analiz_xonalar ON analizlar.xona_id=analiz_xonalar.id LEFT JOIN xodimlar ON analizlar.laborant_id=xodimlar.id WHERE tur_id=".$type_id;
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getAnalizesByCus($customer_id=0,$from=0,$till=0){
	global $db;
	if($customer_id){
		if($from&&$till){
			$sql="SELECT * FROM analizlar JOIN analiz_buyurtmalar ON analizlar.id=analiz_buyurtmalar.analiz_id WHERE analiz_buyurtmalar.mijoz_id=$customer_id";
		}else{
			$sql="SELECT *,analiz_buyurtmalar.id AS id FROM analizlar JOIN analiz_buyurtmalar ON analizlar.id=analiz_buyurtmalar.analiz_id WHERE analiz_buyurtmalar.mijoz_id=$customer_id ORDER BY analiz_buyurtmalar.sana DESC";
		}
	}
	$data=$db->query($sql);
	$data=$data->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getAnalizeRooms(){
	global $db;
	$sql="SELECT * FROM analiz_xonalar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}

// ANAILIZ BUYURTMALAR  
function getOrders($laborantId){
	global $db;
	$timeToShowFilledBlanks=strtotime('now')-3600*24; // blanks remain one day after being filled
	$lastWeek=strtotime('now')-3600*24*7;  // blanks remain one week unless they are not filled
	$sql="SELECT *,analizlar.nom AS analiz,blankalar.nom AS blanka,analiz_buyurtmalar.id AS id 
			FROM analiz_buyurtmalar JOIN analizlar ON analiz_buyurtmalar.analiz_id=analizlar.id 
			JOIN mijozlar ON analiz_buyurtmalar.mijoz_id=mijozlar.id 
			JOIN blankalar ON analizlar.blanka_id=blankalar.id 
			WHERE (analiz_buyurtmalar.tolgan_vaqt<1 OR analiz_buyurtmalar.sana>$timeToShowFilledBlanks) AND analizlar.laborant_id=$laborantId
			AND analiz_buyurtmalar.sana>$lastWeek
			ORDER BY analiz_buyurtmalar.sana ASC";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	for($i=0;$i<count($data);$i++){
		$visits=getVisits($data[$i]['mijoz_id']);
		$data[$i]+=array('takroriy'=>$visits);
	}
	return $data;
}
function getOrdersForRegistrator(){
	global $db;
	$today=strtotime('yesterday');
	$sql="SELECT *,analizlar.nom AS analiz,blankalar.nom AS blanka,analiz_buyurtmalar.id AS id 
			FROM analiz_buyurtmalar JOIN analizlar ON analiz_buyurtmalar.analiz_id=analizlar.id 
			JOIN mijozlar ON analiz_buyurtmalar.mijoz_id=mijozlar.id 
			JOIN blankalar ON analizlar.blanka_id=blankalar.id 
			WHERE analiz_buyurtmalar.sana>$today
			ORDER BY analiz_buyurtmalar.sana ASC";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	for($i=0;$i<count($data);$i++){
		$visits=getVisits($data[$i]['mijoz_id']);
		$data[$i]+=array('takroriy'=>$visits);
	}
	return $data;
}

// XIZMATLAR
function getServiceTypes(){
	global $db;
	$sql="SELECT * FROM service_types";
	$query = $db->query($sql);
	$data = $query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getServicesByType($type_id){
	global $db;
	$sql="SELECT services.*,service_types.name AS service_type FROM services JOIN service_types ON services.service_type=service_types.id 
		WHERE services.service_type=".$type_id;
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}


// TASHRIFLAR  
function getVisits($cus_id){
	global $db;
	$sql="SELECT COUNT(mijoz_id) AS takroriy FROM tashriflar WHERE mijoz_id=$cus_id";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data[0]['takroriy'];
}
 // BLANKALAR
function getBlanks(){
	global $db;
	$sql="SELECT * FROM blankalar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
 // XODIMLAR
function getStaffs(){
	global $db;
	$sql="SELECT xodimlar.*, service_types.name as speciality FROM xodimlar LEFT JOIN service_types ON xodimlar.service_type=service_types.id";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getLaborants(){
	global $db;
	$sql="SELECT * FROM xodimlar WHERE rol='laborant'";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}

function getRegistrators(){
	global $db;
	$sql="SELECT * FROM xodimlar WHERE rol='registrator'";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}

function getDoctors($service_type=''){
	global $db;
	$sql="SELECT * FROM xodimlar WHERE rol='doktor'";

	if($service_type){
		$sql.=" AND service_type=".$service_type;
	}
	$query=$db->query($sql);

	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}



 //  TASHKILOTLAR
function getOrganizations($time_type='all',$from=0,$till=0, $registrator="all"){
	global $db;
	$t=0;
	if($time_type=='day'){
		$t=strtotime('today');
	}elseif($time_type=='month'){
		$t=mktime(0,0,0,date('m'),1,date('Y'));
		//echo $t;
	}
	if($t){
		$sql="SELECT *,SUM(analiz_buyurtmalar.analiz_narx) AS sum_price,COUNT(DISTINCT mijozlar.id) AS num_customers,COUNT(analiz_buyurtmalar.id) AS num_analizes FROM tashkilotlar LEFT JOIN (analiz_buyurtmalar JOIN mijozlar ON mijozlar.id=analiz_buyurtmalar.mijoz_id) ON tashkilotlar.id=mijozlar.tashkilot_id WHERE analiz_buyurtmalar.sana>$t GROUP BY tashkilotlar.nom ORDER BY analiz_buyurtmalar.sana DESC";
	}elseif($time_type=='custom_time'){
		$sql="SELECT *, SUM(analiz_buyurtmalar.analiz_narx) AS sum_price, COUNT(DISTINCT mijozlar.id) AS num_customers, COUNT(analiz_buyurtmalar.id) AS num_analizes 
			FROM tashkilotlar 
			LEFT JOIN (
				analiz_buyurtmalar JOIN mijozlar ON mijozlar.id = analiz_buyurtmalar.mijoz_id
			) ON tashkilotlar.id = analiz_buyurtmalar.tashkilot_id 
			WHERE (analiz_buyurtmalar.sana BETWEEN $from AND $till)";
			
		if($registrator && $registrator != "all"){
			$sql = $sql . " AND analiz_buyurtmalar.user_id=$registrator";
		}
			
		$sql = $sql . "  GROUP BY tashkilotlar.nom ORDER BY analiz_buyurtmalar.sana DESC";
	} else {
		$sql="SELECT * FROM tashkilotlar";
	}
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getOrganizationNames(){
	global $db;
	$sql="SELECT nom,id FROM tashkilotlar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	$organization_names=array();
	foreach ($data as $organization) {
		$organization_names[]=array('name'=>$organization['nom'],'id'=>$organization['id']);
	}
	return $organization_names;
}


//  VILOYAT  &&  TUMANLAR
function getRegions(){
	global $db;
	$sql="SELECT * FROM viloyatlar";
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}
function getDistricts($region_id=0){
	global $db;
	if($region_id){
		$sql="SELECT * FROM tumanlar WHERE viloyat_id=$region_id";
	}else{
		$sql="SELECT * FROM tumanlar";
	}
	$query=$db->query($sql);
	$data=$query->fetchAll(PDO::FETCH_ASSOC);
	return $data;
}