<?php
    namespace App\Controller;


    use App\Base\AbstractController;
    use App\Base\Aws;

    class AwsController extends AbstractController
    {
        public function process(string $postBody) : void
        {
            $msgObj = json_decode($postBody);
            if ($msgObj->{'Type'} == 'SubscriptionConfirmation') {
                $this->confirmSubscription($msgObj);
            } else if ($msgObj->{'Type'} == 'Notification') {
                $this->notificationBuild($msgObj);
            }
        }

        private function confirmSubscription(object $msgObj) : bool
        {
            $curlInstance = curl_init();
            curl_setopt($curlInstance, CURLOPT_URL, $msgObj->{'SubscribeURL'});
            curl_setopt($curlInstance, CURLOPT_RETURNTRANSFER, 1);
            $subscribeResult = curl_exec($curlInstance);
            curl_close($curlInstance);

            $xmlParser = xml_parser_create();
            $xmlValues = [];
            $idxValues = [];
            if (!xml_parse_into_struct($xmlParser, $subscribeResult, $xmlValues, $idxValues)) {
                xml_parser_free($xmlParser);
                return false;
            }
            xml_parser_free($xmlParser);

            $subscriptionArnEnv = getenv('SNS_ARN_SUBSCRIPTION');
            $subscriptionArn = $xmlValues[$idxValues['SubscriptionArn']]['value'];

            if ($subscriptionArnEnv === $subscriptionArn) {
                return true;
            }

            return false;
        }

        private function notificationBuild(object $msgObj) : void
        {
            $message = json_decode($msgObj->{'Message'});

            foreach ($message->{'Records'} as $key => $build) {
                $awsInstance = new Aws;
                $awsInstance->downloadBuild($build->s3->object->key, $build->s3->bucket->name);
            }
        }
    }
