package com.keshava.Authenticator.repository;

import com.keshava.Authenticator.modal.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken,Long> {
    Optional<VerificationToken> findByToken(String token);

}
