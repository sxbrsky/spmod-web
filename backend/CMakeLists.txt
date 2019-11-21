cmake_minimum_required(VERSION 3.15)
project(SPModWeb VERSION 0.1.0)


include_directories(include)

find_library (POCO_FOUNDATION PocoFoundation)
find_library (POCO_UTIL PocoUtil)
find_library (POCO_NET PocoNet)
find_library (POCO_JSON PocoJSON)
find_library (PTHREAD pthread)

set(CMAKE_CXX_STANDARD 17)
set( CMAKE_CXX_FLAGS "-Wall -O3 ")
set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

set(LIBS
    ${POCO_FOUNDATION}
    ${POCO_UTIL}
    ${POCO_NET}
    ${POCO_JSON}
    ${PTHREAD}
)

set(SOURCES 
    src/ApiRequestHandler.cpp
    src/RequestHandlerFactory.cpp
    src/WebServer.cpp    
)

add_executable(Server ${SOURCES})
target_link_libraries(Server ${LIBS})