package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.ChatMessageRequest;
import com.web.shopflower.dto.response.ChatMessageResponse;
import com.web.shopflower.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @GetMapping()
    ApiResponse<List<ChatMessageResponse>> getChatMessage(@RequestParam("conversationId") String conversationId){
        return ApiResponse.<List<ChatMessageResponse>>builder()
                .results(chatMessageService.getMessage(conversationId))
                .build();
    }
    @PostMapping("/create")
    ApiResponse<ChatMessageResponse> create(@RequestBody ChatMessageRequest request){
        return ApiResponse.<ChatMessageResponse>builder()
                .results(chatMessageService.create(request))
                .build();
    }
}
