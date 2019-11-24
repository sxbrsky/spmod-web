cmake_minimum_required(VERSION 3.15)
project(SPModWeb VERSION 0.1.0)

find_library (POCO_FOUNDATION PocoFoundation)
find_library (POCO_UTIL PocoUtil)
find_library (POCO_NET PocoNet)
find_library (POCO_CRYPTO PocoCrypto)
find_library (POCO_NETSSL PocoNetSSL)
find_library (POCO_JSON PocoJSON)
find_library (AWS_SDK_CORE aws-cpp-sdk-core)
find_library (AWS_SDK_SNS aws-cpp-sdk-sns)
find_library (AWS_SDK_S3 aws-cpp-sdk-s3)
find_library (PTHREAD pthread)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -Wall")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -Wall")
set(CMAKE_BINARY_DIR ${PROJECT_BINARY_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

set(LIBS
    ${POCO_FOUNDATION}
    ${POCO_UTIL}
    ${POCO_NET}
    ${POCO_JSON}
    ${POCO_CRYPTO}
    ${POCO_NETSSL}
    ${PTHREAD}
)

set(AWS_LIBS
    ${AWS_SDK_CORE}
    ${AWS_SDK_SNS}
    ${AWS_SDK_S3}
)

set(SOURCES 
    src/ApiRequestHandler.cpp
    src/RequestHandlerFactory.cpp
    src/AwsRequestHandler.cpp
    src/WebServer.cpp
    src/BadRequestHandler.cpp
)

add_executable(${PROJECT_NAME} ${SOURCES})
target_link_libraries(${PROJECT_NAME} ${LIBS} ${AWS_LIBS})
target_include_directories(${PROJECT_NAME} PRIVATE include)
configure_file("config/${PROJECT_NAME}.json" ${CMAKE_BINARY_DIR} COPYONLY)
