export interface ErrorNotification {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}
