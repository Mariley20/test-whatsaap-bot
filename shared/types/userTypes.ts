import type {
  USER_ROLE_ADMIN,
  USER_ROLE_DOCTOR,
  USER_ROLE_PATIENT,
  USER_ROLE_SECRETARY,
} from '#shared/constants/userRoles'

export type UserRole =
  | typeof USER_ROLE_ADMIN
  | typeof USER_ROLE_DOCTOR
  | typeof USER_ROLE_PATIENT
  | typeof USER_ROLE_SECRETARY;

export interface IUser {
  uid: string;
  fullName: string;
  email: string;
  emailVerified: boolean
  documentNumber: string;
  documentType: string;
  phoneNumber: string;
  photoURL: string;
  role: UserRole | '';
  acceptedTermsAndConditions: boolean;
  createdAt: Date | null
  updatedAt: Date | null
  workingHours: IWorkingHours[];
}

export interface IWorkingHours {
  userId: string;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  dayName: string; // e.g., "Monday"
  hours: {
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "17:00"
  }[]
}

export interface UserRegistrationData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}