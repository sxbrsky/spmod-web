<?php
    namespace App;

    class Core
    {
        protected $rootDir = null;
        protected $buildDir = null;
        protected $cacheDir = null;
    
        private $hash = [];
        private $files = [];
        private $data = [];

        public function __construct()
        {
            if ($this->rootDir == null) {
                $this->rootDir = $_SERVER['DOCUMENT_ROOT'];

                if ($this->buildDir == null) {
                    $this->buildDir = $this->rootDir.'/public/builds/';
                }
                if ($this->cacheDir == null) {
                    $this->cacheDir = $this->rootDir.'/cache/builds/';
                }
            }
            
        }

        public function getCommitData($hash)
        {
            $c = curl_init();
            curl_setopt($c,CURLOPT_USERAGENT,'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1');
            curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($c, CURLOPT_URL, 'https://api.github.com/repos/Amaroq7/SPMod/commits/'.$hash);
            
            $content = curl_exec($c);
            curl_close($c);
            
            return json_decode($content);            
        }

        public function getBuilds()
        {
            foreach (new \DirectoryIterator($this->buildDir) as $file) {
                if ($file->isDot()) continue;
                $info = explode('-', $file->getFilename());

                $this->files[] = $info;
            }

            return $this->files;
        }
        public function getData()
        {
            $files = $this->getBuilds();

            foreach ($files as $key => $value) {
                $hash = $value[3];
                $build = array_search($value[2], array_column($this->data, 'build'));
                $type = explode('.', $value[5])[0];
                $file = "{$value[0]}-{$value[1]}-{$value[2]}-{$value[3]}-{$value[4]}-{$value[5]}";
                
                if (!apcu_exists($hash)) {
                    $message = $this->getCommitData($hash);
                    apcu_store($hash, $message->commit->message);
                }
                if (apcu_exists($hash)) {
                    $message = \apcu_fetch($hash);   
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