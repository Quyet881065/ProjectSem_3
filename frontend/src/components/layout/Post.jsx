import React, { forwardRef } from 'react';

export const Post= forwardRef((props, ref) => {
     const { avatarUrl, username, createdDate, content } = props.post;
     return (
      <div ref={ref} className="border p-4 rounded-lg my-4">
      <img src={avatarUrl} alt={username} className="w-12 h-12 rounded-full"/>
      <div>
        <h3 className="font-bold">{username}</h3>
        <p className="text-sm text-gray-500">{createdDate}</p>
        <p>{content}</p>
      </div>
    </div>
     )
})