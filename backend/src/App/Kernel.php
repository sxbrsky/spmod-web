<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Base\Aws;
    use App\Model\Builds;
    use App\Model\Commits;

    class Kernel
    {
        public static function getDatabase() : Database 
        {
            return new Database();
        }

        public static function getAws() : Aws
        {
            return new Aws();
        }


        public static function getRootDir()
        {
            $reflection = new \ReflectionObject(Kernel);
            $dir = dirname($reflection->getFileName());
            while (!file_exists($dir.'/composer.json')) {
                if ($dir === dirname($dir)) {
                    return $dir;
                }
            $dir = dirname($dir);
            }

            return $dir;
        }

        public static function getBuildDir()
        {
            return Kernel::getRootDir() . '/builds/';
        }

        public static function buildArray($build = null)
        {
            $data = [];
            $buildModel = new Builds(Kernel::getDatabase());
            $result = $buildModel->getBuilds() ?? $buildModel->getBuild($build);

            foreach ($result as $key => $value) {
                $hash = $value['commit_hash'];
                $build = array_search($value['build'], array_column($data, 'build'));
                $message = Kernel::getCommitMessage($hash);

                if ($build === false) {
                    $data[] = [
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
                    $data[$build]['builds'][] = [
                        'system' => $value['system'],
                        'compiler' => $value['compiler'],
                        'type' => $value['type'],
                        'file' => $value['filename']
                    ];
                }
            }
            rsort($data);

            return $data;
        }

        public static function getCommitMessage(string $hash)
        {
            $commitModel = new Commits(Kernel::getDatabase());

            if ($commitModel->hasHash($hash)) {
                $commit = $commitModel->get($hash);
                $message = $commit['commit_msg'];
            } else {
                $message = getCommitData($hash);
                $commitModel->save($hash, $message);
            }

            return $message;
        }

        private static function getCommitData(string $hash)
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