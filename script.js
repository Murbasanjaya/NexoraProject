// Tambahkan ini di bagian paling atas downloadBtn.addEventListener('click', ...
const music = document.getElementById('bgMusic');
if (music.paused) {
    music.volume = 0.3; // Set volume 30% agar tidak kaget
    music.play();
}

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
const installRef = database.ref('total_installs');

// --- KONFIGURASI BOT TELEGRAM (Sudah Diisi) ---
const TELEGRAM_BOT_TOKEN = "8656411338:AAHCKBjZJzf_i4AMOOW2sHCK_IdIlTkZMY4"; 
const TELEGRAM_CHAT_ID = "2044673218"; 

let currentTotalInstalls = 0;

// --- 1. AMBIL DATA REALTIME DARI FIREBASE ---
installRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const installCountElement = document.getElementById('installCount');
    if (data !== null) {
        currentTotalInstalls = data;
        installCountElement.innerText = data.toLocaleString('id-ID');
    } else {
        installRef.set(1500); 
    }
});

// --- 2. FITUR BACA UKURAN FILE (Perbaikan Bug 0.00MB) ---
async function fetchFileSize() {
    const sizeElement = document.getElementById('fileSize');
    try {
        const response = await fetch('Nexora.apk', { method: 'HEAD' });
        const bytes = response.headers.get('content-length');
        
        if (bytes && bytes > 0) {
            const mb = bytes / (1024 * 1024);
            sizeElement.innerText = mb.toFixed(2) + " MB";
        } else {
            sizeElement.innerText = "24.50 MB"; // Fallback jika size tdk terbaca
        }
    } catch (e) { 
        sizeElement.innerText = "24.50 MB"; 
    }
}

// --- 3. TELEGRAM NOTIFIER (Dengan Info Total Install) ---
function sendTelegramAlert(newTotal) {
    const time = new Date().toLocaleString('id-ID');
    const msg = `🚨 *NEXORA NOTIFICATION*\n\n` +
                `Target baru saja mengunduh APK!\n` +
                `🕒 Waktu: ${time}\n` +
                `📊 Total Installs Sekarang: *${newTotal}*`;
    
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

// --- 4. LOGIK TOMBOL DOWNLOAD ---
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.querySelector('.btn-text');
const btnProgress = document.querySelector('.btn-progress');

downloadBtn.addEventListener('click', function(e) {
    if (downloadBtn.classList.contains('loading')) {
        e.preventDefault(); 
        return;
    }
    
    downloadBtn.classList.add('loading');
    btnText.innerText = "BYPASSING SECURITY...";
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 12;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            
            btnText.innerText = "DOWNLOAD STARTED";
            
            // UPDATE DATABASE & KIRIM NOTIF
            installRef.transaction((currentValue) => {
                const updatedValue = (currentValue || 0) + 1;
                // Kirim notif dengan angka terbaru
                sendTelegramAlert(updatedValue);
                return updatedValue;
            });

            setTimeout(() => {
                btnText.innerText = "INITIALIZE DOWNLOAD";
                btnProgress.style.width = "0%";
                downloadBtn.classList.remove('loading');
            }, 3000);
        }
        btnProgress.style.width = width + '%';
    }, 150);
});

// Typewriter
const typeText = "> Initializing Nexora Secure Protocol...";
let typeIndex = 0;
function typeWriter() {
    if (typeIndex < typeText.length) {
        document.getElementById("typewriter").innerHTML += typeText.charAt(typeIndex);
        typeIndex++; 
        setTimeout(typeWriter, 40);
    }
}

window.onload = () => { 
    typeWriter(); 
    fetchFileSize(); 
};
