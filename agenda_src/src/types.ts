export type Barber = 'Douglas' | 'Cristopher';
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Attended' | 'No-show';

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  barber: Barber;
  service: Service;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
}

export const SERVICES: Service[] = [
  { id: '1', name: 'Corte Clásico', durationMinutes: 30 },
  { id: '2', name: 'Corte Ejecutivo & Barba', durationMinutes: 60 },
  { id: '3', name: 'Tinte', durationMinutes: 60 },
  { id: '4', name: 'Mechas', durationMinutes: 90 },
];
