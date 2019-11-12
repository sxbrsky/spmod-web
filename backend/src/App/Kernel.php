<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Base\Cache;
    use App\Model\Builds;
    use App\Model\Commits;

    class Kernel
    {
        protected $rootDir = null;
        protected $buildDir = null;

        protected $db;
        private $data = [];

        public function __construct()
        {
            $this->db = new Database();

            if ($this->rootDir == null) {
                $this->rootDir = $_SERVER['DOCUMENT_ROOT'];
                if ($this->buildDir == null) {
                    $this->buildDir = $this->rootDir.'/builds';
                }
            }   
        }

        public function getDatabase() : Database 
        {
            return $this->db;
        }

        public function buildArray($build = null)
        {
            $buildModel = new Builds($this->getDatabase());
            $result = $buildModel->getBuilds() ?? $buildModel->getBuild($build);

            foreach ($result as $key => $value) {
                $hash = $value['commit_hash'];
                $build = array_search($value['build'], array_column($this->data, 'build'));
                $message = $this->getCommitMessage($hash);

                if ($build === false) {
                    $this->data[] = [
                        'build' => $value['build'],
                        'version' => $value['version'],
                        'builds' => [[
                            'system' => $value['system'],
                            'compiler' => $value['compiler'],
                            'type' => $value['type'],
                            'file' => $value['filename']
                        ]],
                        'commit' => $hash,
                        'message' => $message
                    ];
                } else {
                    $this->data[$build]['builds'][] = [
                        'system' => $value['system'],
                        'compiler' => $value['compiler'],
                        'type' => $value['type'],
                        'file' => $value['filename']
                    ];
                }
            }
            rsort($this->data);

            return $this->data;
        }

        private function getCommitMessage(string $hash)
        {
            $commitModel = new Commits($this->getDatabase());

            if ($commitModel->hasHash($hash)) {
                $commit = $commitModel->get($hash);
                $message = $commit['commit_msg'];
            } else {
                $message = $this->getCommitData($hash);
                $commitModel->save($hash, $message);
            }

            return $message;
        }

        private function getCommitData(string $hash)
        {
            $c = curl_init();
            curl_setopt($c,CURLOPT_USERAGENT,'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1');
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($c, CURLOPT_URL, getenv('GITHUB_API').$hash);
            
            $content = curl_exec($c);
            curl_close($c);
            
            return json_decode($content);    
        }
    }