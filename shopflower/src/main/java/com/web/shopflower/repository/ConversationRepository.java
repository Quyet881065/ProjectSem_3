package com.web.shopflower.repository;


import com.web.shopflower.models.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, String>  {
    // trong getOrCreate
    Optional<Conversation> findByAdmin_IdAndUser_Id( String adminId, String userId);

    //  danh sách conversation cho ADMIN (Dashboard)
    List<Conversation> findAllByOrderByModifiedDateDesc();

    //  Load danh sách conversation cho USER
    List<Conversation> findByUser_IdOrderByModifiedDateDesc(String userId);
    Optional<Conversation> findByUserId(String userId);
}
