<?php

require("../common/define.php");

$user = getActiveUser();

if(($user['rol'] != "registrator"){
	header("Location: /");
} else {
	setcookie($user['login'], 'registrator', time()+7200);
	setcookie("userid", $user['id'], time()+7200);
	require(SYSBASE."models/registrator.php");
}

?>

