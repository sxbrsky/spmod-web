<?php
    namespace App\Base;

    use Aws\S3\S3Client;
    use Aws\S3\Exception\S3Exception;
    class Aws
    {
        private $aws = null;
        
        public function __construct()
        {
            if ($this->aws === null) {
                $this->aws = S3Client([
                    'profile' => getenv('S3_PROFILE'),
                    'version' => getenv('S3_VERSION'),
                    'region' => getenv('S3_REGION')
                ]);
            }
        }

        public function downloadBuild($filename)
        {
            try {
                $result = $this->aws->getObject([
                    'Bucket' => getenv('S3_BUCKET'),
                    'Key' => $filename
                ]);
            } catch (S3Exception $e) {
                echo $e->getMessage() . PHP_EOL;
            }
        }
    }