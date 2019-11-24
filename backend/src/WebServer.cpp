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
        Poco::Crypto::initializeCrypto();

        Aws::LoggingOptions awsLoggingOptions;

// TODO: Asynchronously logging and proper formatting of log messages
#if defined NDEBUG
        logger().setLevel(Poco::Message::PRIO_INFORMATION);
        awsLoggingOptions.logLevel = Aws::Utils::Logging::LogLevel::Info;
#else
        logger().setLevel(Poco::Message::PRIO_DEBUG);
        awsLoggingOptions.logLevel = Aws::Utils::Logging::LogLevel::Debug;
#endif
        Aws::SDKOptions awsSDKOptions;
        awsSDKOptions.loggingOptions = awsLoggingOptions;

        Aws::InitAPI(awsSDKOptions);
        Aws::Client::ClientConfiguration clientConfiguration;
        if (config().has("aws.region")) {
            std::string awsRegion = config().getString("aws.region");
            clientConfiguration.region = Aws::String(awsRegion.c_str(), awsRegion.length());
        }

        Aws::SNS::SNSClient awsSNSClient(Aws::Auth::AWSCredentials(config().getString("aws.sns.accessKeyId"), config().getString("aws.sns.secretKeyId")), clientConfiguration);

        // TODO: Change version when building
        serverParams->setSoftwareVersion("SPModWeb/0.1.0");

        Poco::Net::HTTPServer srv(new SPModWeb::RequestHandlerFactory(awsSNSClient), threadPool, serverSocket, serverParams);

        srv.start();
        logger().information("Server started on %hu", port);
        waitForTerminationRequest();
        logger().information("Stopped Server");
        srv.stop();

        Aws::ShutdownAPI(awsSDKOptions);
        Poco::Crypto::uninitializeCrypto();
        return Poco::Util::Application::EXIT_OK;
    }
}

POCO_SERVER_MAIN(SPModWeb::WebServer);