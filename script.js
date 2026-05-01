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
    e.preventDefault(); 
    
    if (downloadBtn.classList.contains('loading')) return;
    
    downloadBtn.classList.add('loading');
    btnText.innerText = "DOWNLOADING...";
    
    let width = 0;
    const interval = setInterval(() => {
        // Efek loading acak biar makin kerasa ala hacker
        width += Math.random() * 10; 
        if (width >= 100) width = 100;
        
        btnProgress.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            btnText.innerText = "DOWNLOAD STARTED";
            
            // Mengarahkan langsung ke file Nexora.apk di repository
            setTimeout(() => {
                window.location.href = "Nexora.apk"; 
                
                // Reset tombol setelah beberapa detik
                setTimeout(() => {
                    btnText.innerText = "INITIALIZE DOWNLOAD";
                    btnProgress.style.width = "0%";
                    downloadBtn.classList.remove('loading');
                }, 3000);
            }, 800);
        }
    }, 150); // Kecepatan loading (bisa kamu percepat/perlambat)
});
