package com.web.shopflower.service.impl;

import com.web.shopflower.dto.request.ConversationRequest;
import com.web.shopflower.dto.response.ConversationResponse;
import com.web.shopflower.dto.response.UserProFileResponse;
import com.web.shopflower.models.ChatMessageEntity;
import com.web.shopflower.models.Conversation;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.ChatMessageRepository;
import com.web.shopflower.repository.ConversationRepository;
import com.web.shopflower.repository.UserRepository;
import com.web.shopflower.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ConversationResponse createConversation(ConversationRequest request) {

        if (request.getParticipantIds() == null || request.getParticipantIds().size() != 2) {
            throw new RuntimeException("Conversation must have exactly 2 participants");
        }

        String currentUserId =
                SecurityContextHolder.getContext().getAuthentication().getName();

        var user1 = userRepository.findById(request.getParticipantIds().get(0))
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        var user2 = userRepository.findById(request.getParticipantIds().get(1))
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        boolean user1IsAdmin = user1.getRoles()
                .stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN"));

        boolean user2IsAdmin = user2.getRoles()
                .stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase("ADMIN"));

        if (user1IsAdmin == user2IsAdmin) {
            throw new RuntimeException("Conversation must be between USER and ADMIN");
        }

        String adminId = user1IsAdmin ? user1.getId() : user2.getId();
        String userId  = user1IsAdmin ? user2.getId() : user1.getId();

        if (!currentUserId.equals(adminId) && !currentUserId.equals(userId)) {
            throw new RuntimeException("You are not allowed to create this conversation");
        }

        Conversation conversation = conversationRepository
                .findByAdmin_IdAndUser_Id(adminId, userId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setAdmin(userRepository.findById(adminId)
                            .orElseThrow(() -> new RuntimeException("Admin not found")));
                    c.setUser(userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found")));
                    c.setCreatedDate(Instant.now());
                    c.setModifiedDate(Instant.now());
                    return conversationRepository.save(c);
                });

        // 👉 xác định sender (người còn lại)
        var senderEntity = currentUserId.equals(conversation.getAdmin().getId())
                ? conversation.getUser()
                : conversation.getAdmin();

        UserProFileResponse sender = UserProFileResponse.builder()
                .id(senderEntity.getId())
                .fullName(senderEntity.getFullName())
                .build();

        return ConversationResponse.builder()
                .id(conversation.getId())
                .conversationName(sender.getFullName())
                .conversationAvatar(sender.getAvatar())
                .sender(sender)
                .createdDate(conversation.getCreatedDate())
                .modifiedDate(conversation.getModifiedDate())
                .build();
    }

    @Override
    public List<ConversationResponse> getAllConversations() {

        List<Conversation> conversations =
                conversationRepository.findAllByOrderByModifiedDateDesc();

        return conversations.stream().map(conversation -> {

            UserEntity user = conversation.getUser();

            //  message cuối
            ChatMessageEntity lastMessage = chatMessageRepository
                    .findTopByConversation_IdOrderByCreatedDateDesc(conversation.getId())
                    .orElse(null);

            // sender của message cuối
            UserProFileResponse sender = null;
            if (lastMessage != null) {
                UserEntity senderEntity = lastMessage.getSender();
                sender = UserProFileResponse.builder()
                        .id(senderEntity.getId())
                        .fullName(senderEntity.getFullName())
                        .build();
            }

            return ConversationResponse.builder()
                    .id(conversation.getId())
                    // hiển thị user ở phía admin
                    .conversationName(user.getFullName())
                    .createdDate(conversation.getCreatedDate())
                    .modifiedDate(conversation.getModifiedDate())
                    .message(lastMessage.getMessage())
                    .sender(sender)
                    .build();

        }).toList();
    }



    @Override
    public List<ConversationResponse> myConversations(){
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Conversation> conversations = conversationRepository.findByUser_IdOrderByModifiedDateDesc(userId);
        return conversations.stream()
                .map(c -> ConversationResponse.builder()
                        .id(c.getId())
                        .createdDate(c.getCreatedDate())
                        .modifiedDate(c.getModifiedDate())
                        .build())
                .toList();
    }

    @Override
    public Conversation findById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() ->
                        new RuntimeException("Conversation not found: " + conversationId)
                );
    }
}
