#pragma once

// POCO
#include <Poco/Net/HTTPServer.h>
#include <Poco/Net/HTTPRequestHandler.h>
#include <Poco/Net/HTTPRequestHandlerFactory.h>
#include <Poco/Net/HTTPServerRequest.h>
#include <Poco/Net/HTTPServerResponse.h>
#include <Poco/Net/ServerSocket.h>
#include <Poco/Net/HTTPServerParams.h>
#include <Poco/Net/HTTPSClientSession.h>
#include <Poco/Util/ServerApplication.h>
#include <Poco/StringTokenizer.h>
#include <Poco/ThreadPool.h>
#include <Poco/StreamCopier.h>
#include <Poco/Crypto/RSADigestEngine.h>
#include <Poco/SHA1Engine.h>
#include <Poco/URI.h>
#include <Poco/UUIDGenerator.h>
#include <Poco/Base64Decoder.h>
#include <Poco/JSON/Stringifier.h>
#include <Poco/JSON/Object.h>
#include <Poco/JSON/Parser.h>
#include <Poco/JSON/Query.h>

// AWS
#include <aws/core/Aws.h>
#include <aws/sns/SNSClient.h>
#include <aws/core/auth/AWSCredentialsProvider.h>
#include <aws/sns/model/ConfirmSubscriptionRequest.h>

// SPModWeb
#include "BadRequestHandler.hpp"
#include "ApiRequestHandler.hpp"
#include "AwsRequestHandler.hpp"
#include "RequestHandlerFactory.hpp"
#include "WebServer.hpp"

//STL
#include <iostream>
#include <vector>
#include <string>