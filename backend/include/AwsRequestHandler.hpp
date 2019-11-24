#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class AwsRequestBadRequestException : public std::runtime_error {
    public:
        AwsRequestBadRequestException(std::string_view reason) : std::runtime_error("Bad request"), m_reason(reason)
        {}

        std::string_view getReason() const {
            return m_reason;
        }

    private:
        std::string m_reason;
    };

    class AwsRequestInternalServerErrorException : public std::runtime_error {
    public:
        AwsRequestInternalServerErrorException(std::string_view reason) : std::runtime_error("Internal server error"), m_reason(reason)
        {}

        std::string_view getReason() const {
            return m_reason;
        }

    private:
        std::string m_reason;
    };

    class AwsRequestHandler : public Poco::Net::HTTPRequestHandler
    {
    public:
        constexpr static const char* AMAZON_HEADER_TYPE = "X-Amz-Sns-Message-Type";

        AwsRequestHandler(Aws::SNS::SNSClient& snsClient);
        void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response);
    private:
        void isValidAwsRequest(const Poco::JSON::Query& jsonQuery);
        void confirmSubscription(const Poco::JSON::Query& jsonQuery);
        static void confirmSubscriptionHandler(const Aws::SNS::SNSClient* client, const Aws::SNS::Model::ConfirmSubscriptionRequest& request, const Aws::SNS::Model::ConfirmSubscriptionOutcome& outcome, const std::shared_ptr<const Aws::Client::AsyncCallerContext>& ctx);

        Aws::SNS::SNSClient& m_awsSNSClient;
    };
}