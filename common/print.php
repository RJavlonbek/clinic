<link rel="stylesheet" type="text/css" href="style_for_print.css" />

<?php
require('define.php'); 
if(isset($_POST['content'])){
	$content=$db->quote($_POST['content']);
	$time=$db->quote(strtotime('now'));
	$sql="UPDATE print_sahifalar SET content=$content, sana=$time WHERE id=1";
	$db->query($sql);
}
if(isset($_POST['clear'])){
	if($_POST['clear']){
		$db->query('UPDATE print_sahifalar SET content="a", sana=0 WHERE id=1');
	}
}
$sql="SELECT content FROM print_sahifalar WHERE sana<".(strtotime('now')-10);
$data=$db->query($sql);
$data=$data->fetchAll(PDO::FETCH_ASSOC);
while (count($data)!=1) {
	$data=$db->query($sql);
	$data=$data->fetchAll(PDO::FETCH_ASSOC);
}
echo $data[0]['content'];?>
<script type="text/javascript">
	window.print();
	window.close();
</script>
?>