<?php
    require_once __DIR__.'/vendor/autoload.php';

    var_dump(App\Base\Kernel::getBuildDir());
    $dotenv = Dotenv\Dotenv::create(__DIR__);
    $dotenv->load();

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode('/', $uri);

    $param = (isset($uri[3]) && $uri[3] != '') ? $uri[3] : null;

    switch ($uri[2]) {
        case 'build': {
            $amazonHeaders = ['X-Amz-Sns-Subscription-Arn',
                              'X-Amz-Sns-Topic-Arn',
                              'X-Amz-Sns-Message-Id',
                              'X-Amz-Sns-Message-Type'];
            $requestHeaders = getallheaders();

            $isAwsRequest = false;
            foreach ($amazonHeaders as $amazonHeader) {
                if (array_key_exists($amazonHeader, $requestHeaders) && App\Base\Aws::isValidAwsSNSMesssage()) {
                    $isAwsRequest = true;
                    $controller = new App\Controller\AwsController;
                    $controller->process(file_get_contents('php://input'));
                    break;
                }
            }

            if ($isAwsRequest) {
                header('HTTP/1.1 200 OK');
                exit();
            }

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
