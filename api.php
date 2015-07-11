<?php

include "vendor/autoload.php";

$fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'data.yml';

\BSA2015\Basket\RestApi::factory($fileName)->run();