#pragma once

#include "spmodweb.hpp"

namespace SPModWeb {
    class RequestHandlerFactory : public Poco::Net::HTTPRequestHandlerFactory
    {
        Poco::Net::HTTPRequestHandler* createRequestHandler(const Poco::Net::HTTPServerRequest& request);
    };
}