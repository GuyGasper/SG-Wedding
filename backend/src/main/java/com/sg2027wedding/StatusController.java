package com.sg2027wedding;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
class StatusController {
    private final String version;
    StatusController(@Value("${app.version}") String version) { this.version = version; }
    @GetMapping({"", "/", "/status"})
    Status status() { return new Status("SG Wedding API", "UP", version, Instant.now()); }
    record Status(String service, String status, String version, Instant timestamp) {}
}
