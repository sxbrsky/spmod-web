#include "spmodweb.hpp"

namespace SPModWeb
{
    void ApiRequestHandler::handleRequest(Poco::Net::HTTPServerRequest& request,  Poco::Net::HTTPServerResponse& response)
    {
        std::string method = request.getMethod();
        std::string uri = request.getURI();
        Poco::Util::Application& app = Poco::Util::Application::instance();

        app.logger().information("Request from %s", request.clientAddress().toString());

        if (method == "GET") {
            getAllBuilds(response);
        }
    }
    void ApiRequestHandler::getAllBuilds(Poco::Net::HTTPServerResponse& response)
    {
        response.setChunkedTransferEncoding(true);
        response.setContentType("text/html");

        response.send()
            << "<html>"
            << "<head><title>Hello</title></head>"
            << "<body><h1>Hello from the POCO Web Server</h1></body>"
            << "</html>";
    }
}

