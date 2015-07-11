<?php

include "vendor/autoload.php";

$fileName = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'data.yml';
$storage = new \BSA2015\Basket\YamlStorage($fileName);
$basketService = new \BSA2015\Basket\BasketService($storage);

$app = new \Slim\Slim();
$app->add(new \Slim\Middleware\ContentTypes());
$app->config('debug', false);
$app->contentType('application/json');

$app->get('/basket/', function () use($basketService) {
    echo json_encode(array_values($basketService->getBasketArrayCopy()));
});

$app->get('/product/', function () use($basketService) {
    echo json_encode(array_values($basketService->getProductArrayCopy()));
});

$app->get('/basket/:id', function($basketId) use($basketService) {
    echo json_encode($basketService->findBasket($basketId));
});

$app->get('/basket/:id/item/', function($basketId) use($basketService) {
    echo json_encode(array_values($basketService->getBasketItems($basketService->findBasket($basketId))));
});

$app->post('/basket/:id/item/', function($basketId) use($app, $basketService) {
    $basket = $basketService->findBasket($basketId);
    $params = $app->request()->getBody();
    $product = $basketService->findProduct($params['product']);

    $item = $basketService->addBasketItem($basket, $product, $app->request()->post('itemsAmount', 1));

    $app->redirect('/basket/' . $item->basket . '/item/' . $item->product, 303);
});

$app->put('/basket/:id/item/:prodId', function($basketId, $productId) use($app, $basketService) {
    $basketItem = $basketService->findBasketItem($basketId, $productId);

    echo json_encode($basketService->updateBasketItem($basketItem, $app->request()->getBody()));
});

$app->get('/basket/:id/item/:prodId', function($basketId, $productId) use($basketService) {
    echo json_encode($basketService->findBasketItem($basketId, $productId));
});

$app->delete('/basket/:id/item/:prodId', function($basketId, $productId) use($app, $basketService) {
    echo json_encode($basketService->deleteBasketItem($basketId, $productId));
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
