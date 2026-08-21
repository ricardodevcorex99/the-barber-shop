import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';
import { Appointment, Barber, SERVICES } from '../types';

export default function NewAppointmentModal() {
  const { setIsModalOpen, addAppointment } = useAppointments();
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [barber, setBarber] = useState<Barber>('Douglas');
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedService = SERVICES.find(s => s.id === serviceId) || SERVICES[0];
    
    const newAppointment: Omit<Appointment, 'id'> = {
      clientName,
      clientPhone,
      barber,
      service: selectedService,
      date,
      time,
      status: 'Pending'
    };

    addAppointment(newAppointment);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-high w-full max-w-lg rounded-xl border border-outline-variant/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-surface-container-highest px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
          <h2 className="font-label-ui text-xl text-on-surface">Nueva Cita</h2>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-on-surface-variant hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Cliente</label>
              <input 
                required
                type="text" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Nombre" 
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Teléfono</label>
              <input 
                required
                type="text" 
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="099..." 
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Barbero</label>
            <select 
              value={barber}
              onChange={e => setBarber(e.target.value as Barber)}
              className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="Douglas">Douglas</option>
              <option value="Cristopher">Cristopher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Servicio</label>
            <select 
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
              className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
            >
              {SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Fecha</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-label-ui text-on-surface-variant mb-1">Hora</label>
              <input 
                type="time" 
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                step="1800"
                min="09:00"
                max="19:30"
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-2 px-3 text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-ui"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-primary text-on-primary rounded font-label-ui hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
