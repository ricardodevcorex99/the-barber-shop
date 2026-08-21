import { useNavigate } from 'react-router-dom';

export default function ClientBooking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-headline-lg text-primary text-5xl mb-4">THE BARBER SHOP</h1>
        <p className="text-on-surface-variant font-body-md text-xl mb-8">
          Bienvenido. La página de reservas para clientes estará aquí.
        </p>
        <button 
          onClick={() => navigate('/admin')}
          className="text-on-surface-variant/50 hover:text-primary transition-colors text-sm underline"
        >
          Acceso Empleados
        </button>
      </div>
    </div>
  );
}
