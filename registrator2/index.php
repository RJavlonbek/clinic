<?php

require("../common/define.php");
$login=$db->query("SELECT login FROM xodimlar WHERE rol='registrator2'");
$login=$login->fetchAll(PDO::FETCH_ASSOC);
$login=$login[0]['login'];
if(isset($_COOKIE[$login])){
	if(($_COOKIE[$login])!="registrator2"){
	  header("Location: /");
	}elseif($_COOKIE[$login]=='registrator2'){
		setcookie($login,'registrator2',time()+7200);
		require(SYSBASE."models/registrator2.php");
	}
}else{
	header("Location: /");
}

?>
