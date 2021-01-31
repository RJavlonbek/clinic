<?php require(SYSBASE."common/header.php");?>
<body id="admin">
   <div class="login_full">
		<div class="login_main">
	    <center><span class="top_text"><font color="white">Login</font>&nbsp&nbsp&nbsp&nbsp<font color="#797c80">sahifa</font></span></center>
		  <form class="login">
			<label for="username">
			  <span class="text_form_for_login">Login</span><br />
			  <input type="text" name="username" id="username" placeholder="" class="text_input_for_login"><br />
			</label>
			<label for="password">
			  <span class="text_form_for_login">Parol</span><br />
			  <input type="password" name="password"  id="password" placeholder="" class="text_input_for_login">
			</label><br />
			<center>
			  	<input type="submit" name="submit" value="KIRISH" class="login_submit"></input>
			</center>
		  </form>
		</div>
	</div>
</body>
</html>
<?php 
	if(isset($_GET['submit'])){
		$login=$_GET['username'];
		$password=$_GET['password'];
		$user=logIn($login,$password);
		
		if($user){
			$role=$user['rol'];
			setcookie($login,$role,time()+7200, "/");
			setcookie('userid',$user['id'],time()+7200, "/");
			if($role=='admin'){
				header("Location:administrator");
			}elseif($role=='registrator'){
				header("Location:registrator");
			}elseif($role=='registrator2'){
				header("Location:registrator2");
			}elseif($role=='laborant'){
				header("Location:laborant");
			}
		}
	}	
	?>
