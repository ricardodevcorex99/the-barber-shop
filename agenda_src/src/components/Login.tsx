import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciales de prueba
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-high rounded-xl border border-outline-variant/30 shadow-2xl p-8 relative overflow-hidden">
        {/* Subtle gold glow behind */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
          <h1 className="font-label-brand text-primary text-3xl tracking-widest uppercase mb-2">
            The Barber Shop
          </h1>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-label-ui text-on-surface-variant mb-2">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-3 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/70 transition-all font-body-md"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-label-ui text-on-surface-variant mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/50 border border-outline-variant/30 rounded py-3 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/70 transition-all font-body-md"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-3 rounded font-label-ui font-semibold text-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all active:scale-[0.98] mt-4"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}
