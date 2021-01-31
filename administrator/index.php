<?php

require("../common/define.php");

$user = getActiveUser();

if($user['rol'] != "admin"){
	header("Location: /");
} else {
	require(SYSBASE."models/administrator.php");
}

?>