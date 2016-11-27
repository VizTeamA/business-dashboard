<?php

$username = "root"; 
$password = "";   
$host = "localhost";
$database="projecta";

$db = new mysqli($host,$username,$password,$database);

if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_error . ']');
}

$sql =  $_GET['sql'];
//echo $sql;

//$sql = <<<SQL
//    SELECT  `date`, `close` FROM  `data2`
//SQL;

$sql = <<<SQL
	$sql
SQL;

if(!$result = $db->query($sql)){
    die('There was an error running the query [' . $db->error . ']');
}

$data = array();
	
while($row = $result->fetch_assoc()){
   //echo $row['date'] . '<br />';
   $data[] = $row;
}

echo json_encode($data);

$result->free();

?>