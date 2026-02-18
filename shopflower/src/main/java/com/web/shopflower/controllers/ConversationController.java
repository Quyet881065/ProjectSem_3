package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.ConversationRequest;
import com.web.shopflower.dto.response.ConversationResponse;
import com.web.shopflower.models.Conversation;
import com.web.shopflower.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping()
    ApiResponse<List<ConversationResponse>> myConversations() {
        return ApiResponse.<List<ConversationResponse>>builder()
                .results(conversationService.myConversations())
                .build();
    }
    @GetMapping("/all")
    ApiResponse<List<ConversationResponse>> allConversations(){
        return ApiResponse.<List<ConversationResponse>>builder()
                .results(conversationService.getAllConversations())
                .build();
    }

    @PostMapping("/create")
    ApiResponse<ConversationResponse> createConversation(@RequestBody ConversationRequest request){
        return ApiResponse.<ConversationResponse>builder()
                .results(conversationService.createConversation(request))
                .build();
    }
}

