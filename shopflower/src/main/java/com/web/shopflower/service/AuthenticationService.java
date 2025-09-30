package com.web.shopflower.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.AuthenticationRequest;
import com.web.shopflower.dto.response.AuthenticationResponse;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
public class AuthenticationService {
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<AuthenticationResponse> authentication(AuthenticationRequest request){
        UserEntity userEntity = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not exists"));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authentication = passwordEncoder.matches(request.getPassword(), userEntity.getPassWord());
        log.info("username request:{}", request.getUsername());
        log.info("username entity:{}", userEntity.getUserName());
        if(!authentication)
            throw new RuntimeException("authentication");
        String token = generateToken(userEntity);
        AuthenticationResponse auth = new AuthenticationResponse();
        auth.setToken(token);
        auth.setAuthentication(true);

        ApiResponse<AuthenticationResponse> response = new ApiResponse<>();
        response.setResults(auth);
        return response;
    }

    private String generateToken(UserEntity user){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("flower.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try{
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            log.error("Cannot create token");
            throw new RuntimeException(e);
        }
    }
}
