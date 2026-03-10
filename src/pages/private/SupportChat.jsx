import { useRef, useEffect, useState } from 'react';
import { FiMessageCircle, FiSend, FiPlus, FiArrowLeft, FiSearch } from 'react-icons/fi';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { useSupportChatPage } from '../../hooks/chat/useSupportChatPage';
import { getHeadquartersNameLabel } from '../../constants';
import { MESSAGES } from '../../constants';

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

function SupportChat() {
  const [listStep, setListStep] = useState('conversations');
  const {
    state: {
      conversations,
      selectedId,
      selectedConversation,
      messages,
      isEmployee,
      headquarters,
      selectedHeadquartersId: _selectedHeadquartersId,
      employees,
      phoneSearch,
      employeesForAssign,
      hasMoreMessages,
      otherPartyTyping,
    },
    ui: { loading, loadingMessages, creating, loadingEmployees, searchingPhone, closingId, assigningId, error },
    actions: {
      loadHeadquarters,
      setSelectedHeadquartersId,
      handleCreateWithEmployee,
      handleSelectConversation,
      setError,
      setPhoneSearch,
      handleSearchByPhone,
      handleCloseConversation,
      loadEmployeesForAssign,
      handleAssignEmployee,
      loadMoreMessages,
    },
    sendMessage,
    sendTyping,
    connected,
  } = useSupportChatPage({ pollingInterval: 30000 });

  const [assignEmployeeId, setAssignEmployeeId] = useState('');

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const typingTrueTimeoutRef = useRef(null);
  const typingFalseTimeoutRef = useRef(null);

  useEffect(() => {
    if (listStep === 'headquarters') loadHeadquarters();
  }, [listStep, loadHeadquarters]);

  useEffect(() => {
    if (isEmployee && selectedId) loadEmployeesForAssign();
  }, [isEmployee, selectedId, loadEmployeesForAssign]);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <PrivateLayout>
      <section className="support-chat personal-space">
        <header className="support-chat-header page-header">
          <div className="support-chat-header-inner">
            <span className="support-chat-icon" aria-hidden>
              <FiMessageCircle />
            </span>
            <div>
              <h1>{MESSAGES.CHAT_TITLE}</h1>
              <p>{MESSAGES.CHAT_SUBTITLE}</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="support-chat-alert alert alert-error" role="alert">
            <span>{error}</span>
            <button type="button" className="alert-close" onClick={() => setError(null)} aria-label={MESSAGES.CLOSE}>
              ×
            </button>
          </div>
        )}

        <div className="support-chat-layout">
          <aside className="support-chat-sidebar">
            {listStep === 'conversations' && (
              <>
                {isEmployee ? (
                  <form className="support-chat-phone-search" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      className="support-chat-phone-input"
                      placeholder={MESSAGES.CHAT_SEARCH_PHONE_PLACEHOLDER}
                      value={phoneSearch}
                      onChange={(e) => setPhoneSearch(e.target.value)}
                      aria-label={MESSAGES.CHAT_SEARCH_BY_PHONE}
                    />
                    <button
                      type="submit"
                      className="support-chat-phone-btn btn btn-secondary"
                      disabled={searchingPhone || !phoneSearch?.trim()}
                      aria-label={MESSAGES.CHAT_SEARCH_BY_PHONE}
                    >
                      <FiSearch aria-hidden />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="support-chat-new-btn btn btn-primary"
                    onClick={() => setListStep('headquarters')}
                  >
                    <FiPlus aria-hidden />
                    <span>{MESSAGES.CHAT_START_CHAT}</span>
                  </button>
                )}

                {loading ? (
                  <div className="support-chat-loading">
                    <span>{MESSAGES.CHAT_LOADING}</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="support-chat-empty-list">
                    <FiMessageCircle aria-hidden />
                    <p>{MESSAGES.CHAT_EMPTY}</p>
                  </div>
                ) : (
                  <ul className="support-chat-conversation-list">
                    {conversations.map((conv) => (
                      <li key={conv.conversationId}>
                        <button
                          type="button"
                          className={`support-chat-conv-item ${selectedId === conv.conversationId ? 'is-selected' : ''}`}
                          onClick={() => {
                            handleSelectConversation(conv.conversationId);
                            setAssignEmployeeId('');
                          }}
                        >
                          <span className="support-chat-conv-name">{getConversationDisplayName(conv, isEmployee, MESSAGES.CHAT_CLIENT_LABEL)}</span>
                          <span className="support-chat-conv-status">{statusLabel(conv.status)}</span>
                          {(isEmployee ? conv.employeeUnreadCount : conv.userUnreadCount) > 0 && (
                            <span className="support-chat-conv-unread">{isEmployee ? conv.employeeUnreadCount : conv.userUnreadCount}</span>
                          )}
                          {conv.updatedAt && (
                            <span className="support-chat-conv-date">
                              {new Date(conv.updatedAt).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {listStep === 'headquarters' && (
              <>
                <button
                  type="button"
                  className="support-chat-back-btn btn btn-ghost"
                  onClick={() => setListStep('conversations')}
                >
                  <FiArrowLeft aria-hidden />
                  <span>{MESSAGES.CHAT_BACK}</span>
                </button>
                <p className="support-chat-hint">{MESSAGES.CHAT_SELECT_HEADQUARTER}</p>
                {!headquarters?.length ? (
                  <div className="support-chat-loading"><span>{MESSAGES.CHAT_LOADING}</span></div>
                ) : (
                  <ul className="support-chat-conversation-list">
                    {headquarters.map((hq) => (
                      <li key={hq.headquartersId || hq.id}>
                        <button
                          type="button"
                          className="support-chat-conv-item"
                          onClick={() => {
                            setSelectedHeadquartersId(hq.headquartersId ?? hq.id);
                            setListStep('employees');
                          }}
                        >
                          <span className="support-chat-conv-name">{getHeadquartersNameLabel(hq)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {listStep === 'employees' && (
              <>
                <button
                  type="button"
                  className="support-chat-back-btn btn btn-ghost"
                  onClick={() => { setListStep('headquarters'); setSelectedHeadquartersId(null); }}
                >
                  <FiArrowLeft aria-hidden />
                  <span>{MESSAGES.CHAT_BACK}</span>
                </button>
                {loadingEmployees ? (
                  <div className="support-chat-loading"><span>{MESSAGES.CHAT_LOADING}</span></div>
                ) : !employees?.length ? (
                  <div className="support-chat-empty-list"><p>{MESSAGES.CHAT_EMPTY}</p></div>
                ) : (
                  <ul className="support-chat-conversation-list">
                    {employees.map((emp) => (
                      <li key={emp.employeeId ?? emp.id}>
                        <button
                          type="button"
                          className="support-chat-conv-item"
                          onClick={async () => {
                            await handleCreateWithEmployee(emp.employeeId ?? emp.id);
                            setListStep('conversations');
                          }}
                          disabled={creating}
                        >
                          <span className="support-chat-conv-name">
                            {emp.firstName || emp.username ? `${emp.firstName || ''} ${emp.lastName1 || ''}`.trim() || emp.username : `#${emp.employeeId ?? emp.id}`}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </aside>

          <div className="support-chat-main">
            {!selectedId ? (
              <div className="support-chat-welcome">
                <div className="support-chat-welcome-icon">
                  <FiMessageCircle />
                </div>
                <p>{MESSAGES.CHAT_EMPTY_SELECT}</p>
              </div>
            ) : (
              <>
                <div className="support-chat-main-header">
                  <span className="support-chat-main-title">
                    {getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || `#${selectedId}`}
                    {selectedConversation && (
                      <span className="support-chat-main-status">{statusLabel(selectedConversation.status)}</span>
                    )}
                  </span>
                  <span className={`support-chat-connection-badge ${connected ? 'is-connected' : ''}`}>
                    {connected ? MESSAGES.CHAT_CONNECTED : MESSAGES.CHAT_DISCONNECTED}
                  </span>
                </div>

                {isEmployee && selectedConversation && selectedConversation.status !== 'CLOSED' && (
                  <div className="support-chat-actions chat-widget-actions">
                    <button
                      type="button"
                      className="chat-widget-close-btn"
                      onClick={() => handleCloseConversation(selectedId)}
                      disabled={closingId === selectedId}
                      aria-label={MESSAGES.CHAT_CLOSE_CONVERSATION}
                    >
                      {MESSAGES.CHAT_CLOSE_CONVERSATION}
                    </button>
                    {employeesForAssign?.length > 0 && (
                      <div className="support-chat-assign-row">
                        <label htmlFor="support-chat-assign-select" className="support-chat-assign-label">
                          {MESSAGES.CHAT_ASSIGN_TO}:
                        </label>
                        <select
                          id="support-chat-assign-select"
                          className="support-chat-assign-select"
                          value={assignEmployeeId}
                          onChange={(e) => setAssignEmployeeId(e.target.value)}
                          disabled={assigningId === selectedId}
                          aria-label={MESSAGES.CHAT_ASSIGN_EMPLOYEE}
                        >
                          <option value="">—</option>
                          {employeesForAssign.map((emp) => (
                            <option key={emp.employeeId ?? emp.id} value={emp.employeeId ?? emp.id}>
                              {[emp.firstName, emp.lastName1].filter(Boolean).join(' ') || emp.username || `#${emp.employeeId ?? emp.id}`}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-secondary support-chat-assign-btn"
                          disabled={!assignEmployeeId || assigningId === selectedId}
                          onClick={async () => {
                            const eid = parseInt(assignEmployeeId, 10);
                            if (Number.isNaN(eid)) return;
                            await handleAssignEmployee(selectedId, eid);
                            setAssignEmployeeId('');
                          }}
                        >
                          {assigningId === selectedId ? MESSAGES.LOADING : MESSAGES.CHAT_ASSIGN_EMPLOYEE}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesContainerRef} className="support-chat-messages" aria-live="polite" aria-label={MESSAGES.CHAT_EMPTY_MESSAGES}>
                  {hasMoreMessages && messages.length > 0 && (
                    <div className="support-chat-load-more-wrap chat-widget-load-more-wrap">
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
                    <div className="support-chat-loading support-chat-loading-inline">
                      <span>{MESSAGES.LOADING}</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="support-chat-messages-empty">{MESSAGES.CHAT_EMPTY_MESSAGES}</p>
                  ) : (
                    messages.map((msg) => {
                      const isMe =
                        (msg.senderType === 'USER' && !isEmployee) || (msg.senderType === 'EMPLOYEE' && isEmployee);
                      return (
                        <div
                          key={msg.messageId || `${msg.createdAt}-${msg.body?.slice(0, 8)}`}
                          className={`support-chat-bubble ${isMe ? 'is-mine' : 'is-theirs'}`}
                        >
                          <span className="support-chat-bubble-sender">
                            {isMe ? MESSAGES.CHAT_YOU : (getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT)}
                          </span>
                          <p className="support-chat-bubble-body">{msg.body}</p>
                          {msg.createdAt && (
                            <span className="support-chat-bubble-time">{formatMessageTime(msg.createdAt)}</span>
                          )}
                        </div>
                      );
                    })
                  )}
                  <span aria-hidden />
                </div>

                {otherPartyTyping && (
                  <p className="support-chat-typing chat-widget-typing" aria-live="polite">
                    {getConversationDisplayName(selectedConversation, isEmployee, MESSAGES.CHAT_CLIENT_LABEL) || MESSAGES.CHAT_SUPPORT} {MESSAGES.CHAT_TYPING}
                  </p>
                )}

                <form className="support-chat-form" onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    className="support-chat-input"
                    placeholder={MESSAGES.CHAT_PLACEHOLDER}
                    aria-label={MESSAGES.CHAT_PLACEHOLDER}
                    disabled={!connected}
                    maxLength={2000}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  <button
                    type="submit"
                    className="support-chat-send-btn btn btn-primary"
                    disabled={!connected}
                    aria-label={MESSAGES.CHAT_SEND}
                  >
                    <FiSend aria-hidden />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </PrivateLayout>
  );
}

export default SupportChat;
