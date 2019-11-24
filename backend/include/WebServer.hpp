#pragma once

#include "spmodweb.hpp"


namespace SPModWeb {
class WebServer : public Poco::Util::ServerApplication {
public:
    void initialize(Poco::Util::Application &self);
    int main(const std::vector<std::string> &args);
};
} // namespace SPMod