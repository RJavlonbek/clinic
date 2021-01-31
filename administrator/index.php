<?php

require("../common/define.php");

$login=$db->query("SELECT login FROM xodimlar WHERE rol='admin'");

$login=$login->fetchAll(PDO::FETCH_ASSOC);

$login=$login[0]['login'];

if(isset($_COOKIE[$login])){

	if(($_COOKIE[$login])!="admin"){

	  header("Location: /");

	}elseif($_COOKIE[$login]=='admin'){

		setcookie($login,'admin',time()+7200, "/");

		require(SYSBASE."models/administrator.php");

	}

}else{

	header("Location: /");

}

?>

