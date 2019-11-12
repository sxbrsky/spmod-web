<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Model\Builds;
    use App\Model\Kernel;
    use Aws\S3\S3Client;
    use Aws\S3\Exception\S3Exception;
    class Aws
    {
        private $aws = null;
        private $db = null;

        public function __construct()
        {
            if ($this->db === null) {
                $this->db = new Database;
            }
            
            if ($this->aws === null) {
                $this->aws = S3Client([
                    'profile' => getenv('S3_PROFILE'),
                    'version' => getenv('S3_VERSION'),
                    'region' => getenv('S3_REGION')
                ]);
            }
        }

        public function downloadBuild($filename, $bucket)
        {
            try {
                $build = new Builds($this->$db);
                
                $fileArray = $this->explodeFilename($filename);
                $build->save();

                $result = $this->aws->getObject([
                    'Bucket' => $bucket,
                    'Key' => $filename
                ]);
            } catch (S3Exception $e) {
                echo $e->getMessage() . PHP_EOL;
            }
        }

        private function explodeFilename($filename)
        {
            $parts = explode('-', $filename);

            $build = [
                'system' => $parts[1],
                'build' => $parts[2],
                'hash' => $parts[3],
                'compiler' => $parts[4],
                'type' => explode('.', $parts[5])[0],
            ];

            return $build;
        }
    }