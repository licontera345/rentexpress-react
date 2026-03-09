import Config from '../../config/apiConfig';
import { axiosClient } from '../axiosClient';

/**
 * Lista las conversaciones del usuario o empleado autenticado.
 */
export async function getMyConversations() {
  const response = await axiosClient.get(Config.CHAT.LIST);
  return response.data;
}

/**
 * Crea una nueva conversación. Con employeeId crea/obtiene la conversación con ese empleado.
 */
export async function createConversation(employeeId = null) {
  const body = employeeId != null ? { employeeId } : {};
  const response = await axiosClient.post(Config.CHAT.CREATE, body);
  return response.data;
}

/**
 * Empleados de una sede (para que el cliente elija con quién chatear).
 */
export async function getEmployeesByHeadquarters(headquartersId) {
  const response = await axiosClient.get(Config.CHAT.EMPLOYEES_BY_HEADQUARTERS(headquartersId));
  return response.data;
}

/**
 * Buscar usuario por teléfono y obtener/crear conversación (empleado).
 */
export async function findConversationByPhone(phone) {
  const response = await axiosClient.get(Config.CHAT.FIND_BY_PHONE(phone));
  return response.data;
}

/**
 * Marcar conversación como leída.
 */
export async function markConversationAsRead(conversationId) {
  const response = await axiosClient.put(Config.CHAT.MARK_READ(conversationId));
  return response.data;
}

/**
 * Obtiene una conversación por ID.
 */
export async function getConversation(id) {
  const response = await axiosClient.get(Config.CHAT.BY_ID(id));
  return response.data;
}

/**
 * Obtiene los mensajes de una conversación (paginado).
 */
export async function getMessages(conversationId, { limit = 100, offset = 0 } = {}) {
  const url = `${Config.CHAT.MESSAGES(conversationId)}?limit=${limit}&offset=${offset}`;
  const response = await axiosClient.get(url);
  return response.data;
}

/**
 * Actualiza el estado de una conversación (ej. cerrar). Body: { status: "CLOSED" }.
 */
export async function updateConversationStatus(conversationId, status) {
  const response = await axiosClient.put(Config.CHAT.UPDATE(conversationId), { status });
  return response.data;
}

/**
 * Asigna un empleado a una conversación (admin/empleado).
 */
export async function assignEmployee(conversationId, employeeId) {
  const response = await axiosClient.put(Config.CHAT.ASSIGN(conversationId), { employeeId });
  return response.data;
}

export default {
  getMyConversations,
  createConversation,
  getEmployeesByHeadquarters,
  findConversationByPhone,
  markConversationAsRead,
  updateConversationStatus,
  getConversation,
  getMessages,
  assignEmployee,
};
