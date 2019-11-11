<?php
    require_once __DIR__.'/vendor/autoload.php';


    $dotenv = Dotenv\Dotenv::create(__DIR__);
    $dotenv->load();

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode('/', $uri);

    $param = (isset($uri[2]) && $uri[2] != '') ? $uri[2] : null;

    switch ($uri[1]) {
        case 'build': {
            header("Access-Control-Allow-Origin: *");
            header("Content-Type: application/json; charset=UTF-8");
            header("Access-Control-Allow-Methods: GET");
            header("Access-Control-Max-Age: 3600");
            header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            
            $controller = new App\Controller\BuildController;
            $controller->process($_SERVER['REQUEST_METHOD'], $param);
            break;
        }
        default: {
            header("HTTP/1.1 404 Not Found");
            exit();
        }
    }