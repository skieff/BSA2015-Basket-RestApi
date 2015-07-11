<?php

namespace BSA2015\Basket;

use Exception;
use Slim\Middleware\ContentTypes;
use Slim\Slim;

class RestApi {
    /**
     * @var Slim
     */
    private $_slim;

    /**
     * @var StorageInterface
     */
    private $_storage;

    /**
     * @var BasketService
     */
    private $_basketService;

    static function factory($filePath) {
        $storage = new YamlStorage($filePath);
        $slimApp = new Slim();
        $slimApp->add(new ContentTypes());
        $slimApp->config('debug', false);

        $instance = new static($slimApp, $storage);

        $slimApp->error(array($instance, 'error'));

        return $instance;
    }

    function __construct(Slim $slim, StorageInterface $storage)
    {
        $this->_slim = $slim;
        $this->_storage = $storage;
        $this->_basketService = new BasketService($storage);
        $this->_initRoutes();
    }

    public function run() {
        try {
            $this->_slim->run();
        } catch (Exception $e) {
            $this->error($e);
        }

        $this->_storage->store(
            $this->_basketService->getBasketArrayCopy(),
            $this->_basketService->getProductArrayCopy(),
            $this->_basketService->getBasketItemArrayCopy()
        );
    }

    public function getBaskets() {
        $this->_setBody(array_values($this->_basketService->getBasketArrayCopy()));
    }

    public function getProducts() {
        $this->_setBody(array_values($this->_basketService->getProductArrayCopy()));
    }

    public function getBasket($basketId) {
        $this->_setBody($this->_basketService->findBasket($basketId));
    }

    public function getBasketItems($basketId) {
        $basketService = $this->_basketService;
        $this->_setBody(array_values($basketService->getBasketItems($basketService->findBasket($basketId))));
    }

    public function postBasketItem($basketId) {
        $basketService = $this->_basketService;
        $app = $this->_slim;

        $basket = $basketService->findBasket($basketId);
        $params = $app->request()->getBody();
        $product = $basketService->findProduct($params['product']);

        $item = $basketService->addBasketItem($basket, $product, $app->request()->post('itemsAmount', 1));

        $app->redirect('/basket/' . $item->basket . '/item/' . $item->product, 303);
    }

    public function putBasketItem($basketId, $productId) {
        $basketService = $this->_basketService;
        $app = $this->_slim;

        $basketItem = $basketService->findBasketItem($basketId, $productId);
        $this->_setBody($basketService->updateBasketItem($basketItem, $app->request()->getBody()));
    }

    public function getBasketItem($basketId, $productId) {
        $this->_setBody($this->_basketService->findBasketItem($basketId, $productId));
    }

    public function deleteBasketItem($basketId, $productId) {
        $this->_setBody($this->_basketService->deleteBasketItem($basketId, $productId));
    }

    private function _initRoutes() {
        $this->_slim->contentType('application/json');

        $this->_slim->get('/basket/', array($this, 'getBaskets'));
        $this->_slim->get('/product/', array($this, 'getProducts'));
        $this->_slim->get('/basket/:id', array($this, 'getBasket'));
        $this->_slim->get('/basket/:id/item/', array($this, 'getBasketItems'));
        $this->_slim->get('/basket/:id/item/:prodId', array($this, 'getBasketItem'));

        $this->_slim->post('/basket/:id/item/', array($this, 'postBasketItem'));

        $this->_slim->put('/basket/:id/item/:prodId', array($this, 'putBasketItem'));

        $this->_slim->delete('/basket/:id/item/:prodId', array($this, 'deleteBasketItem'));
    }

    public function error(Exception $e) {
        if ($e instanceof \BSA2015\Basket\Exception\Exception) {
            $this->_slim->response()->status($e->getCode());
        } else {
            $this->_slim->response()->status(500);
        }
        $this->_slim->contentType('text/html');
        $this->_slim->response()->body($e->getMessage());
    }

    /**
     * @param $body
     * @return string
     */
    private function _setBody($body)
    {
        return $this->_slim->response()->body(json_encode($body));
    }
}