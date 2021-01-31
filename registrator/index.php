<?php

require("../common/define.php");

$user = getActiveUser();

if($user['rol'] != "registrator"){
	header("Location: /");
} else {
	require(SYSBASE."models/registrator.php");
}

?>

