// ==========================================
// FIREBASE AUTHENTICATION & FIRESTORE LOGIC
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// REEMPLAZAR CON LAS CLAVES DE TU PROYECTO FIREBASE
// (Ve a la consola de Firebase -> Configuración del Proyecto -> General -> Tus Apps -> Firebase SDK snippet)
const firebaseConfig = {
    apiKey: "AIzaSyAze6d99BTVCZrKTLzZU7k2VDBQvCOVbRI",
    authDomain: "barber-shop-7b7a1.firebaseapp.com",
    projectId: "barber-shop-7b7a1",
    storageBucket: "barber-shop-7b7a1.firebasestorage.app",
    messagingSenderId: "1012462347255",
    appId: "1:1012462347255:web:8943921ae053b120ff04f2",
    measurementId: "G-F5NVKXM1KB"
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
// ==========================================
// FUNCIÓN GLOBAL: handleMiPerfilClick
// ==========================================
window.handleMiPerfilClick = function() {
    if (window.currentUserId) {
        // Está logueado: Cerramos menú móvil y abrimos el modal
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
        
        const modal = document.getElementById('mi-perfil-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    } else {
        // NO está logueado: Redirige al login de Google inmediatamente
        sessionStorage.setItem('pendingRedirect', 'true');
        window.loginWithGoogle();
    }
};

window.handleBarberBookingClick = function(barberUrl) {
    if (window.currentUserId) {
        // User is logged in, redirect directly to the booking form of the barber
        window.location.href = barberUrl + '#booking-form';
    } else {
        // Set pending redirect to the barber's page
        sessionStorage.setItem('pendingRedirect', barberUrl);
        // Determine the barber name for the message
        let barberName = barberUrl.includes('douglas') ? 'Douglas' : 'Cristopher';
        
        const modal = document.getElementById('barber-auth-modal');
        const message = document.getElementById('barber-auth-message');
        if (modal && message) {
            message.textContent = `Para reservar cita con ${barberName}, créate una cuenta o inicia sesión.`;
            modal.classList.remove('hidden');
            // Timeout to allow display:block before opacity transition
            setTimeout(() => {
                modal.classList.add('opacity-100');
            }, 10);
        } else {
            // Fallback just in case the modal doesn't exist
            window.location.hash = '#reservas';
        }
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario logueado
        if (document.getElementById('auth-user-info-panel')) {
            document.getElementById('auth-user-info-panel').style.display = 'block';
        }
        
        // Mobile menu specific toggles (ocultar login options, mostrar logout)
        if (document.getElementById('mobile-btn-google')) document.getElementById('mobile-btn-google').classList.add('hidden');
        if (document.getElementById('mobile-btn-email')) document.getElementById('mobile-btn-email').classList.add('hidden');
        if (document.getElementById('mobile-btn-logout')) document.getElementById('mobile-btn-logout').classList.remove('hidden');

        // Desktop Auth menu toggles
        if (document.getElementById('auth-btn-google')) document.getElementById('auth-btn-google').classList.add('hidden');
        if (document.getElementById('auth-btn-email')) document.getElementById('auth-btn-email').classList.add('hidden');
        if (document.getElementById('auth-btn-logout')) document.getElementById('auth-btn-logout').classList.remove('hidden');

        // Booking Form Protection
        if (document.getElementById('booking-auth-overlay')) document.getElementById('booking-auth-overlay').classList.add('hidden');
        if (document.getElementById('booking-form')) {
            document.getElementById('booking-form').style.display = 'block';
            document.getElementById('booking-form').classList.remove('hidden');
        }

        if (document.getElementById('auth-user-name')) document.getElementById('auth-user-name').textContent = user.displayName || 'Usuario';
        if (document.getElementById('auth-user-email')) document.getElementById('auth-user-email').textContent = user.email;

        // Guardar el user_id globalmente para que booking.js lo use al hacer una reserva
        window.currentUserId = user.uid;

        // Cargar datos en el modal
        loadMiPerfilYHistorial(user);

        // Si venimos de un login explícito (ej. booking redirect), manejarlo
        let pending = sessionStorage.getItem('pendingRedirect');
        if (pending) {
            sessionStorage.removeItem('pendingRedirect');
            saveUserProfile(user); // Asegura que se cree el perfil
            
            if (pending.endsWith('.html')) {
                // They clicked a specific barber
                window.location.href = pending + '#booking-form';
            } else if (pending === 'booking') {
                // Standard booking flow
                if (window.location.pathname.includes('douglas.html') || window.location.pathname.includes('cristopher.html')) {
                    window.location.hash = '#booking-form';
                } else {
                    window.location.hash = '#reservas';
                }
            }
        }
    } else {
        // UI de Usuario Desconectado
        if (document.getElementById('auth-user-info-panel')) {
            document.getElementById('auth-user-info-panel').style.display = 'none';
        }
        
        // Mobile menu specific toggles (mostrar login options, ocultar logout)
        if (document.getElementById('mobile-btn-google')) document.getElementById('mobile-btn-google').classList.remove('hidden');
        if (document.getElementById('mobile-btn-email')) document.getElementById('mobile-btn-email').classList.remove('hidden');
        if (document.getElementById('mobile-btn-logout')) document.getElementById('mobile-btn-logout').classList.add('hidden');

        // Desktop Auth menu toggles
        if (document.getElementById('auth-btn-google')) document.getElementById('auth-btn-google').classList.remove('hidden');
        if (document.getElementById('auth-btn-email')) document.getElementById('auth-btn-email').classList.remove('hidden');
        if (document.getElementById('auth-btn-logout')) document.getElementById('auth-btn-logout').classList.add('hidden');

        // Booking Form Protection
        if (document.getElementById('booking-auth-overlay')) {
            document.getElementById('booking-auth-overlay').classList.remove('hidden');
            document.getElementById('booking-auth-overlay').style.display = 'block';
        }
        if (document.getElementById('booking-form')) {
            document.getElementById('booking-form').style.display = 'none';
            document.getElementById('booking-form').classList.add('hidden');
        }

        window.currentUserId = null;
    }
});

// Función: Login con Google (Usando Redirect para evitar bloqueos de popups)
window.loginWithGoogle = async function() {
    console.log("Dominio actual detectado por el navegador:", window.location.hostname);
    try {
        sessionStorage.setItem('pendingRedirect', 'true');
        const provider = new GoogleAuthProvider();
        // Redirect clears the current page, so we don't await anything here
        signInWithRedirect(auth, provider).catch(error => {
            sessionStorage.removeItem('pendingRedirect');
            console.error('Error al iniciar redirección con Google:', error.code, error.message);
            alert(`Error de Firebase [${error.code}]: ${error.message}\n\nAsegúrate de que el dominio ${window.location.hostname} está en Firebase > Auth > Settings > Authorized Domains.`);
        });
    } catch (error) {
        sessionStorage.removeItem('pendingRedirect');
        console.error('Excepción al iniciar sesión con Google:', error);
    }
}

// Función auxiliar para guardar el perfil en Firestore
async function saveUserProfile(user) {
    try {
        const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
        const userRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            // Usuario recurrente, solo actualizar last_login y foto si cambió
            await setDoc(userRef, {
                last_login: new Date().toISOString(),
                avatar_url: user.photoURL || docSnap.data().avatar_url
            }, { merge: true });
            console.log("Perfil de usuario actualizado en la base de datos.");
        } else {
            // Usuario nuevo, generar username
            const generatedUsername = user.email ? user.email.split('@')[0] : `user_${user.uid.substring(0, 5)}`;
            await setDoc(userRef, {
                id: user.uid,
                username: generatedUsername,
                full_name: user.displayName || generatedUsername,
                email: user.email,
                avatar_url: user.photoURL || null,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
            });
            console.log("Nuevo perfil creado en la base de datos.");
        }
        
        // Abrir el modal en lugar de redirigir
        const modal = document.getElementById('mi-perfil-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error guardando el perfil del usuario:", error);
        alert("Error de base de datos: No tienes los permisos configurados en Firebase o no se ha creado la base de datos Firestore. Ve a la consola y pega las Reglas de Seguridad.\nDetalle: " + error.message);
        // Aún así abrimos el modal
        const modal = document.getElementById('mi-perfil-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    }
}

// Escuchar el resultado cuando regresa de Google
getRedirectResult(auth)
    .then((result) => {
        if (result) {
            console.log("Login exitoso con Google:", result.user.email);
            saveUserProfile(result.user);
        }
    })
    .catch((error) => {
        console.error("Error al regresar de Google Redirect:", error.code, error.message);
        alert(`Error al volver de Google [${error.code}]: ${error.message}\n\nDomino detectado: ${window.location.hostname}`);
    });
// ==========================================
// LÓGICA DEL PERFIL Y MIS CITAS (MODAL)
// ==========================================
async function loadMiPerfilYHistorial(user) {
    if (!user) return;
    
    try {
        const { doc, getDoc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
        
        // Cargar Perfil
        const userRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const profile = docSnap.data();
            const avatarImg = document.getElementById('modal-profile-avatar');
            if (avatarImg) avatarImg.src = profile.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.full_name || 'User') + '&background=d4af37&color=0b0b0b';
            
            const nameEl = document.getElementById('modal-profile-name');
            if (nameEl) nameEl.textContent = profile.full_name || 'Usuario';
            
            const emailEl = document.getElementById('modal-profile-email');
            if (emailEl) emailEl.textContent = profile.email || '';
            
            const usernameEl = document.getElementById('modal-profile-username');
            if (usernameEl) usernameEl.textContent = '@' + (profile.username || 'user');
            
            const editName = document.getElementById('modal-edit-full-name');
            if (editName) editName.value = profile.full_name || '';
            
            const editUsername = document.getElementById('modal-edit-username');
            if (editUsername) editUsername.value = profile.username || '';
        }
        
        // Cargar Historial
        const listEl = document.getElementById('modal-history-list');
        if (!listEl) return;
        listEl.innerHTML = '<div class="text-center text-gold-500 py-6"><i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i><p class="text-sm">Cargando...</p></div>';
        
        const q = query(collection(db, 'bookings'), where('user_id', '==', user.uid), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            listEl.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-calendar-xmark text-2xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400">Aún no tienes reservas.</p>
                </div>
            `;
            return;
        }

        let html = '';
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const statusColor = data.status === 'Confirmed' ? 'text-green-400' : (data.status === 'Pending' ? 'text-yellow-400' : 'text-gray-400');
            const statusText = data.status === 'Confirmed' ? 'Confirmada' : (data.status === 'Pending' ? 'Pendiente' : 'Completada');
            
            html += `
                <div class="bg-dark-800 border border-gold-500/10 rounded-xl p-4 hover:border-gold-500/30 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-white">${data.service || 'Servicio'}</h4>
                            <p class="text-xs text-gray-400 mt-1"><i class="fa-solid fa-scissors mr-1 text-gold-500"></i> ${data.barber || 'Sin asignar'}</p>
                        </div>
                        <span class="text-sm font-bold text-gold-500">$${data.price || '0.00'}</span>
                    </div>
                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                        <span class="text-xs text-gray-300"><i class="fa-regular fa-calendar mr-1"></i> ${data.date || ''} - ${data.time || ''}</span>
                        <span class="text-xs font-bold ${statusColor}">${statusText}</span>
                    </div>
                </div>
            `;
        });
        listEl.innerHTML = html;
        
    } catch (error) {
        console.error("Error al cargar perfil o historial:", error);
        const nameEl = document.getElementById('modal-profile-name');
        if (nameEl) nameEl.textContent = 'Error';
        const listEl = document.getElementById('modal-history-list');
        if (listEl) listEl.innerHTML = '<p class="text-red-400 text-center">Faltan permisos. Verifica las reglas de Firestore.</p>';
    }
}

// Configurar el formulario de edición (solo una vez)
document.addEventListener('DOMContentLoaded', () => {
    const btnEdit = document.getElementById('modal-btn-edit-profile');
    const btnCancel = document.getElementById('modal-btn-cancel-edit');
    const formEdit = document.getElementById('modal-form-edit-profile');
    const viewProfile = document.getElementById('modal-view-profile-info');
    
    if (btnEdit && formEdit && viewProfile && btnCancel) {
        btnEdit.addEventListener('click', () => {
            viewProfile.classList.add('hidden');
            formEdit.classList.remove('hidden');
        });
        
        btnCancel.addEventListener('click', () => {
            formEdit.classList.add('hidden');
            viewProfile.classList.remove('hidden');
        });
        
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSave = document.getElementById('modal-btn-save-profile');
            if (btnSave) {
                btnSave.disabled = true;
                btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            }
            
            try {
                const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
                const newName = document.getElementById('modal-edit-full-name').value;
                const newUsername = document.getElementById('modal-edit-username').value;
                
                const userRef = doc(db, 'profiles', window.currentUserId);
                await updateDoc(userRef, {
                    full_name: newName,
                    username: newUsername
                });
                
                document.getElementById('modal-profile-name').textContent = newName;
                document.getElementById('modal-profile-username').textContent = '@' + newUsername;
                
                formEdit.classList.add('hidden');
                viewProfile.classList.remove('hidden');
                alert("¡Perfil actualizado!");
            } catch (error) {
                console.error(error);
                alert("Error al actualizar perfil.");
            } finally {
                if (btnSave) {
                    btnSave.disabled = false;
                    btnSave.innerHTML = 'Guardar';
                }
            }
        });
    }
});

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
            saveUserProfile(result.user);
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
