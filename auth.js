// ==========================================
// SUPABASE AUTHENTICATION LOGIC
// ==========================================

// REEMPLAZAR CON LAS CLAVES DE TU PROYECTO SUPABASE
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth UI Elements
const guestView = document.getElementById('auth-guest-view');
const userView = document.getElementById('auth-user-view');
const userNameText = document.getElementById('auth-user-name');
const userEmailText = document.getElementById('auth-user-email');

// Escuchar cambios en la autenticación (Login / Logout)
supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
        // Usuario logueado
        if (guestView) guestView.classList.add('hidden');
        if (userView) userView.classList.remove('hidden');
        
        // Mostrar datos del usuario
        const metadata = session.user.user_metadata || {};
        const name = metadata.full_name || session.user.email.split('@')[0];
        
        if (userNameText) userNameText.textContent = name;
        if (userEmailText) userEmailText.textContent = session.user.email;

        // Guardar el user_id globalmente para que booking.js lo use al hacer una reserva
        window.currentUserId = session.user.id;
    } else {
        // Usuario no logueado (Invitado)
        if (guestView) guestView.classList.remove('hidden');
        if (userView) userView.classList.add('hidden');
        window.currentUserId = null;
    }
});

// Función: Login con Google
async function loginWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
        alert('Hubo un error al conectar con Google. Por favor intenta de nuevo.');
    }
}

// Función: Login con Email (Magic Link)
async function loginWithEmail() {
    const email = prompt("Ingresa tu correo electrónico para enviarte un enlace de acceso mágico (sin contraseña):");
    if (!email) return;

    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });
        if (error) throw error;
        
        alert(`¡Enlace mágico enviado! Revisa la bandeja de entrada de ${email} y haz clic en el enlace para entrar.`);
    } catch (error) {
        console.error('Error al enviar Magic Link:', error.message);
        alert('Hubo un error al enviar el correo. Verifica tu dirección de email.');
    }
}

// Función: Cerrar sesión
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        // La UI se actualizará automáticamente gracias al onAuthStateChange
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
}

// ==========================================
// SECCIÓN: MIS CITAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const misCitasLink = document.querySelector('a[href="#mis-citas"]');
    const misCitasModal = document.getElementById('mis-citas-modal');
    const misCitasList = document.getElementById('mis-citas-list');
    
    if (misCitasLink && misCitasModal) {
        misCitasLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Cerrar menú auth si está abierto
            if (typeof closeAuthMenu === 'function') closeAuthMenu();
            
            // Mostrar Modal
            misCitasModal.classList.remove('hidden');
            misCitasModal.classList.add('flex');
            
            // Cargar Citas
            await loadMisCitas(misCitasList);
        });
    }
});

async function loadMisCitas(container) {
    container.innerHTML = '<div class="text-center text-gold-500 py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl mb-3"></i><p>Cargando tus citas...</p></div>';
    
    if (!window.currentUserId) {
        container.innerHTML = '<p class="text-center text-gray-400 py-10">Inicia sesión para ver tus citas.</p>';
        return;
    }

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', window.currentUserId)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="text-center py-10"><p class="text-gray-400 mb-2">No tienes citas registradas aún.</p><button onclick="document.getElementById(\'mis-citas-modal\').classList.add(\'hidden\'); document.getElementById(\'reservas\').scrollIntoView();" class="text-gold-500 underline">¡Reserva una ahora!</button></div>';
            return;
        }
        
        let html = '<div class="space-y-4">';
        data.forEach(cita => {
            let statusBadge = '';
            if (cita.status === 'pending') statusBadge = '<span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Pendiente</span>';
            else if (cita.status === 'confirmed') statusBadge = '<span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Confirmada</span>';
            else if (cita.status === 'completed') statusBadge = '<span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Completada</span>';
            else if (cita.status === 'cancelled') statusBadge = '<span class="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Cancelada</span>';
            else statusBadge = `<span class="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">${cita.status}</span>`;

            html += `
                <div class="bg-dark-800 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-bold text-[#fffffe] text-lg">${cita.date} ${cita.time ? `- ${cita.time}` : ''}</h4>
                            ${statusBadge}
                        </div>
                        <p class="text-gray-400 text-sm"><i class="fa-solid fa-scissors mr-1 w-4 text-center"></i> Barbero: <span class="text-[#fffffe]">${cita.barber}</span></p>
                        <p class="text-gray-400 text-sm"><i class="fa-solid fa-list mr-1 w-4 text-center"></i> Servicios: <span class="text-[#fffffe]">${cita.services.join(', ')}</span></p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-500 mb-1">Folio: ${cita.folio}</p>
                        <p class="font-bold text-gold-400">$${cita.total} USD</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error al cargar citas:', error.message);
        container.innerHTML = '<p class="text-center text-red-400 py-10">Hubo un error al cargar las citas. Intenta de nuevo más tarde.</p>';
    }
}
