<?php

$uploadFolder = __DIR__ . '/../assets/';
$onlinePath = 'http://bundle.dev/demo/assets/';

$response = array();

if (isset($_FILES['file'])) {
	$file = $_FILES['file'];
    $filename = $file['name']; //uniqid() . '.' . (pathinfo($file['name'], PATHINFO_EXTENSION) ? : 'png');

    move_uploaded_file($file['tmp_name'], $uploadFolder . $filename);

    $response['link'] = $onlinePath . $filename;
} else {
    $response['error'] = 'Error while uploading file';
}

echo json_encode($response);
