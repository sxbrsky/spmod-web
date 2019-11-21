#include "spmodweb.hpp"

namespace SPModWeb
{
        Poco::Net::HTTPRequestHandler* RequestHandlerFactory::createRequestHandler(const Poco::Net::HTTPServerRequest& request)
        {
            const std::string& uri = request.getURI();
            Poco::StringTokenizer split_uri(uri, "/");

            if (split_uri[1] == "api") {
                return new SPModWeb::ApiRequestHandler;
            }
        }
} // namespace SPModWeb
