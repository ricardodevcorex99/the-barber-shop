// ==========================================
// FIREBASE AUTHENTICATION & FIRESTORE LOGIC
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// REEMPLAZAR CON LAS CLAVES DE TU PROYECTO FIREBASE
// (Ve a la consola de Firebase -> Configuración del Proyecto -> General -> Tus Apps -> Firebase SDK snippet)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global state for booking.js
window.currentUserId = null;
window.firebaseDb = db; // Export db to save bookings directly if needed

// Auth UI Elements
const guestView = document.getElementById('auth-guest-view');
const userView = document.getElementById('auth-user-view');
const userNameText = document.getElementById('auth-user-name');
const userEmailText = document.getElementById('auth-user-email');

// Escuchar cambios en la autenticación (Login / Logout)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario logueado
        if (guestView) guestView.classList.add('hidden');
        if (userView) userView.classList.remove('hidden');
        
        // Mostrar datos del usuario
        const name = user.displayName || user.email.split('@')[0];
        
        if (userNameText) userNameText.textContent = name;
        if (userEmailText) userEmailText.textContent = user.email;

        // Guardar el user_id globalmente para que booking.js lo use al hacer una reserva
        window.currentUserId = user.uid;
    } else {
        // Usuario no logueado (Invitado)
        if (guestView) guestView.classList.remove('hidden');
        if (userView) userView.classList.add('hidden');
        window.currentUserId = null;
    }
});

// Función: Login con Google
window.loginWithGoogle = async function() {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
        alert('Hubo un error al conectar con Google. Por favor intenta de nuevo.');
    }
}

// Función: Login con Email (Magic Link)
window.loginWithEmail = async function() {
    const email = prompt("Ingresa tu correo electrónico para enviarte un enlace de acceso mágico (sin contraseña):");
    if (!email) return;

    try {
        const actionCodeSettings = {
            url: window.location.href, // This must be registered in Firebase Auth settings
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        
        // Save email in localStorage so we don't have to ask for it again
        window.localStorage.setItem('emailForSignIn', email);
        alert(`¡Enlace mágico enviado! Revisa la bandeja de entrada de ${email} y haz clic en el enlace para entrar.`);
    } catch (error) {
        console.error('Error al enviar Magic Link:', error.message);
        alert('Hubo un error al enviar el correo. Verifica tu dirección de email.');
    }
}

// Check if returning from a Magic Link
if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        email = window.prompt('Por favor, ingresa tu email nuevamente para confirmar:');
    }
    signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            // Login successful
        })
        .catch((error) => {
            console.error('Error in Magic Link auth', error);
        });
}

// Función: Cerrar sesión
window.logout = async function() {
    try {
        await signOut(auth);
        // La UI se actualizará automáticamente gracias al onAuthStateChanged
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
}

// Function to save booking directly to Firestore from booking.js
import { addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
window.saveBookingToFirestore = async function(bookingData) {
    try {
        const bookingsRef = collection(db, 'bookings');
        await addDoc(bookingsRef, {
            ...bookingData,
            created_at: new Date().toISOString(),
            status: 'pending'
        });
        console.log("Reserva guardada en Firebase exitosamente.");
    } catch (e) {
        console.error("Error al guardar en Firebase:", e);
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
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where("user_id", "==", window.currentUserId), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = '<div class="text-center py-10"><p class="text-gray-400 mb-2">No tienes citas registradas aún.</p><button onclick="document.getElementById(\'mis-citas-modal\').classList.add(\'hidden\'); document.getElementById(\'reservas\').scrollIntoView();" class="text-gold-500 underline">¡Reserva una ahora!</button></div>';
            return;
        }
        
        let html = '<div class="space-y-4">';
        querySnapshot.forEach((docSnap) => {
            const cita = docSnap.data();
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
        // Sometimes missing index in Firebase triggers error, or bad rules
        container.innerHTML = '<p class="text-center text-red-400 py-10">Hubo un error al cargar las citas. Verifica la configuración de la base de datos (Security Rules e Índices).</p>';
    }
}
