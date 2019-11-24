#include "spmodweb.hpp"

namespace SPModWeb
{
    void AwsRequestHandler::handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response)
    {
        Poco::Util::Application& app = Poco::Util::Application::instance();
        app.logger().information("Request from %s", request.clientAddress().toString());
        std::string bodyRequest;
        Poco::StreamCopier::copyToString(request.stream(), bodyRequest);

        if (!isValidAwsRequest(bodyRequest)) {
            response.setStatus(Poco::Net::HTTPResponse::HTTPStatus::HTTP_BAD_REQUEST);
            std::ostream& os = response.send();
            os << "Bad Request";
            os.flush();
        } else {
            response.setStatus(Poco::Net::HTTPResponse::HTTPStatus::HTTP_OK);
            std::ostream& os = response.send();
            os << "OK";
            os.flush();
        }
    }

    bool AwsRequestHandler::isValidAwsRequest(std::string_view bodyRequest)
    {
        Poco::JSON::Parser jsonParser;
        Poco::Dynamic::Var parsedJson = jsonParser.parse(bodyRequest.data());
        Poco::JSON::Query jsonQuery(parsedJson);

        {
            Poco::Dynamic::Var singatureVerVar = jsonQuery.find("SignatureVersion");
            try {
                if (singatureVerVar.isEmpty() || singatureVerVar.toString() != "1") {
                    return false;
                }
            } catch (const Poco::BadCastException &e) {
                return false;
            }
        }

        Poco::Dynamic::Var messageVar = jsonQuery.find("Message");
        Poco::Dynamic::Var messageIdVar = jsonQuery.find("MessageId");
        Poco::Dynamic::Var timestampVar = jsonQuery.find("Timestamp");
        Poco::Dynamic::Var topicArnVar = jsonQuery.find("TopicArn");
        Poco::Dynamic::Var typeVar = jsonQuery.find("Type");
        Poco::Dynamic::Var singingCertVar = jsonQuery.find("SigningCertURL");

        if (messageVar.isEmpty() || messageIdVar.isEmpty() || timestampVar.isEmpty() || topicArnVar.isEmpty() || typeVar.isEmpty() || singingCertVar.isEmpty()) {
            return false;
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

        Poco::Util::Application::instance().logger().information("string: %s", stringToHash);

        try {
            Poco::URI signingCertUri(singingCertVar.toString());
            Poco::Net::HTTPSClientSession httpsClientSession(signingCertUri.getHost());
            
            // TODO: Create session pool
            Poco::Net::HTTPRequest httpRequest(Poco::Net::HTTPRequest::HTTP_GET, signingCertUri.toString(), Poco::Net::HTTPMessage::HTTP_1_1);
            httpsClientSession.sendRequest(httpRequest);

            Poco::Net::HTTPResponse httpResponse;
            std::istream& responseStream = httpsClientSession.receiveResponse(httpResponse);

            if (httpResponse.getStatus() != Poco::Net::HTTPResponse::HTTPStatus::HTTP_OK) {
                throw std::runtime_error("Failed to get certificate");
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

            return rsaDigestEngine.verify(digest);
        } catch (const std::exception &e) {
            return false;
        }
    }
}

