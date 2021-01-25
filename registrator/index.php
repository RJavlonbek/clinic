<?php

require("../common/define.php");

$login=$db->query("SELECT login FROM xodimlar WHERE rol='registrator'");

$login=$login->fetchAll(PDO::FETCH_ASSOC);

$login=$login[0]['login'];

if(isset($_COOKIE[$login])){

	if(($_COOKIE[$login])!="registrator"){

	  header("Location: /");

	}elseif($_COOKIE[$login]=='registrator'){

		setcookie($login,'registrator',time()+7200);

		require(SYSBASE."models/registrator.php");

	}

}else{

	header("Location: /");

}

?>

