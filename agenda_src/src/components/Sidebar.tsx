import { Plus, LayoutDashboard, Calendar, Users, Scissors, Settings, LogOut } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';
import NewAppointmentModal from './NewAppointmentModal';

export default function Sidebar() {
  const { isModalOpen, setIsModalOpen } = useAppointments();

  return (
    <>
      <nav className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/20 flex-col py-6 z-40 hidden md:flex">
        <div className="font-label-brand text-label-brand text-primary mb-8 px-8 uppercase tracking-widest text-lg">
          THE BARBER SHOP
        </div>
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-primary/30 overflow-hidden shrink-0">
            <img 
              alt="Admin Portrait" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKK9vWhCw8bVPRY54DCOMSVAYx86CfItmFArj6J6jJegJUCH7ZxDC7x6Nhfon45eDc07jOOj2DLqceCDn21b8FIr9O4nXvejH7sD4cBmKUUgRq2tNph5w1V_ovRlReSb5Y39HmW3plzDzGH59JNvolYiN90XEzL6QJILTWWKnSuWWqJIt9ZySeujf3Xl94vvssZK5spaFFfVd9RoxVb6Vo48X0NQAMXCX03V0kuwjG603qvMYsMcfH"
            />
          </div>
          <div>
            <h3 className="font-label-ui text-label-ui text-on-surface">TBS Admin</h3>
            <p className="font-code-folio text-code-folio text-on-surface-variant text-sm">Master Barber</p>
          </div>
        </div>
        <div className="px-6 mb-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary text-on-primary py-3 px-4 rounded font-label-ui text-label-ui flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all gold-glow cursor-pointer"
          >
            <Plus size={18} />
            New Appointment
          </button>
        </div>
      <div className="flex-1 flex flex-col gap-2 px-4">
        <a className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 font-label-ui text-label-ui" href="#">
          <LayoutDashboard size={20} />
          Dashboard
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded bg-primary/10 text-primary border-r-4 border-primary font-label-ui text-label-ui" href="#">
          <Calendar size={20} />
          Schedule
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 font-label-ui text-label-ui" href="#">
          <Users size={20} />
          Clients
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 font-label-ui text-label-ui" href="#">
          <Scissors size={20} />
          Services
        </a>
        <a className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 font-label-ui text-label-ui" href="#">
          <Settings size={20} />
          Settings
        </a>
      </div>
      <div className="px-4 mt-auto">
        <a className="flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 font-label-ui text-label-ui" href="#">
          <LogOut size={20} />
          Logout
        </a>
      </div>
      </nav>
      {isModalOpen && <NewAppointmentModal />}
    </>
  );
}
