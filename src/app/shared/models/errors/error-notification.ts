import {ErrorType} from "../../enums/error-type.enum";

export interface ErrorNotification {
  message: string;
  type: ErrorType;
  timestamp: Date;
}
