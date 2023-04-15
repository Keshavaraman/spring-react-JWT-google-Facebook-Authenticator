package com.keshava.Authenticator.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.keshava.Authenticator.dto.*;
import com.keshava.Authenticator.exceptions.CustomException;
import com.keshava.Authenticator.modal.FacebookUser;
import com.keshava.Authenticator.modal.NotificationEmail;
import com.keshava.Authenticator.modal.User;
import com.keshava.Authenticator.modal.VerificationToken;
import com.keshava.Authenticator.repository.UserRepository;
import com.keshava.Authenticator.repository.VerificationTokenRepository;
import com.keshava.Authenticator.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;
    private final String FACEBOOK_GRAPH_API_BASE = "https://graph.facebook.com";
    private final GoogleIdTokenVerifier verifier;
    private final RestTemplate restTemplate;
    @Value("${app.googleClientId}")
    private String clientId;

    public AuthenticationResponse verifyGoogleToken(GoogleAutheticateRequest googleAutheticateRequest) {
        User account = verifyIDToken(googleAutheticateRequest.getAccessToken());
        if (account == null) {
            throw new IllegalArgumentException();
        }
        User user = userRepository
                .findByEmail(account.getEmail())
                .orElse(null);

        if(user==null) {
            userRepository.save(account);
            user=account;
        }

        String token = jwtProvider.generateTokenUsingUser(user.getUserName());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(user.getUserName())
                .build();

    }

    public AuthenticationResponse VerifyFaceBookAccessKey(FBloginVerificationRequest faceBookLoginRequest) {
        FacebookUser facebookUser = getFbUser(faceBookLoginRequest.getAccessToken());

        if(facebookUser==null)
            throw new CustomException("Invalid Access token");

        User user = userRepository
                .findByEmail(facebookUser.getEmail())
                .orElseGet(()->userRepository.save(createUSerforFaceBook(facebookUser)));

        String token = jwtProvider.generateTokenUsingUser(user.getUserName());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(user.getUserName())
                .build();
    }

    private User createUSerforFaceBook(FacebookUser facebookUser) {
        return User.builder()
                .email(facebookUser.getEmail())
                .created(Instant.now())
                .userName(facebookUser.getFirstName()+" "+facebookUser.getLastName())
                .password("")
                .enabled(true)
                .providers("FB")
                .build();
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUserName(),
                loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String token = jwtProvider.generateToken(authenticate);
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(loginRequest.getUserName())
                .build();
    }

    public void verifyAccount(String token) {
        Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
        fetchUserAndEnable(verificationToken.orElseThrow(() -> new CustomException("Invalid Token")));
    }

    public void signup(RegisterRequest registerRequest) {
        User user = new User();
        user.setUserName(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setCreated(Instant.now());
        user.setEnabled(false);

        userRepository.save(user);

        String token = generateVerificationToken(user);
        mailService.sendMail(new NotificationEmail("Please Activate your Account",
                user.getEmail(), "Thank you for signing up to Spring Reddit, " +
                "please click on the below url to activate your account : " +
                "http://localhost:8080/api/auth/accountVerification/" + token));
    }

    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);

        verificationTokenRepository.save(verificationToken);
        return token;
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build();
    }

    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    private User verifyIDToken(String idToken) {
        try {
            GoogleIdToken idTokenObj = verifier.verify(idToken);
            if (idTokenObj == null) {
                return null;
            }
            User user = new User();
            GoogleIdToken.Payload payload = idTokenObj.getPayload();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String email = payload.getEmail();
            String pictureUrl = (String) payload.get("picture");
            user.setEnabled(true);
            user.setPassword("");
            user.setUserName(firstName+" "+lastName);
            user.setEmail(email);
            user.setProviders("Google");
            user.setCreated(Instant.now());
            return user;
        } catch (GeneralSecurityException | IOException e) {
            return null;
        }
    }

    public FacebookUser getFbUser(String accessToken) {
        var path = "/me?fields={fields}&redirect={redirect}&access_token={access_token}";
        var fields = "email,first_name,last_name,id";
        final Map<String, String> variables = new HashMap<>();
        variables.put("fields", fields);
        variables.put("redirect", "false");
        variables.put("access_token", accessToken);
        return restTemplate
                .getForObject(FACEBOOK_GRAPH_API_BASE + path, FacebookUser.class, variables);
    }

    private void fetchUserAndEnable(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getUserName();
        User user = userRepository.findByUserName(username).orElseThrow(() -> new CustomException("User not found with name - " + username));
        user.setEnabled(true);
        userRepository.save(user);
    }

}
