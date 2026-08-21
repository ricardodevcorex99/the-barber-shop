import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Escuchar cambios en Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData: Appointment[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          clientName: data.name || 'Cliente',
          clientPhone: data.phone || '',
          barber: data.barber || 'No especificado',
          service: { 
            id: 'svc', 
            name: data.services ? data.services.join(', ') : 'Servicio general', 
            durationMinutes: 30 
          },
          date: data.date || new Date().toISOString().split('T')[0],
          time: data.time || '00:00',
          status: (data.status as Appointment['status']) || 'pending'
        };
      });
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, []);

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      await addDoc(collection(db, 'bookings'), {
        name: appointment.clientName,
        phone: appointment.clientPhone,
        barber: appointment.barber,
        services: [appointment.service.name],
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointmentStatus,
      isModalOpen,
      setIsModalOpen,
      selectedDate,
      setSelectedDate,
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
