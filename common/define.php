<?php
date_default_timezone_set("Asia/Tashkent");
if(!defined("SYSBASE")) define("SYSBASE", str_replace("\\", "/", realpath(dirname(__FILE__)."/../")."/"));
//echo SYSBASE;
$request_uri = explode("/", trim($_SERVER['REQUEST_URI'], "/"));
$pos = strrpos(SYSBASE, "/".$request_uri[0]);
$docbase = false;
if($pos !== false) $docbase = substr(SYSBASE, $pos);
if($docbase === false) $docbase = "/";

define("DOCBASE", $docbase);
//echo DOCBASE;


require("config.php");


try {
    $db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $db->query("SET NAMES 'utf8'");
    // set the PDO error mode to exception
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connected successfully";
} catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
}

require("functions.php");
if(is_file('install.php')){
	require('install.php');
}

$request_uri = (DOCBASE != "/") ? str_replace(DOCBASE, "", $_SERVER['REQUEST_URI']) : $_SERVER['REQUEST_URI'];
$request_uri = trim($request_uri, "/");
$pos = strpos($request_uri, "?");
if($pos !== false) $request_uri = substr($request_uri, 0, $pos);

define("REQUEST_URI", $request_uri);
?>
