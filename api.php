<?php

include "vendor/autoload.php";

$fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'data.yml';
$storage = new \BSA2015\Basket\YamlStorage($fileName);
$basketService = new \BSA2015\Basket\BasketService($storage);

$app = new \Slim\Slim();
$app->config('debug', false);
$app->contentType('application/json');

$app->get('/basket/', function () use($basketService) {
    echo json_encode($basketService->getBasketArrayCopy());
});

$app->get('/basket/:id', function($basketId) use($basketService) {
    echo json_encode($basketService->findBasket($basketId));
});

$app->get('/basket/:id/item/', function($basketId) use($basketService) {
    echo json_encode($basketService->getBasketItems($basketService->findBasket($basketId)));
});

$app->get('/basket/:id/item/:prodId', function($basketId, $productId) use($basketService) {
    echo json_encode($basketService->findBasketItem($basketService->findBasket($basketId), $productId));
});

$app->error(function (Exception $e) use ($app) {
    if ($e instanceof \BSA2015\Basket\Exception\Exception) {
        $app->response()->status($e->getCode());
    } else {
        $app->response()->status(500);
    }
    $app->contentType('text/html');
    $app->response()->body($e->getMessage());
});

$app->run();

$storage->store(
    $basketService->getBasketArrayCopy(),
    $basketService->getProductArrayCopy(),
    $basketService->getBasketItemArrayCopy()
);
