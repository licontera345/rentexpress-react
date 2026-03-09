import { useRef, useEffect, useState } from 'react';
import { FiMessageCircle, FiSend, FiPlus, FiChevronUp, FiChevronDown, FiX, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useSupportChatPage } from '../../hooks/chat/useSupportChatPage';
import { useAuth } from '../../hooks/core/useAuth';
import { getHeadquartersNameLabel } from '../../constants';
import { MESSAGES } from '../../constants';
import { requestNotificationPermission } from '../../utils/chat/browserNotifications';

function getInitials(user) {
  if (!user) return 'U';
  const first = (user.firstName || user.username || '').trim().slice(0, 1).toUpperCase();
  const last = (user.lastName1 || user.lastName2 || '').trim().slice(0, 1).toUpperCase();
  if (first && last) return `${first}${last}`;
  if (first) return first;
  if (user.username) return String(user.username).slice(0, 2).toUpperCase();
  return 'U';
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getConversationDisplayName(conv, isEmployee, clientLabel = 'Cliente') {
  if (!conv) return '';
  if (isEmployee) {
    const name = (conv.userDisplayName || conv.user_display_name || '').trim();
    const phone = (conv.userPhone || conv.user_phone || '').trim();
    if (name && phone) return `${name} (${phone})`;
    if (name) return name;
    if (phone) return phone;
    const label = clientLabel || 'Cliente';
    return conv.conversationId != null ? `${label} #${conv.conversationId}` : label;
  }
  const empName = (conv.employeeDisplayName || conv.employee_display_name || '').trim();
  return empName || (conv.conversationId != null ? `#${conv.conversationId}` : '');
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showList, setShowList] = useState(true);
  /** 'conversations' | 'headquarters' | 'employees' */
  const [listStep, setListStep] = useState('conversations');

  const { user } = useAuth();
  const {
    state: {
      conversations,
      selectedId,
      selectedConversation,
      messages,
      isEmployee,
      headquarters,
      employees,
      phoneSearch,
      totalUnreadCount,
      hasMoreMessages,
      otherPartyTyping,
    },
    ui: { loading, loadingMessages, creating, loadingEmployees, searchingPhone, closingId, error },
    actions: {
      loadConversations,
      loadHeadquarters,
      setSelectedHeadquartersId,
      handleCreateWithEmployee,
      handleSelectConversation,
      handleCloseConversation,
      loadMoreMessages,
      setError,
      setPhoneSearch,
      handleSearchByPhone,
    },
    sendMessage,
    sendTyping,
    connected,
  } = useSupportChatPage({ pollingInterval: isOpen ? 30000 : 0 });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTrueTimeoutRef = useRef(null);
  const typingFalseTimeoutRef = useRef(null);

  const myInitials = getInitials(user);

  useEffect(() => {
    if (messages.length) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && showList && !isEmployee) {
      loadHeadquarters();
    }
  }, [isOpen, showList, isEmployee, loadHeadquarters]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    requestNotificationPermission();
    if (selectedId) setShowList(false);
    else {
      setShowList(true);
      setListStep('conversations');
    }
    loadConversations();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBack = () => {
    if (showList) {
      if (listStep === 'employees') {
        setListStep('headquarters');
        setSelectedHeadquartersId(null);
      } else if (listStep === 'headquarters') {
        setListStep('conversations');
      } else {
        setShowList(false);
      }
    } else {
      setShowList(true);
      setListStep('conversations');
    }
  };

  const handleSelectConv = (id) => {
    handleSelectConversation(id);
    setShowList(false);
  };

  const handleStartChat = () => {
    setListStep('headquarters');
  };

  const handleSelectHeadquarters = (hqId) => {
    setSelectedHeadquartersId(hqId);
    setListStep('employees');
  };

  const handleSelectEmployee = async (employeeId) => {
    await handleCreateWithEmployee(employeeId);
    setShowList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input?.value?.trim() || !sendMessage) return;
    sendMessage(input.value.trim());
    input.value = '';
    if (sendTyping) sendTyping(false);
    if (typingFalseTimeoutRef.current) clearTimeout(typingFalseTimeoutRef.current);
    if (typingTrueTimeoutRef.current) clearTimeout(typingTrueTimeoutRef.current);
    typingFalseTimeoutRef.current = null;
    typingTrueTimeoutRef.current = null;
  };

  const handleInputChange = () => {
    if (!sendTyping || !connected) return;
    if (typingTrueTimeoutRef.current) clearTimeout(typingTrueTimeoutRef.current);
    if (typingFalseTimeoutRef.current) clearTimeout(typingFalseTimeoutRef.current);
    typingTrueTimeoutRef.current = setTimeout(() => {
      sendTyping(true);
      typingTrueTimeoutRef.current = null;
    }, 300);
    typingFalseTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
      typingFalseTimeoutRef.current = null;
    }, 2500);
  };

  const handleInputBlur = () => {
    if (sendTyping) sendTyping(false);
    if (typingTrueTimeoutRef.current) clearTimeout(typingTrueTimeoutRef.current);
    if (typingFalseTimeoutRef.current) clearTimeout(typingFalseTimeoutRef.current);
    typingTrueTimeoutRef.current = null;
    typingFalseTimeoutRef.current = null;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearchByPhone();
  };

  const statusLabel = (status) => {
    if (status === 'OPEN') return MESSAGES.CHAT_STATUS_OPEN;
    if (status === 'IN_PROGRESS') return MESSAGES.CHAT_STATUS_IN_PROGRESS;
    if (status === 'CLOSED') return MESSAGES.CHAT_STATUS_CLOSED;
    return status || '';
  };

  const getHeaderTitle = () => {
    if (!showList) return getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_TITLE;
    if (listStep === 'headquarters') return MESSAGES.CHAT_HEADQUARTERS;
    if (listStep === 'employees') return MESSAGES.CHAT_EMPLOYEES;
    return MESSAGES.CHAT_TITLE;
  };

  if (!user) return null;

  return (
    <div className="chat-widget" aria-live="polite">
      {isOpen && (
        <div className="chat-widget-panel">
          <header className="chat-widget-header">
            {showList && listStep === 'conversations' ? (
              <>
                <span className="chat-widget-header-title">{getHeaderTitle()}</span>
                <button
                  type="button"
                  className="chat-widget-header-close"
                  onClick={handleClose}
                  aria-label={MESSAGES.CLOSE}
                >
                  <FiX aria-hidden />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="chat-widget-header-back"
                  onClick={handleBack}
                  aria-label={MESSAGES.CHAT_BACK}
                >
                  <FiArrowLeft aria-hidden />
                </button>
                <div className="chat-widget-header-identity">
                  <span className="chat-widget-avatar chat-widget-avatar--support" aria-hidden>
                    {(showList ? getHeaderTitle() : getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="chat-widget-header-info">
                    <span className="chat-widget-header-name">{getHeaderTitle()}</span>
                    {!showList && (
                      <span className={`chat-widget-header-status ${connected ? 'is-connected' : ''}`}>
                        <span className="chat-widget-header-dot" aria-hidden />
                        {connected ? MESSAGES.CHAT_CONNECTED : MESSAGES.CHAT_DISCONNECTED}
                      </span>
                    )}
                  </div>
                </div>
                {listStep === 'conversations' ? (
                  <button
                    type="button"
                    className="chat-widget-header-close"
                    onClick={handleClose}
                    aria-label={MESSAGES.CLOSE}
                  >
                    <FiX aria-hidden />
                  </button>
                ) : (
                  <span className="chat-widget-header-title" style={{ width: '2.25rem' }} />
                )}
              </>
            )}
          </header>

          {error && (
            <div className="chat-widget-alert">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} aria-label={MESSAGES.CLOSE}>
                ×
              </button>
            </div>
          )}

          {showList ? (
            <div className="chat-widget-list">
              {listStep === 'conversations' && (
                <>
                  {isEmployee ? (
                    <form className="chat-widget-phone-search" onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        className="chat-widget-phone-input"
                        placeholder={MESSAGES.CHAT_SEARCH_PHONE_PLACEHOLDER}
                        value={phoneSearch}
                        onChange={(e) => setPhoneSearch(e.target.value)}
                        aria-label={MESSAGES.CHAT_SEARCH_BY_PHONE}
                      />
                      <button
                        type="submit"
                        className="chat-widget-phone-btn"
                        disabled={searchingPhone || !phoneSearch?.trim()}
                        aria-label={MESSAGES.CHAT_SEARCH_BY_PHONE}
                      >
                        <FiSearch aria-hidden />
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="chat-widget-new-btn"
                      onClick={handleStartChat}
                    >
                      <FiPlus aria-hidden />
                      <span>{MESSAGES.CHAT_START_CHAT}</span>
                    </button>
                  )}

                  {loading ? (
                    <p className="chat-widget-loading">{MESSAGES.CHAT_LOADING}</p>
                  ) : conversations.length === 0 ? (
                    <p className="chat-widget-empty">{MESSAGES.CHAT_EMPTY}</p>
                  ) : (
                    <ul className="chat-widget-conv-list">
                      {conversations.map((conv) => (
                        <li key={conv.conversationId}>
                          <button
                            type="button"
                            className="chat-widget-conv-item"
                            onClick={() => handleSelectConv(conv.conversationId)}
                          >
                            <span className="chat-widget-conv-name">{getConversationDisplayName(conv, isEmployee, MESSAGES.CHAT_CLIENT_LABEL)}</span>
                            <span className="chat-widget-conv-meta">
                              {(isEmployee ? conv.employeeUnreadCount : conv.userUnreadCount) > 0 && (
                                <span className="chat-widget-conv-unread">
                                  {isEmployee ? conv.employeeUnreadCount : conv.userUnreadCount}
                                </span>
                              )}
                              <span className="chat-widget-conv-status">{statusLabel(conv.status)}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {listStep === 'headquarters' && (
                <>
                  <p className="chat-widget-list-hint">{MESSAGES.CHAT_SELECT_HEADQUARTER}</p>
                  {headquarters.length === 0 ? (
                    <p className="chat-widget-loading">{MESSAGES.CHAT_LOADING}</p>
                  ) : (
                    <ul className="chat-widget-conv-list">
                      {headquarters.map((hq) => (
                        <li key={hq.headquartersId || hq.id}>
                          <button
                            type="button"
                            className="chat-widget-conv-item"
                            onClick={() => handleSelectHeadquarters(hq.headquartersId ?? hq.id)}
                          >
                            <span className="chat-widget-conv-name">{getHeadquartersNameLabel(hq)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {listStep === 'employees' && (
                <>
                  {loadingEmployees ? (
                    <p className="chat-widget-loading">{MESSAGES.CHAT_LOADING}</p>
                  ) : employees.length === 0 ? (
                    <p className="chat-widget-empty">{MESSAGES.CHAT_EMPTY}</p>
                  ) : (
                    <ul className="chat-widget-conv-list">
                      {employees.map((emp) => (
                        <li key={emp.employeeId ?? emp.id}>
                          <button
                            type="button"
                            className="chat-widget-conv-item"
                            onClick={() => handleSelectEmployee(emp.employeeId ?? emp.id)}
                            disabled={creating}
                          >
                            <span className="chat-widget-conv-name">
                              {emp.firstName || emp.username ? `${emp.firstName || ''} ${emp.lastName1 || ''}`.trim() || emp.username : `#${emp.employeeId ?? emp.id}`}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              {isEmployee && selectedConversation && selectedConversation.status !== 'CLOSED' && (
                <div className="chat-widget-actions">
                  <button
                    type="button"
                    className="chat-widget-close-btn"
                    onClick={() => handleCloseConversation(selectedId)}
                    disabled={closingId === selectedId}
                    aria-label={MESSAGES.CHAT_CLOSE_CONVERSATION}
                  >
                    {MESSAGES.CHAT_CLOSE_CONVERSATION}
                  </button>
                </div>
              )}
              <div className="chat-widget-messages" aria-live="polite" aria-label={MESSAGES.CHAT_EMPTY_MESSAGES}>
                {hasMoreMessages && messages.length > 0 && (
                  <div className="chat-widget-load-more-wrap">
                    <button
                      type="button"
                      className="chat-widget-load-more"
                      onClick={loadMoreMessages}
                      aria-label={MESSAGES.CHAT_LOAD_MORE_MESSAGES}
                    >
                      {MESSAGES.CHAT_LOAD_MORE_MESSAGES}
                    </button>
                  </div>
                )}
                {loadingMessages ? (
                  <p className="chat-widget-loading">{MESSAGES.LOADING}</p>
                ) : messages.length === 0 ? (
                  <p className="chat-widget-empty">{MESSAGES.CHAT_EMPTY_MESSAGES}</p>
                ) : (
                  messages.map((msg) => {
                    const isMe =
                      (msg.senderType === 'USER' && !isEmployee) ||
                      (msg.senderType === 'EMPLOYEE' && isEmployee);
                    return (
                      <div
                        key={msg.messageId || `${msg.createdAt}-${msg.body?.slice(0, 8)}`}
                        className={`chat-widget-bubble-wrap ${isMe ? 'is-mine' : 'is-theirs'}`}
                      >
                        {!isMe && (
                          <span className="chat-widget-avatar chat-widget-avatar--theirs" aria-hidden>
                            {(getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT).slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className={`chat-widget-bubble ${isMe ? 'is-mine' : 'is-theirs'}`}>
                          <span className="chat-widget-bubble-sender">
                            {isMe ? MESSAGES.CHAT_YOU : (getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT)}
                          </span>
                          <p className="chat-widget-bubble-body">{msg.body}</p>
                          <span className="chat-widget-bubble-time">{formatMessageTime(msg.createdAt)}</span>
                        </div>
                        {isMe && (
                          <span className="chat-widget-avatar chat-widget-avatar--mine" aria-hidden>
                            {myInitials}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} aria-hidden />
              </div>

              {otherPartyTyping && (
                <p className="chat-widget-typing" aria-live="polite">
                  {getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT} {MESSAGES.CHAT_TYPING}
                </p>
              )}

              <form className="chat-widget-form" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-widget-input"
                  placeholder={MESSAGES.CHAT_PLACEHOLDER}
                  aria-label={MESSAGES.CHAT_PLACEHOLDER}
                  disabled={!connected}
                  maxLength={2000}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <button
                  type="submit"
                  className="chat-widget-send"
                  disabled={!connected}
                  aria-label={MESSAGES.CHAT_SEND}
                >
                  <FiSend aria-hidden />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className={`chat-widget-fab ${isOpen ? 'is-open' : ''}`}
        onClick={isOpen ? handleClose : handleOpen}
        aria-expanded={isOpen}
        aria-label={isOpen ? MESSAGES.CLOSE : MESSAGES.CHAT_TITLE}
      >
        {isOpen ? <FiChevronDown aria-hidden /> : <FiMessageCircle aria-hidden />}
        {totalUnreadCount > 0 && (
          <span className="chat-widget-fab-badge" aria-label={`${totalUnreadCount} ${MESSAGES.CHAT_UNREAD}`}>
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default ChatWidget;
