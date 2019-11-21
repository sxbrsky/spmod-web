#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class RequestHandlerFactory : public Poco::Net::HTTPRequestHandlerFactory
    {
    public:
        Poco::Net::HTTPRequestHandler* createRequestHandler(const Poco::Net::HTTPServerRequest& request);
    };
}