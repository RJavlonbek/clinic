<?php //13-06-2018

// check blank_id column
try{
	$db->query('SELECT blanka_id FROM analizlar');
}catch(PDOException $e){

}

// check get_result column of mijozlar table
try{
	$db->query('SELECT get_result FROM mijozlar');
}catch(PDOException $e){
	$db->query("ALTER TABLE mijozlar 
		ADD get_result varchar(50)");
}

// check result_condition column of analiz_buyurtmalar table
try{
	$db->query('SELECT result_condition FROM analiz_buyurtmalar');
}catch(PDOException $e){
	$db->query("ALTER TABLE analiz_buyurtmalar 
		ADD result_condition varchar(50)");
}

// check get_result_methof column of analiz_buyurtmalar table
try{
	$db->query('SELECT get_result_method FROM analiz_buyurtmalar');
}catch(PDOException $e){
	$db->query("ALTER TABLE analiz_buyurtmalar 
		ADD get_result_method varchar(50)");
}


// setting blank names according to html template files  
// $b=$db->query("SELECT * FROM blankalar");
// $b=$b->fetchAll(PDO::FETCH_ASSOC);
// $files=glob('../blanka/html/*.html');
// foreach($b as $data){
// 	$dataname=$data['nom'];
// 	$dataid=$data['id'];
// 	$count=0;
// 	foreach($files as $file){
// 		if($dataname==basename($file,'.html')){
// 			$count=1;
// 		}
// 	}
// 	if($count==0){
// 		$sql="DELETE FROM blankalar WHERE id=$dataid";
// 		$db->query($sql);
// 	}
// }
// foreach($files as $file){
// 	$filename=basename($file,'.html');
// 	$count=0;
// 	foreach($b as $data){
// 		if($filename==$data['nom']){
// 			$count=1;
// 		}
// 	}
// 	if($count==0){
// 		$sql="INSERT INTO blankalar VALUES ('".$filename."','')";
// 		$db->query($sql);
// 	}
// }
//  blank names end


// 17.11.2019; develop more features
	// -delete customers
	// -delete analiz buyurtmalar
// which were created during development
?>
