import { ChevronLeft, ChevronRight, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';
import { Appointment } from '../types';

const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export default function Agenda() {
  const { appointments, selectedDate, setSelectedDate, updateAppointmentStatus } = useAppointments();

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(newDate());
  };

  const dateString = selectedDate.toISOString().split('T')[0];
  const dayAppointments = appointments.filter(app => app.date === dateString);

  const getStatusColor = (status: Appointment['status']) => {
    switch(status) {
      case 'Confirmed': return 'emerald';
      case 'Pending': return 'amber';
      case 'Attended': return 'primary'; // gold
      case 'No-show': return 'red';
      default: return 'outline';
    }
  };

  const renderAppointment = (barberName: string, time: string) => {
    const app = dayAppointments.find(a => a.barber === barberName && a.time === time);
    if (!app) return <div className="relative z-10 p-2 h-full w-full"></div>;

    const color = getStatusColor(app.status);

    return (
      <div className="relative z-10 p-2 h-full group">
        <div className={`bg-surface-container-highest border-l-2 border-${color}-500 rounded p-3 h-full shadow-lg flex flex-col justify-between cursor-pointer hover:bg-surface-bright transition-colors relative overflow-hidden`}>
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-label-ui text-label-ui text-on-surface">{app.clientName}</h4>
              <span className={`text-xs font-code-folio text-${color}-400 px-2 py-0.5 rounded bg-${color}-500/10 border border-${color}-500/20`}>
                {app.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant truncate">{app.service.name}</p>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="text-xs font-code-folio text-on-surface-variant flex items-center gap-1">
              <Clock size={14} /> {app.time}
            </div>
            
            {/* Quick Actions on Hover */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
              {app.status !== 'Attended' && (
                <button onClick={() => updateAppointmentStatus(app.id, 'Attended')} className="text-emerald-400 hover:text-emerald-300" title="Marcar Atendido">
                  <CheckCircle size={16} />
                </button>
              )}
              {app.status !== 'No-show' && (
                <button onClick={() => updateAppointmentStatus(app.id, 'No-show')} className="text-red-400 hover:text-red-300" title="Marcar No Vino">
                  <XCircle size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 ml-0 md:ml-64 bg-background min-h-screen">
      {/* Header */}
      <header className="h-20 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 flex items-center justify-between px-8 sticky top-0 z-30">
        <div>
          <h1 className="font-headline-lg text-4xl text-on-surface">Agenda Diaria</h1>
          <p className="font-code-folio text-code-folio text-on-surface-variant mt-1 text-sm">
            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handlePrevDay} className="w-10 h-10 rounded border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleToday} className="px-4 py-2 rounded border border-outline-variant/50 font-label-ui text-label-ui text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer">
            Hoy
          </button>
          <button onClick={handleNextDay} className="w-10 h-10 rounded border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Agenda Canvas */}
      <div className="p-8 max-w-[1400px] mx-auto">
        
        {/* Column Headers */}
        <div className="timeline-grid mb-4 sticky top-20 bg-background/95 backdrop-blur-md z-20 py-4 border-b border-outline-variant/20">
          <div className="text-right pr-4 text-on-surface-variant font-code-folio text-code-folio flex items-end justify-end pb-2">
            <Clock size={16} />
          </div>
          
          {/* Barber 1 Header */}
          <div className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
              <img 
                alt="Douglas" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLyr7h35P5miwsh2GuL5Nh5h5AsrLYzGTSkaTCqCWY4UG1dQfwN5AosskdIpLA922Mc4U148gA0mw6EdlH3nnmqdfr72F8lpV6ndHiwYinF-h8oT6UCyA8_bxqRjlUEl7xid9NdplcuRzTTT25PcgD9OfJTxXTCGhyLxXoKa62K9cE7ZdpSdxeuFCjfAjLXF1xOvjITJjYARvtI_xS1XMI0efeWKbo94z03cXczQySFLLgxo_k7SWg" 
              />
            </div>
            <div>
              <h2 className="font-label-ui text-label-ui text-on-surface text-lg">Douglas</h2>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo
              </p>
            </div>
          </div>
          
          {/* Barber 2 Header */}
          <div className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
              <img 
                alt="Cristopher" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu8BIDlb0LQCjDF1UDUlgkGX6peq92io124azHPxn4D60TSD2aWOAeLmj8ERrhCGy_9s9rnZd8cXDh53LQgJl004w4lawRI45tt_IS0wUpDM2-o-ycHRTuocmrghSNTHJsjucX8MF98Llr2b4Epz3gx5tkhINbATOQ26WnZe-Qx0ntkuTf-xTs323-UB5W-QVwG8NhYEHQhI2zX1dpdjx35EKs-yMUUSHacYfQMC2M8Mep4uR1x3pJ" 
              />
            </div>
            <div>
              <h2 className="font-label-ui text-label-ui text-on-surface text-lg">Cristopher</h2>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col relative pb-20">
          {HOURS.map(hour => (
            <div key={hour} className="timeline-hour h-32 border-b border-outline-variant/10">
              <div className="text-right pr-4 text-on-surface-variant font-code-folio text-code-folio pt-2 border-r border-outline-variant/20 text-sm">
                {hour}
              </div>
              {renderAppointment('Douglas', hour)}
              {renderAppointment('Cristopher', hour)}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
