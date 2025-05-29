export const ErrorTranslations: Record<string, string> = {
  'VALIDATION_ERROR': 'Помилка валідації',
  'ENTITY_NOT_FOUND_ERROR': 'Запис незнайдено',
  'ROLE_ALREADY_EXIST': 'Така роль вже існує',
  'SYS_USR_EMPLOYEE_ROLE_ALREADY_EXISTS': 'Працівник вже має таку роль',
  'SYS_USR_EMPLOYEE_ROLE_UNIT_ALREADY_EXISTS': 'Працівник вже має таку роль для такого регіону',
  'SYS_USR_EMPLOYEE_ROLE_UNIT_DEPARTMENT_ALREADY_EXISTS': 'Працівник вже має таку роль для такого департаменту',
  'AUTH_CHANGE_PASSWORD_ERROR': 'Не вдалося змінити пароль',
  'AUTH_REGISTRATION_ERROR': 'Сталась помилка під час реєстрації',
  'AUTH_CREDENTIALS_ERROR': 'Невірний логін або пароль',
  'AUTH_UPDATE_USER_ERROR': 'Невдалося оновити інформацію про користувача',
  'USER_ALREADY_EXIST_WITH_PHONE_NUMBER': 'Користувач з таким номером вже зареєстрований',
  'SYS_USR_UNIT_DIRECTOR_OUT_OF_SCOPE': 'Ви можете призначати ролі працівникам лише із свого регіону.',
  'SYS_USR_UNIT_DIRECTOR_INVALID_ROLE': 'Ви можете призначати ролі лише DEPARTMENT_ADMIN, DEPARTMENT_STYLIST, DEPARTMENT_DIRECTOR',
  'SYS_USR_UNIT_DIRECTOR_GLOBAL_SCOPE': 'Ви не можете призначити роль глобально',
  'SYS_USR_DELETE_ROLE_WRONG_UNIT': 'Ви можете видаляти ролі працівникам лише зі свого регіону.'
};
