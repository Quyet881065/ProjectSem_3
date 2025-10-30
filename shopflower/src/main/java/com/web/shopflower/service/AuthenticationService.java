package com.web.shopflower.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.AuthenticationRequest;
import com.web.shopflower.dto.request.RefreshRequest;
import com.web.shopflower.dto.response.AuthenticationResponse;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
public class AuthenticationService {
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<AuthenticationResponse> authentication(AuthenticationRequest request){
        ApiResponse<AuthenticationResponse> response = new ApiResponse<>();
       try{
           UserEntity userEntity = userRepository.findByUserName(request.getUsername())
                   .orElseThrow(() -> new RuntimeException("User not exists"));
           PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
           boolean authentication = passwordEncoder.matches(request.getPassword(), userEntity.getPassWord());
           log.info("username request:{}", request.getUsername());
           log.info("username entity:{}", userEntity.getUserName());
           if(!authentication){
               response.setMessage("Wrong password . Please try again");
               response.setStatusCode(401);
               response.setResults(null);
               return response;
           }

           // ✅ Kiểm tra quyền
           String role = buildScope(userEntity);
//           if (!role.equals("ROLE_ADMIN")) {
//               response.setMessage("You do not have permission to access admin panel");
//               response.setStatusCode(403); // Forbidden
//               return response;
//           }

           String token = generateToken(userEntity, VALID_DURATION);
           AuthenticationResponse auth = new AuthenticationResponse();
           auth.setToken(token);
           auth.setUserId(userEntity.getId());
           auth.setRole(role);
           auth.setExpiryTime(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS));
           response.setMessage("Log in successfully");
           response.setStatusCode(200);
           response.setResults(auth);
           return response;
       }catch(RuntimeException e){
           if(e.getMessage().equals("User not exists")){
               response.setMessage("Account does not exists");
               response.setStatusCode(404);
           }else{
               response.setMessage("User authentication error");
               response.setStatusCode(400);
           }
           response.setResults(null);
           return response;
       }
    }

    private String generateToken(UserEntity user, long durationSeconds){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("flower.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(durationSeconds, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("role", buildScope(user))
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

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        // xac minh token cu
        SignedJWT signedJWT = verifyToken(request.getToken(), true);
        // lay thong tin tu token cu
        String userId = signedJWT.getJWTClaimsSet().getSubject();
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        // kiem tra thoi gian co trong khoang refreshable khong
        Instant refreshableUntil = expiryTime.toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS);
        log.info("user id : {}",userId);
        log.info("jit :{}",jit);
        log.info("refresh unit : {}", refreshableUntil);
        if(Instant.now().isAfter(refreshableUntil)){
            throw new RuntimeException("Token is expired and cannot be refreshed anymore");
        }
        // lay lai thong tin nguoi dung tu db
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found for token refresh"));
        // tao token moi
        String newToken = generateToken(userEntity, REFRESHABLE_DURATION);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(newToken);
        response.setExpiryTime(refreshableUntil);
        return response;
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = (isRefresh) ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                                      : signedJWT.getJWTClaimsSet().getExpirationTime();
        if(!(expiryTime.after(new Date()))) throw new RuntimeException("unauthenticated");
        log.info("expiry time :{}", expiryTime);
        log.info("signed :{}",signedJWT);
        log.info("verifier : {}",verifier);
        return signedJWT;
    }

    private String buildScope(UserEntity userEntity){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(userEntity.getRoles())){
            userEntity.getRoles().forEach(roleEntity -> {
                stringJoiner.add("ROLE_" + roleEntity.getCode());
            });
        }
        return stringJoiner.toString();
    }
}
