// src/common/interfaces/api-response.interface.ts

/**
 * Formato unificado de respuesta de la API.
 *
 * @template T El tipo de dato devuelto en `data`.
 */
export interface ApiResponse<T> {
  /** Indica si la operación fue exitosa */
  success: boolean;

  /** Mensaje humano legible */
  message: string;

  /** Payload de la respuesta */
  data: T;

  /**
   * Errores de validación u otros errores de negocio.
   * Clave: nombre de campo o categoría de error.
   * Valor: lista de mensajes.
   */
  errors?: Record<string, string[]> | null;
}
