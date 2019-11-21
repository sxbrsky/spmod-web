#include "spmodweb.hpp"

namespace SPModWeb
{
    void WebServer::initialize(Poco::Util::Application& self) {
        loadConfiguration();
        Poco::Util::ServerApplication::initialize(self);
    }

    int WebServer::main(const std::vector<std::string> &args) {
        Poco::UInt16 port = static_cast<Poco::UInt16>(config().getUInt("port", 8080));
        Poco::Net::ServerSocket serverSocket(port);
        Poco::ThreadPool threadPool(12, 32);
        Poco::Net::HTTPServerParams* serverParams = new Poco::Net::HTTPServerParams();
#if defined NDEBUG
        logger().setLevel(Poco::Message::PRIO_INFORMATION);
#else
        logger().setLevel(Poco::Message::PRIO_DEBUG);
#endif

        // TODO: Change version when building
        serverParams->setSoftwareVersion("SPModWeb/0.1.0");

        Poco::Net::HTTPServer srv(new SPModWeb::RequestHandlerFactory, threadPool, serverSocket, serverParams);

        srv.start();
        logger().information("Server started");
        waitForTerminationRequest();
        logger().information("Stopped Server");
        srv.stop();

        return Poco::Util::Application::EXIT_OK;
    }
}

POCO_SERVER_MAIN(SPModWeb::WebServer);