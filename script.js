// Typewriter effect
const text = "> Establishing secure tunnel...";
const typewriterElement = document.getElementById("typewriter");
let index = 0;

function typeWriter() {
    if (index < text.length) {
        typewriterElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 40);
    } else {
        setTimeout(() => {
            typewriterElement.innerHTML = "> Connection established. Waiting for command.";
            typewriterElement.style.color = "#fff";
        }, 1000);
    }
}

window.onload = typeWriter;

// Fake Download Button Progress Effect
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.querySelector('.btn-text');
const btnProgress = document.querySelector('.btn-progress');

downloadBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Mencegah pindah halaman langsung
    
    // Cegah klik ganda
    if (downloadBtn.classList.contains('loading')) return;
    
    downloadBtn.classList.add('loading');
    btnText.innerText = "DOWNLOADING...";
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15; // Kecepatan acak
        if (width >= 100) width = 100;
        
        btnProgress.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            btnText.innerText = "DOWNLOAD COMPLETE";
            
            // Ganti URL di bawah dengan link file APK kamu
            setTimeout(() => {
                window.location.href = "LINK_APK_KAMU_DISINI"; 
            }, 500);
        }
    }, 200);
});
