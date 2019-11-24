#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class AwsRequestHandler : public Poco::Net::HTTPRequestHandler
    {
    public:
        void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response);
    private:
        bool isValidAwsRequest(std::string_view bodyRequest);
    };
}