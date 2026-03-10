import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../core/useAuth';
import {
  getMyConversations,
  createConversation,
  getMessages,
  getEmployeesByHeadquarters,
  findConversationByPhone,
  markConversationAsRead,
  updateConversationStatus,
  assignEmployee,
} from '../../api/services/chatService';
import { SedeService } from '../../api/services/CatalogService';
import { useChatSocket } from './useChatSocket';
import {
  requestNotificationPermission,
  showChatNotification,
  isPageHidden,
  playNotificationSound,
} from '../../utils/chat/browserNotifications';
import { MESSAGES } from '../../constants';

export function useSupportChatPage(options = {}) {
  const { token, isEmployee, user } = useAuth();
  const { pollingInterval = 0 } = options;
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [headquarters, setHeadquarters] = useState([]);
  const [selectedHeadquartersId, setSelectedHeadquartersId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneSearchResult, setPhoneSearchResult] = useState(null);
  const [searchingPhone, setSearchingPhone] = useState(false);

  const [employeesForAssign, setEmployeesForAssign] = useState([]);
  const [loadingEmployeesForAssign, setLoadingEmployeesForAssign] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const baseTitleRef = useRef(typeof document !== 'undefined' ? document.title : '');
  const [otherPartyTyping, setOtherPartyTyping] = useState(false);
  const typingClearTimeoutRef = useRef(null);
  const previousUnreadRef = useRef({});

  const selectedConversation = conversations.find((c) => c.conversationId === selectedId);

  const senderDisplayNameRef = useRef('');
  useEffect(() => {
    if (!selectedConversation) {
      senderDisplayNameRef.current = '';
      return;
    }
    if (isEmployee) {
      const name = selectedConversation.userDisplayName || selectedConversation.user_display_name;
      const phone = selectedConversation.userPhone || selectedConversation.user_phone;
      senderDisplayNameRef.current = [name, phone].filter(Boolean).join(' — ') || MESSAGES.CHAT_CLIENT_LABEL || 'Cliente';
    } else {
      senderDisplayNameRef.current = selectedConversation.employeeDisplayName || selectedConversation.employee_display_name || MESSAGES.CHAT_SUPPORT || 'Soporte';
    }
  }, [selectedConversation, isEmployee]);

  const totalUnreadCount = conversations.reduce((sum, c) => {
    const n = isEmployee ? (c.employeeUnreadCount || 0) : (c.userUnreadCount || 0);
    return sum + n;
  }, 0);

  const loadHeadquarters = useCallback(async () => {
    try {
      const data = await SedeService.getAll();
      setHeadquarters(Array.isArray(data) ? data : []);
    } catch {
      setHeadquarters([]);
    }
  }, []);

  const loadEmployeesByHeadquarters = useCallback(async (hqId) => {
    if (!hqId) return;
    setLoadingEmployees(true);
    try {
      const list = await getEmployeesByHeadquarters(hqId);
      setEmployees(Array.isArray(list) ? list : []);
    } catch {
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  const loadConversations = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const list = await getMyConversations();
      const nextList = Array.isArray(list) ? list : [];
      // Notificación cuando hay mensajes nuevos en otra conversación (polling)
      const prev = previousUnreadRef.current;
      const hasPrevious = Object.keys(prev).length > 0;
      if (hasPrevious && selectedId) {
        for (const c of nextList) {
          const cid = c.conversationId;
          if (cid === selectedId) continue;
          const unread = isEmployee ? (c.employeeUnreadCount || 0) : (c.userUnreadCount || 0);
          if (unread > (prev[cid] || 0)) {
            playNotificationSound();
            if (isPageHidden()) {
              const name = isEmployee
                ? (c.userDisplayName || c.user_phone || MESSAGES.CHAT_CLIENT_LABEL)
                : (c.employeeDisplayName || MESSAGES.CHAT_SUPPORT);
              const titleTemplate = MESSAGES.CHAT_NEW_MESSAGE_FROM || 'Nuevo mensaje de {name}';
              requestNotificationPermission().then((permission) => {
                if (permission === 'granted') {
                  showChatNotification(titleTemplate.replace('{name}', name), '');
                }
              });
            }
          }
        }
      }
      const nextUnread = {};
      for (const c of nextList) {
        nextUnread[c.conversationId] = isEmployee ? (c.employeeUnreadCount || 0) : (c.userUnreadCount || 0);
      }
      previousUnreadRef.current = nextUnread;
      setConversations(nextList);
    } catch (e) {
      setError(e?.message || 'Error al cargar conversaciones');
      setConversations([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, isEmployee, selectedId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedHeadquartersId) {
      loadEmployeesByHeadquarters(selectedHeadquartersId);
    } else {
      setEmployees([]);
    }
  }, [selectedHeadquartersId, loadEmployeesByHeadquarters]);

  const handleCreateConversation = useCallback(async () => {
    if (!token || isEmployee) return;
    setCreating(true);
    setError(null);
    try {
      const created = await createConversation();
      if (created?.conversationId) {
        setConversations((prev) => [created, ...prev]);
        setSelectedId(created.conversationId);
      }
    } catch (e) {
      setError(e?.message || 'Error al crear conversación');
    } finally {
      setCreating(false);
    }
  }, [token, isEmployee]);

  const handleCreateWithEmployee = useCallback(
    async (employeeId) => {
      if (!token || isEmployee || !employeeId) return;
      setCreating(true);
      setError(null);
      try {
        const created = await createConversation(employeeId);
        if (created?.conversationId) {
          setConversations((prev) => {
            const rest = prev.filter((c) => c.conversationId !== created.conversationId);
            return [created, ...rest];
          });
          setSelectedId(created.conversationId);
          setSelectedHeadquartersId(null);
          setEmployees([]);
        }
      } catch (e) {
        setError(e?.message || 'Error al crear conversación');
      } finally {
        setCreating(false);
      }
    },
    [token, isEmployee]
  );

  const handleSearchByPhone = useCallback(async () => {
    const phone = (phoneSearch || '').trim();
    if (!phone || !isEmployee) return;
    setSearchingPhone(true);
    setError(null);
    try {
      const data = await findConversationByPhone(phone);
      setPhoneSearchResult(data);
      if (data?.conversation?.conversationId) {
        setConversations((prev) => {
          const exists = prev.some((c) => c.conversationId === data.conversation.conversationId);
          if (exists) return prev;
          return [data.conversation, ...prev];
        });
        setSelectedId(data.conversation.conversationId);
      }
    } catch (e) {
      setError(e?.message || 'Error al buscar');
      setPhoneSearchResult(null);
    } finally {
      setSearchingPhone(false);
    }
  }, [phoneSearch, isEmployee]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const list = await getMessages(conversationId);
      const arr = Array.isArray(list) ? list : [];
      setMessages(arr);
      setHasMoreMessages(arr.length >= 100);
      // Marcar como leída al cargar mensajes (empleado o usuario está viendo el chat)
      try {
        await markConversationAsRead(conversationId);
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === conversationId
              ? { ...c, userUnreadCount: 0, employeeUnreadCount: 0 }
              : c
          )
        );
      } catch { /* mark as read is best-effort */; }
    } catch {
      setMessages([]);
      setHasMoreMessages(false);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = useCallback(
    async (id) => {
      setSelectedId(id);
      if (id) {
        try {
          await markConversationAsRead(id);
          setConversations((prev) =>
            prev.map((c) =>
              c.conversationId === id
                ? {
                    ...c,
                    userUnreadCount: 0,
                    employeeUnreadCount: 0,
                  }
                : c
            )
          );
        } catch { /* mark as read is best-effort */; }
      }
    },
    []
  );

  const handleCloseConversation = useCallback(async (conversationId) => {
    if (!conversationId || !isEmployee) return;
    setClosingId(conversationId);
    try {
      await updateConversationStatus(conversationId, 'CLOSED');
      setConversations((prev) =>
        prev.map((c) => (c.conversationId === conversationId ? { ...c, status: 'CLOSED' } : c))
      );
    } catch (e) {
      setError(e?.message || 'Error al cerrar');
    } finally {
      setClosingId(null);
    }
  }, [isEmployee]);

  const loadEmployeesForAssign = useCallback(async () => {
    const hqId = user?.headquartersId ?? user?.headquarters?.id;
    if (!hqId) {
      setEmployeesForAssign([]);
      return;
    }
    setLoadingEmployeesForAssign(true);
    try {
      const list = await getEmployeesByHeadquarters(hqId);
      setEmployeesForAssign(Array.isArray(list) ? list : []);
    } catch {
      setEmployeesForAssign([]);
    } finally {
      setLoadingEmployeesForAssign(false);
    }
  }, [user?.headquartersId, user?.headquarters?.id]);

  const handleAssignEmployee = useCallback(async (conversationId, employeeId) => {
    if (!conversationId || !employeeId) return;
    setAssigningId(conversationId);
    try {
      const updated = await assignEmployee(conversationId, employeeId);
      setConversations((prev) =>
        prev.map((c) => (c.conversationId === conversationId ? { ...c, ...updated } : c))
      );
    } catch (e) {
      setError(e?.message || 'Error al asignar');
    } finally {
      setAssigningId(null);
    }
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (!selectedId || messages.length === 0) return;
    try {
      const list = await getMessages(selectedId, { limit: 50, offset: messages.length });
      const next = Array.isArray(list) ? list : [];
      setHasMoreMessages(next.length >= 50);
      setMessages((prev) => [...next, ...prev]);
    } catch {
      setHasMoreMessages(false);
    }
  }, [selectedId, messages.length]);

  const handleIncomingMessage = useCallback((msg) => {
    if (msg && msg.type === 'typing') {
      setOtherPartyTyping(msg.typing === true);
      if (typingClearTimeoutRef.current) clearTimeout(typingClearTimeoutRef.current);
      if (msg.typing) {
        typingClearTimeoutRef.current = setTimeout(() => {
          typingClearTimeoutRef.current = null;
          setOtherPartyTyping(false);
        }, 3000);
      }
      return;
    }
    const isFromOther =
      (msg.senderType === 'USER' && isEmployee) || (msg.senderType === 'EMPLOYEE' && !isEmployee);
    setMessages((prev) => {
      if (prev.some((m) => m.messageId === msg.messageId)) return prev;
      return [...prev, msg];
    });
    if (isFromOther) {
      // Estamos viendo esta conversación: marcar como leída para que no se acumule el contador
      if (selectedId) {
        markConversationAsRead(selectedId)
          .then(() => {
            setConversations((prev) =>
              prev.map((c) =>
                c.conversationId === selectedId
                  ? { ...c, userUnreadCount: 0, employeeUnreadCount: 0 }
                  : c
              )
            );
          })
          .catch(() => {});
      }
      playNotificationSound();
      if (isPageHidden()) {
        const senderName = senderDisplayNameRef.current || MESSAGES.CHAT_SUPPORT || 'Soporte';
        const titleTemplate = MESSAGES.CHAT_NEW_MESSAGE_FROM || 'Nuevo mensaje de {name}';
        const title = titleTemplate.replace('{name}', senderName);
        const body = (msg.body || '').trim();
        requestNotificationPermission().then((permission) => {
          if (permission === 'granted') {
            showChatNotification(title, body);
          }
        });
      }
    }
  }, [isEmployee, selectedId]);

  const { sendMessage, sendTyping, connected } = useChatSocket(selectedId, token, {
    onMessage: handleIncomingMessage,
  });

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      setHasMoreMessages(true);
    } else {
      setMessages([]);
    }
    setOtherPartyTyping(false);
    if (typingClearTimeoutRef.current) {
      clearTimeout(typingClearTimeoutRef.current);
      typingClearTimeoutRef.current = null;
    }
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (pollingInterval <= 0) return;
    const id = setInterval(() => loadConversations(true), pollingInterval);
    return () => clearInterval(id);
  }, [pollingInterval, loadConversations]);

  useEffect(() => {
    const updateTitle = () => {
      if (typeof document === 'undefined') return;
      if (!document.hidden) {
        if (!document.title.startsWith('(')) baseTitleRef.current = document.title;
        document.title = baseTitleRef.current || document.title;
      } else if (totalUnreadCount > 0) {
        document.title = `(${totalUnreadCount}) ${baseTitleRef.current || 'RentExpress'}`;
      } else {
        document.title = baseTitleRef.current || document.title;
      }
    };
    updateTitle();
    document.addEventListener('visibilitychange', updateTitle);
    return () => document.removeEventListener('visibilitychange', updateTitle);
  }, [totalUnreadCount]);

  return {
    state: {
      conversations,
      selectedId,
      selectedConversation,
      messages,
      isEmployee,
      headquarters,
      selectedHeadquartersId,
      employees,
      phoneSearch,
      phoneSearchResult,
      totalUnreadCount,
      employeesForAssign,
      hasMoreMessages,
      otherPartyTyping,
    },
    ui: {
      loading,
      loadingMessages,
      creating,
      loadingEmployees,
      loadingEmployeesForAssign,
      searchingPhone,
      closingId,
      assigningId,
      error,
    },
    actions: {
      loadConversations,
      loadHeadquarters,
      setSelectedHeadquartersId,
      handleCreateConversation,
      handleCreateWithEmployee,
      handleSelectConversation,
      handleCloseConversation,
      loadEmployeesForAssign,
      handleAssignEmployee,
      loadMoreMessages,
      setError,
      setPhoneSearch,
      handleSearchByPhone,
    },
    sendMessage,
    sendTyping,
    connected,
  };
}

export default useSupportChatPage;
