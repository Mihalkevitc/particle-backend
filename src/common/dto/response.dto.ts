// Единый формат ответа API
// Все endpoints возвращают данные в этом формате
export class ApiResponse<T> {
  success: boolean;   // true — запрос выполнен, false — ошибка
  data?: T;           // Полезные данные (для успешных запросов)
  message?: string;   // Сообщение (для ошибок или уведомлений)
  error?: string;     // Код ошибки (для отладки)
}
