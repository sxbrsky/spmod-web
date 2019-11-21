#pragma once

#include "spmodweb.hpp"

namespace SPModWeb
{
    class ApiRequestHandler : public Poco::Net::HTTPRequestHandler
    {
        public:
            void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response);
            
        private:
            void getAllBuilds(Poco::Net::HTTPServerResponse& response);
            void getBuild(int id);
    };
}