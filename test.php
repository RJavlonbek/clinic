<?php 
require('common/define.php');
// $name='Nodirbek Ergashev (ID: 233242)';
// $start=strrpos($name,' ')+1;
// $end=strrpos($name, ')');
// echo substr($name,$start,$end-$start);

date_default_timezone_set("Asia/Tashkent");
//echo date("Y M d h i a s",1527285599);
//$t=strtotime('this month'); does not work
$t=mktime(0,0,0,date('m'),1,date('Y'));
//echo $t;
echo date("Y M d, h a i:s",strtotime('03-09-1998'));
?>