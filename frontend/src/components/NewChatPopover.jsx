import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { search as searchUsers } from "../service/userService";

const NewChatPopover = ({ anchorEl, open, onClose, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const response = await searchUsers(query.trim());
      if (response?.data?.results) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleUserSelect = (user) => {
    onSelectUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="absolute z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg"
      style={{
        top: anchorEl?.getBoundingClientRect().bottom + window.scrollY,
        left: anchorEl?.getBoundingClientRect().right - 320 + window.scrollX,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">
          Start a new conversation
        </h3>
      </div>

      {/* Search box */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Start typing to search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-9 pr-8 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            autoFocus
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-h-72 overflow-y-auto px-2 pb-3">
        {loading && (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          </div>
        )}

        {!loading && error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && searchResults.length > 0 && (
          <ul className="space-y-1">
            {searchResults.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={user.avatar || ""}
                  alt={user.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.firstname + " " + user.lastname}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && searchResults.length === 0 && hasSearched && (
          <div className="p-3 text-center text-sm text-gray-500">
            No users found matching "{searchQuery}"
          </div>
        )}

        {!loading && !error && !hasSearched && (
          <div className="p-3 text-center text-sm text-gray-500">
            Search for a user to start a conversation
          </div>
        )}
      </div>
    </div>
  );
};

NewChatPopover.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
};

export default NewChatPopover;
