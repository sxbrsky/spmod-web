#include "spmodweb.hpp"

namespace SPModWeb
{
    AwsRequestHandler::AwsRequestHandler(Aws::SNS::SNSClient& snsClient) : m_awsSNSClient(snsClient)
    {}

    void AwsRequestHandler::handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response)
    {
        Poco::Util::Application& app = Poco::Util::Application::instance();
        app.logger().information("Request from %s", request.clientAddress().toString());
        std::string bodyRequest;
        Poco::StreamCopier::copyToString(request.stream(), bodyRequest);

        try {
            Poco::JSON::Parser jsonParser;
            Poco::Dynamic::Var parsedJson = jsonParser.parse(bodyRequest);
            Poco::JSON::Query jsonQuery(parsedJson);

            isValidAwsRequest(jsonQuery);

            if (!request.has(AMAZON_HEADER_TYPE)) {
                
            } else {
                if (request.get(AMAZON_HEADER_TYPE) != "Notification") {
                    confirmSubscription(jsonQuery);
                } else {

                }
                response.setStatus(Poco::Net::HTTPResponse::HTTPStatus::HTTP_OK);
                std::ostream& os = response.send();
                os << "OK";
                os.flush();
            }
        } catch (const AwsRequestBadRequestException& e) {
            // TODO: Create commons for handlers to return status codes
            response.setStatus(Poco::Net::HTTPResponse::HTTPStatus::HTTP_BAD_REQUEST);
            std::ostream& os = response.send();
            os << e.getReason();
            os.flush();
        } catch (const AwsRequestInternalServerErrorException& e) {
            response.setStatus(Poco::Net::HTTPResponse::HTTPStatus::HTTP_INTERNAL_SERVER_ERROR);
            std::ostream& os = response.send();
            os << e.getReason();
            os.flush();
        }
    }

    void AwsRequestHandler::isValidAwsRequest(const Poco::JSON::Query& jsonQuery)
    {
        {
            Poco::Dynamic::Var singatureVerVar = jsonQuery.find("SignatureVersion");
            try {
                if (singatureVerVar.isEmpty() || singatureVerVar != "1") {
                    throw AwsRequestBadRequestException("Signature version is missing or is not equal to 1");
                }
            } catch (const Poco::BadCastException &e) {
                throw AwsRequestBadRequestException(e.displayText());
            }
        }

        Poco::Dynamic::Var messageVar = jsonQuery.find("Message");
        Poco::Dynamic::Var messageIdVar = jsonQuery.find("MessageId");
        Poco::Dynamic::Var timestampVar = jsonQuery.find("Timestamp");
        Poco::Dynamic::Var topicArnVar = jsonQuery.find("TopicArn");
        Poco::Dynamic::Var typeVar = jsonQuery.find("Type");
        Poco::Dynamic::Var singingCertVar = jsonQuery.find("SigningCertURL");

        if (messageVar.isEmpty() || messageIdVar.isEmpty() || timestampVar.isEmpty() || topicArnVar.isEmpty() || typeVar.isEmpty() || singingCertVar.isEmpty()) {
            throw AwsRequestBadRequestException("Incomplete AWS SNS message");
        }

        Poco::Dynamic::Var subjectVar = jsonQuery.find("Subject");
        Poco::Dynamic::Var tokenVar = jsonQuery.find("Token");
        Poco::Dynamic::Var subscribeUrlVar = jsonQuery.find("SubscribeURL");

        std::string stringToHash;

        stringToHash += "Message\n" + messageVar.toString() + '\n';
        stringToHash += "MessageId\n" + messageIdVar.toString() + '\n';
        if (!subjectVar.isEmpty()) {
            stringToHash += "Subject\n" + subjectVar.toString() + '\n';
        }
        if (!subscribeUrlVar.isEmpty()) {
            stringToHash += "SubscribeURL\n" + subscribeUrlVar.toString() + '\n';
        }
        stringToHash += "Timestamp\n" + timestampVar.toString() + '\n';
        if (!tokenVar.isEmpty()) {
            stringToHash += "Token\n" + tokenVar.toString() + '\n';
        }
        stringToHash += "TopicArn\n" + topicArnVar.toString() + '\n';
        stringToHash += "Type\n" + typeVar.toString() + '\n';

        try {
            Poco::URI signingCertUri(singingCertVar.toString());
            Poco::Net::HTTPSClientSession httpsClientSession(signingCertUri.getHost());
            
            // TODO: Create session pool
            Poco::Net::HTTPRequest httpRequest(Poco::Net::HTTPRequest::HTTP_GET, signingCertUri.toString(), Poco::Net::HTTPMessage::HTTP_1_1);
            httpsClientSession.sendRequest(httpRequest);

            Poco::Net::HTTPResponse httpResponse;
            std::istream& responseStream = httpsClientSession.receiveResponse(httpResponse);

            if (httpResponse.getStatus() != Poco::Net::HTTPResponse::HTTPStatus::HTTP_OK) {
                throw AwsRequestBadRequestException("Could not retrieve the certificate");
            }

            Poco::Crypto::X509Certificate x509Cert(responseStream);
            Poco::Crypto::RSAKey rsaPublicKey(x509Cert);

            std::istringstream signatureBase64Stream(jsonQuery.find("Signature").toString());
            Poco::Base64Decoder signatureDecoder(signatureBase64Stream);
            std::string decodedSignature;
            Poco::StreamCopier::copyToString(signatureDecoder, decodedSignature);

            Poco::Crypto::RSADigestEngine::Digest digest;
            for (unsigned char c : decodedSignature) {
                digest.push_back(c);
            }

            Poco::Crypto::RSADigestEngine rsaDigestEngine(rsaPublicKey, "SHA1");
            rsaDigestEngine.update(stringToHash);

            if (!rsaDigestEngine.verify(digest)) {
                throw AwsRequestBadRequestException("Invalid AWS SNS message");
            }
        } catch (const Poco::SyntaxException& e) {
            throw AwsRequestBadRequestException(e.displayText());
        } catch (const Poco::NotFoundException& e) {
            throw AwsRequestInternalServerErrorException(e.displayText());
        }
    }

    void AwsRequestHandler::confirmSubscription(const Poco::JSON::Query& jsonQuery) {
        Aws::SNS::Model::ConfirmSubscriptionRequest confirmRequest;
        confirmRequest.SetTopicArn(jsonQuery.find("TopicArn").toString());
        confirmRequest.SetToken(jsonQuery.find("Token").toString());

        Poco::UUID uuid = Poco::UUIDGenerator::defaultGenerator().createRandom();

        Poco::Util::Application::instance().logger().information("Confirmation of subscription request %s received", uuid.toString());

        const auto ctxUuid = std::make_shared<const Aws::Client::AsyncCallerContext>(uuid.toString());
        m_awsSNSClient.ConfirmSubscriptionAsync(confirmRequest, confirmSubscriptionHandler, ctxUuid);
    }

    void AwsRequestHandler::confirmSubscriptionHandler(const Aws::SNS::SNSClient* client, const Aws::SNS::Model::ConfirmSubscriptionRequest& request, const Aws::SNS::Model::ConfirmSubscriptionOutcome& outcome, const std::shared_ptr<const Aws::Client::AsyncCallerContext>& ctx)
    {
        const Poco::Util::Application& app = Poco::Util::Application::instance();
        if (outcome.IsSuccess()) {
            app.logger().information("Confirmation of subscription request %s succeed", ctx->GetUUID());
        } else {
            app.logger().error("Confirmation of subscription request %s failed\nCode: %i\nMessage: %s", ctx->GetUUID(), static_cast<int>(outcome.GetError().GetErrorType()), outcome.GetError().GetMessage());
        }
    }
}

