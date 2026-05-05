/* =========================================
   NEXORA SHARE LOGIC - V1
   ========================================= */
window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    document.querySelectorAll(".blur-reveal").forEach((el, i) => {
        setTimeout(() => {
            el.classList.add("active");
        }, i * 150);
    });
});
// EDIT TEXT SHARE DI SINI
const shareSettings = {
    text: "Apk bug wa gratis/free? Pumpung lagi ada free trial 30 days, kgk tau makenya pm ke +62 821-2699-9692",
    link: window.location.origin + "/", // Mengambil link website otomatis
    targetCount: 2
};

let currentShares = 0;

document.addEventListener("DOMContentLoaded", () => {
    const btnWA = document.getElementById("btnWhatsApp");
    const btnDL = document.getElementById("btnFinalDownload");
    const progressBar = document.getElementById("progressBar");
    const shareText = document.getElementById("shareCount");

    btnWA.onclick = () => {
        // Gabungkan teks dan link
        const fullMessage = encodeURIComponent(shareSettings.text + " " + shareSettings.link);
        const waUrl = `https://wa.me/?text=${fullMessage}`;
        
        // Buka WhatsApp
        window.open(waUrl, '_blank');

        // Tambah count (Simulasi share)
        currentShares++;
        updateUI();
    };

    function updateUI() {
        if (currentShares > shareSettings.targetCount) currentShares = shareSettings.targetCount;
        
        // Update angka
        shareText.innerText = currentShares;
        
        // Update bar
        const percentage = (currentShares / shareSettings.targetCount) * 100;
        progressBar.style.width = percentage + "%";

        // Jika sudah 5x
        if (currentShares >= shareSettings.targetCount) {
            btnWA.style.display = "none";
            btnDL.style.display = "flex";
            setTimeout(() => {
                btnDL.classList.remove("disabled");
                btnDL.style.opacity = "1";
            }, 100);
        }
    }
    
function handleMusic() {
    const music = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicToggle");
    if(!music || !musicBtn) return;

    musicBtn.onclick = () => {
        if (music.paused) {
            music.play();
            musicBtn.innerText = "SOUND: ON";
            localStorage.setItem('nexora_music', 'on');
        } else {
            music.pause();
            musicBtn.innerText = "SOUND: OFF";
            localStorage.setItem('nexora_music', 'off');
        }
    };

    if (localStorage.getItem('nexora_music') === 'on') {
        document.addEventListener('click', () => {
            music.play().catch(() => {});
            musicBtn.innerText = "SOUND: ON";
        }, { once: true });
    }
}

    btnDL.onclick = () => {
        const btnText = btnDL.querySelector(".btn-text");
        const loader = btnDL.querySelector(".btn-progress");
        
        btnDL.classList.add("loading");
        btnText.innerText = "STARTING DOWNLOAD...";
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (loader) loader.style.width = progress + "%";
            
            if (progress >= 100) {
                clearInterval(interval);
                window.location.href = "Nexora.zip"; // Link file APK
                
                setTimeout(() => {
                    btnDL.classList.remove("loading");
                    btnText.innerText = "DOWNLOAD SEKARANG";
                    if (loader) loader.style.width = "0%";
                }, 3000);
            }
        }, 50);
    };
});