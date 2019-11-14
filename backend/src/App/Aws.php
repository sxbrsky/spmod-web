<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Model\Builds;
    use App\Model\Kernel;
    use Aws\S3\S3Client;
    use Aws\S3\Exception\S3Exception;
    use Aws\Sns\Message;
    use Aws\Sns\MessageValidator;
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

        public function downloadBuild($filename, $bucket)
        {
            try {
                $build = new Builds(Kernel::getDatabase());
                
                $fileArray = $this->explodeFilename($filename);
                $commit_id = Kernel::getCommitData()['id'];

                $build->save($commit_id, $fileArray['build'], $fileArray['system'], $fileArray['compiler'], $fileArray['type'], $filename);

                $result = $this->aws->getObject([
                    'Bucket' => $bucket,
                    'Key' => $filename,
                    'SaveAs' => Kernel::getBuildDir().$filename
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

        static public function isValidAwsSNSMesssage() : bool {
            $awsSNSMessage = null;
            try {
                $awsSNSMessage = Message::fromRawPostData();
            } catch (Exception $e) {
                return false;
            }
         
            $messageValidator = new MessageValidator();
            return $messageValidator->isValid($awsSNSMessage);
        }
    }