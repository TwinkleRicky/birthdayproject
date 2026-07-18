const MESSAGES_KEY = 'birthdayMessages';
const PASSWORD = 'rickychoi719!';

window.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setupEventListeners();
    createMonochromeParticles(); 
});

function setupEventListeners() {
    const nameChoice = document.querySelectorAll('input[name="nameChoice"]');
    nameChoice.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const nameInput = document.getElementById('nameInput');
            if (e.target.value === 'named') {
                nameInput.style.display = 'block';
                document.getElementById('senderName').focus();
            } else {
                nameInput.style.display = 'none';
            }
        });
    });

    document.getElementById('messageText').addEventListener('input', (e) => {
        document.getElementById('charCount').textContent = e.target.value.length;
    });

    document.getElementById('messageText').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitMessage();
        }
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(screenId).classList.add('active');
    }, 50);
}

function goToWrite() {
    showScreen('writeScreen');
    document.getElementById('messageText').value = '';
    document.getElementById('senderName').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('anonymous').checked = true;
    document.getElementById('nameInput').style.display = 'none';
}

function showPasswordScreen() {
    showScreen('passwordScreen');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('passwordError').classList.remove('show');
    document.getElementById('passwordInput').focus();
}

function backToMain() {
    showScreen('mainScreen');
    document.getElementById('passwordError').textContent = '';
    document.getElementById('passwordError').classList.remove('show');
}

function submitMessage() {
    const nameChoice = document.querySelector('input[name="nameChoice"]:checked').value;
    let senderName = '';

    if (nameChoice === 'named') {
        senderName = document.getElementById('senderName').value.trim();
        if (!senderName) {
            alert('이름을 입력하세요.');
            return;
        }
    } else {
        senderName = '익명';
    }

    const messageText = document.getElementById('messageText').value.trim();
    if (!messageText) {
        alert('메시지를 입력하세요.');
        return;
    }

    const message = {
        sender: senderName,
        content: messageText,
        timestamp: new Date().toLocaleString('ko-KR')
    };

    let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
    messages.unshift(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    showSuccessAnimation();
    setTimeout(() => {
        alert('메시지가 전송되었습니다.');
        backToMain();
    }, 600);
}

function showSuccessAnimation() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 40);
    }
}

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('passwordError');

    if (passwordInput === PASSWORD) {
        errorMsg.classList.remove('show');
        showScreen('viewScreen');
        loadMessages();
    } else {
        errorMsg.textContent = '비밀번호가 일치하지 않습니다.';
        errorMsg.classList.add('show');
        document.getElementById('passwordInput').value = '';
    }
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
    const messagesList = document.getElementById('messagesList');
    const noMessages = document.getElementById('noMessages');

    if (messages.length === 0) {
        messagesList.innerHTML = '';
        noMessages.style.display = 'block';
        return;
    }

    noMessages.style.display = 'none';

    messagesList.innerHTML = messages.map((msg, index) => `
        <div class="message-card">
            <div class="message-sender">${escapeHtml(msg.sender)}</div>

            <div class="message-content">
                ${escapeHtml(msg.content)}
            </div>

            <div class="message-time">
                ${msg.timestamp}
            </div>

            <button class="delete-btn" onclick="deleteMessage(${index})">
                삭제
            </button>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createMonochromeParticles() {
    setInterval(() => {
        createParticle();
    }, 400);
}

function createParticle() {
    const particle = document.createElement('div');
    const container = document.querySelector('.confetti');
    
    // 밝은 배경에 대비되도록 검은색 계열로 흩날림
    const grayscaleColors = ['#000', '#111', '#222', '#333'];
    
    particle.style.position = 'absolute';
    particle.style.width = (Math.random() * 8 + 2) + 'px';
    particle.style.height = (Math.random() * 15 + 5) + 'px';
    particle.style.backgroundColor = grayscaleColors[Math.floor(Math.random() * grayscaleColors.length)];
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '-20px';
    particle.style.opacity = Math.random() * 0.7 + 0.3;
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    container.appendChild(particle);
    
    let top = -20;
    let rotation = 0;
    let velocity = Math.random() * 2 + 1;
    
    const animation = setInterval(() => {
        top += velocity;
        rotation += velocity;
        particle.style.top = top + 'px';
        particle.style.transform = `rotate(${rotation}deg)`;
        
        if (top > window.innerHeight) {
            clearInterval(animation);
            particle.remove();
        }
    }, 20);
}

function deleteMessage(index) {

    if (!confirm("이 메시지를 삭제하시겠습니까?")) {
        return;
    }

    let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];

    messages.splice(index, 1);

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    loadMessages();
}
