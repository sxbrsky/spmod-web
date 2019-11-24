#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class RequestHandlerFactory : public Poco::Net::HTTPRequestHandlerFactory
    {
    public:
        RequestHandlerFactory(Aws::SNS::SNSClient& awsSNSClient);
        Poco::Net::HTTPRequestHandler* createRequestHandler(const Poco::Net::HTTPServerRequest& request);

    private:
        Aws::SNS::SNSClient& m_awsSNSClient;
    };
}