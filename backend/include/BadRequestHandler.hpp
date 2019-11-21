#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class BadRequestHandler : public Poco::Net::HTTPRequestHandler
    {
        public:
            void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response);
    };
}