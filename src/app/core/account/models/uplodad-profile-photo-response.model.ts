export interface UploadPhotoResponse {
  /**
   * Статус завантаження фото
   */
  status: 'progress' | 'completed';

  /**
   * Прогрес завантаження у відсотках (0-100)
   * Присутній тільки коли status === 'progress'
   */
  progress?: number;
}
