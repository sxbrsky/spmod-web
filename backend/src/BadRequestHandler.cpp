#include "spmodweb.hpp"

namespace SPModWeb
{
    void BadRequestHandler::handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response)
    {
        Poco::Util::Application& app = Poco::Util::Application::instance();

        static const std::string message = "Bad request";

        response.setStatusAndReason(Poco::Net::HTTPServerResponse::HTTPStatus::HTTP_BAD_REQUEST, message);
        response.setContentType("text/plain");
        response.sendBuffer(message.data(), message.length());

        app.logger().notice("Bad request %s %s %s", request.getMethod(), request.getURI(), request.clientAddress().toString());
    }
}

