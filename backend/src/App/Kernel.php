<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Base\Cache;

    class Kernel
    {
        protected $rootDir = null;
        protected $buildDir = null;

        private $cache;
        private $db;
        private $files = [];
        private $data = [];
        private $hash = [];

        public function __construct()
        {
            $this->db = new Database();
            $this->cache = new Cache($db);

            if ($this->rootDir == null) {
                $this->rootDir = $_SERVER['DOCUMENT_ROOT'];
                if ($this->buildDir == null) {
                    $this->buildDir = $this->rootDir.'/builds';
                }
            }   
        }

        public function getCommitData(string $hash)
        {
            $c = curl_init();
            curl_setopt($c,CURLOPT_USERAGENT,'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1');
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($c, CURLOPT_URL, 'https://api.github.com/repos/Amaroq7/SPMod/commits/'.$hash);
            
            $content = curl_exec($c);
            curl_close($c);
            
            return json_decode($content);    
        }

        public function getData($build = null)
        {
            $buildModel = new Builds($this->db);
            
            if ($build === null) {
                $result = $buildModel->findAll();
            } else {
                $result = $buildModel->find($build);
            }
            

            foreach ($bld as $result => $value) {
                $hash = $value[3];
                $build = array_search($value[2], array_column($this->data, 'build'));
                $type = explode('.', $value[5])[0];

                if (!$this->cache->isCached($hash)) {
                    $message = $this->getCommitData($hash);
                    $this->cache->add($hash, $message);
                } else {
                    $message = $this->cache->get($hash);
                }

                    if ($build === false) {
                        $this->data[] =[
                            'build' => $value[2],
                            'data' => [[
                                'system' => $value[1],
                                'compiler' => $value[4],
                                'type' => $type,
                                'file' => $file
                            ]],
                            'commit' => $hash,
                            'message' => $message
                        ];
                    } else {
                        $this->data[$build]['data'][] = [
                            'system' => $value[1],
                            'compiler' => $value[4],
                            'type' => $type,
                            'file' => $file
                        ];
                    }
            }
            rsort($this->data);

            return $this->data;
        }
    }