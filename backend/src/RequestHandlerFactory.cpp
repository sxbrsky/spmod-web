#include "spmodweb.hpp"

namespace SPModWeb
{
    Poco::Net::HTTPRequestHandler* RequestHandlerFactory::createRequestHandler(const Poco::Net::HTTPServerRequest& request)
    {
        const std::string& uri = request.getURI();
        Poco::StringTokenizer split_uri(uri, "/", Poco::StringTokenizer::Options::TOK_IGNORE_EMPTY | Poco::StringTokenizer::Options::TOK_TRIM);

        if (!split_uri.count()) {
            // TODO: Make proper handler for loading default site
            return new BadRequestHandler();
        }

        if (split_uri[0] == "api") {
           return new SPModWeb::ApiRequestHandler;
        }

        return new BadRequestHandler();
    }
} // namespace SPModWeb
