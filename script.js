/* =========================================
   NEXORA CORE SCRIPT - PRO V3
   ========================================= */

// --- CONFIG FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDVlj5YKtBQXdX_u40P5X_NtrvOV1-ANkM",
    authDomain: "panel-e85ed.firebaseapp.com",
    databaseURL: "https://panel-e85ed-default-rtdb.firebaseio.com",
    projectId: "panel-e85ed",
    storageBucket: "panel-e85ed.firebasestorage.app",
    messagingSenderId: "636109475101",
    appId: "1:636109475101:android:bf411e8b319ddb088165f4"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Struktur Folder Website
const websiteRef = database.ref('website/data');
const installRef = websiteRef.child('total_installs');
const maintenanceRef = database.ref('website/settings/maintenance');

// --- 1. SYSTEM MAINTENANCE (Realtime) ---
maintenanceRef.on('value', (snapshot) => {
    const isMaintenance = snapshot.val();
    if (isMaintenance === true) {
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#080808; color:white; font-family:'Fira Code',monospace; text-align:center; padding:20px;">
                <h1 style="text-shadow:0 0 20px #fff; font-size:2rem;">SYSTEM UNDER MAINTENANCE</h1>
                <p style="color:#555; margin-top:15px; letter-spacing:1px;">> Nexora Protocol is updating. Access denied.</p>
                <div class="blink" style="margin-top:30px; color:#ff3333; font-weight:bold;">[ STATUS: OFFLINE ]</div>
            </div>
        `;
    }
});

// --- 2. AMBIL DATA INSTALLS (Folder Website) ---
installRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const installCountElement = document.getElementById('installCount');
    if (data !== null) {
        installCountElement.innerText = data.toLocaleString('id-ID');
    } else {
        installRef.set(0); // Nilai awal jika database kosong
    }
});

// --- 3. TELEGRAM NOTIFIER ---
const TELEGRAM_BOT_TOKEN = "8656411338:AAHCKBjZJzf_i4AMOOW2sHCK_IdIlTkZMY4"; 
const TELEGRAM_CHAT_ID = "2044673218"; 

function sendTelegramAlert(newTotal) {
    const time = new Date().toLocaleString('id-ID');
    const msg = ` *NEXORA NOTIFICATION*\n\n` +
                `Target baru saja mengunduh APK!\n` +
                ` Waktu: ${time}\n` +
                ` Total Installs: *${newTotal}*`;
    
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: TELEGRAM_CHAT_ID, 
            text: msg, 
            parse_mode: 'Markdown' 
        })
    });
}

// --- 4. LOGIKA TOMBOL DOWNLOAD & ANIMASI ---
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.querySelector('.btn-text');
const btnProgress = document.querySelector('.btn-progress');

downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const music = document.getElementById('bgMusic');
    const apkUrl = this.getAttribute('href');

    if (this.classList.contains('loading')) return;

    // Music Trigger
    if (music && music.paused) {
        music.volume = 0.3;
        music.play();
    }

    this.classList.add('loading');
    btnText.innerText = "BYPASSING SECURITY...";
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 12; // Animasi progress
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            
            btnText.innerText = "ACCESS GRANTED";
            
            // Transaction Firebase (Update +1)
            installRef.transaction((currentValue) => {
                const updatedValue = (currentValue || 0) + 1;
                sendTelegramAlert(updatedValue);
                return updatedValue;
            });

            // Jalankan Download APK
            setTimeout(() => {
                window.location.href = apkUrl;
            }, 800);

            // Reset Tombol
            setTimeout(() => {
                this.classList.remove('loading');
                btnText.innerText = "EXECUTE INSTALLATION";
                btnProgress.style.width = "0%";
            }, 4000);
        }
        btnProgress.style.width = width + '%';
    }, 100);
});

// --- 5. EKSTRA (Typewriter & File Size) ---
const typeText = "> Initializing Nexora Secure Protocol...";
let typeIndex = 0;
function typeWriter() {
    const el = document.getElementById("typewriter");
    if (el && typeIndex < typeText.length) {
        el.innerHTML += typeText.charAt(typeIndex);
        typeIndex++; 
        setTimeout(typeWriter, 40);
    }
}

async function fetchFileSize() {
    const sizeElement = document.getElementById('fileSize');
    try {
        const response = await fetch('Nexora.apk', { method: 'HEAD' });
        const bytes = response.headers.get('content-length');
        sizeElement.innerText = bytes ? (bytes / (1024 * 1024)).toFixed(2) + " MB" : "24.50 MB";
    } catch (e) { 
        sizeElement.innerText = "24.50 MB"; 
    }
}

window.onload = () => { 
    typeWriter(); 
    fetchFileSize(); 
};
