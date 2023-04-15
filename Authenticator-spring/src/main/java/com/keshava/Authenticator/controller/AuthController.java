package com.keshava.Authenticator.controller;

import com.keshava.Authenticator.dto.*;
import com.keshava.Authenticator.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest) {
        authService.signup(registerRequest);
        return new ResponseEntity<>("User Registration Successful", HttpStatus.OK);
    }
    @GetMapping("/accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        return new ResponseEntity<>("Account activated successfully",HttpStatus.OK);
    }
    @PostMapping("/login")
    public AuthenticationResponse login (@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/login/facebook")

    public AuthenticationResponse loginFaceBook(@RequestBody FBloginVerificationRequest faceBookLoginRequest) {
        return authService.VerifyFaceBookAccessKey(faceBookLoginRequest);
    }

    @PostMapping("/login/google")
    public AuthenticationResponse loginGoogle(@RequestBody GoogleAutheticateRequest googleAutheticateRequest) {
        return authService.verifyGoogleToken(googleAutheticateRequest);
    }

}
