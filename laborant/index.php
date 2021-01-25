<?php

require("../common/define.php");



$login=$db->query("SELECT login FROM xodimlar WHERE rol='laborant'");

$login=$login->fetchAll(PDO::FETCH_ASSOC);

$login=$login[0]['login'];

if(isset($_COOKIE[$login])){

	$role=$_COOKIE[$login];

	if($role!="laborant"){

	  header("Location: /");

	}elseif($role=='laborant'){

		setcookie($login,$role,time()+7200);
		require(SYSBASE."models/doktor.php");

	}

}else{

	header("Location: /");

}

?>