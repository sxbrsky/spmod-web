<?php
    namespace App\Controller;


    use App\Base\AbstractController;
    use App\Model\Builds;

    class BuildController extends AbstractController
    {
        public function process(string $method, int $build = null)
        {
            switch ($method) {
                case 'GET': {
                    if ($build !== null) {
                        $response = $this->getBuild($build);
                    } else {
                        $response = $this->getAllBuilds();
                    }
                    break;
                }
                default: {
                    $this->notFound();
                }
            }
            header($response['status_code_header']);
            if ($response['body']) {
                echo $response['body'];
            }
        }

        private function getAllBuilds()
        {
            $result = $this->kernel->getData();

            //var_dump($result);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);

            return $response;
        }

        private function getBuild(int $build)
        {
            $result = $this->kernel->getData($build);

            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);

            return $response;
        }

        private function notFound()
        {
            $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
            $response['body'] = null;

            return $response;
        }
    }