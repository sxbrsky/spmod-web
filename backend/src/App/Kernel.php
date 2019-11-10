<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Base\Cache;
    use App\Model\Builds;

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
            $this->cache = new Cache($this->db);

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
            curl_setopt($c, CURLOPT_URL, getenv('GITHUB_API').$hash);
            
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
            
            foreach ($result as $key => $value) {
                $hash = $value['commit_hash'];
                $build = array_search($value['build'], array_column($this->data, 'build'));

                if ($this->cache->isCached($hash)) {
                    $message = $this->getCommitData($hash);
                    $this->cache->add($hash, $message->commit->message);
                } else {
                    $commit = $this->cache->get($hash);
                    $message = $commit['commit_msg'];
                }

                $buildModel->save($commit['id'], $build, $system, $version, $compiler, $type, $filename);
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
    }