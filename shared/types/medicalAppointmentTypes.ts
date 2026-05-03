export interface IMedicalAppointment {
  id: string;
  date: Date;
  time: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  type: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}