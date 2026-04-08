// ===================================
// CORONEL CHATBOX - ASISTENTE VIRTUAL
// ===================================

class CoronelChatbox {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = {
            'hola': '¡Hola! Soy CORONEL BOT, tu asistente virtual. ¿En qué puedo ayudarte?',
            'ayuda': 'Puedo ayudarte con: \n• Información sobre las unidades del curso\n• Navegación por la plataforma\n• Dudas sobre tareas y fechas límite\n• Cómo subir archivos\n• Ver tu progreso\n• Contacto con el profesor',
            'unidades': 'El curso tiene 4 unidades:\n1. Fundamentos de Arquitectura SW\n2. Patrones Arquitectónicos\n3. Diseño y Modelado\n4. Evaluación y Optimización',
            'contacto': 'Puedes contactar a CORONEL GUEVARA:\n📧 q03478j@uppla.edu.pe\n📱 +51 927125942',
            'default': 'Interesante pregunta. Para más información, contáctanos en q03478j@uppla.edu.pe o visita la sección de contacto.'
        };
        this.init();
    }

    init() {
        this.createChatboxHTML();
        this.setupEventListeners();
        this.loadFromStorage();
    }

    createChatboxHTML() {
        const chatboxHTML = `
            <div class="coronel-chatbox" id="coronelChatbox">
                <div class="chat-toggle" id="chatToggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5C21 16.75 16.75 21 11.5 21C10.39 21 9.33 20.81 8.34 20.46L3 22L4.54 16.66C4.19 15.67 4 14.61 4 13.5C4 8.25 8.25 4 13.5 4C16.73 4 19.55 5.68 21 8.23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="10" cy="12" r="1" fill="currentColor"/>
                        <circle cx="14" cy="12" r="1" fill="currentColor"/>
                        <circle cx="18" cy="12" r="1" fill="currentColor"/>
                    </svg>
                    <span class="chat-badge">CORONEL</span>
                </div>

                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="chat-avatar">
                                <img src="images/coronel.jpg" alt="CORONEL" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.src='https://ui-avatars.com/api/?name=Coronel+Bot&background=0D8ABC&color=fff'">
                            </div>
                            <div>
                                <h4>CORONEL BOT</h4>
                                <span class="chat-status">Online</span>
                            </div>
                        </div>
                        <button class="chat-close" id="chatClose">×</button>
                    </div>

                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-message bot-message">
                            <div class="message-content">
                                👋 ¡Hola! Soy CORONEL, tu asistente virtual. ¿En qué puedo ayudarte hoy?
                                <div class="quick-replies">
                                    <button class="quick-reply" data-message="hola">Saludar</button>
                                    <button class="quick-reply" data-message="ayuda">Ayuda</button>
                                    <button class="quick-reply" data-message="unidades">Ver Unidades</button>
                                    <button class="quick-reply" data-message="contacto">Contacto</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="chat-input-container">
                        <input type="text" id="chatInput" class="chat-input" placeholder="Escribe tu mensaje...">
                        <button class="chat-send" id="chatSend">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatboxHTML);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('chatToggle');
        const closeBtn = document.getElementById('chatClose');
        const sendBtn = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.dataset.message;
                this.handleQuickReply(message);
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        chatWindow.classList.toggle('active');

        if (this.isOpen) {
            document.getElementById('chatInput').focus();
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chatWindow').classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    handleQuickReply(keyword) {
        const response = this.responses[keyword] || this.responses.default;
        this.addMessage(keyword, 'user');
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;

        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(text)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ text, type, timestamp: new Date() });
        this.saveToStorage();
    }

    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        for (const [keyword, response] of Object.entries(this.responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        return this.responses.default;
    }

    saveToStorage() {
        localStorage.setItem('coronel_chat_messages', JSON.stringify(this.messages));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('coronel_chat_messages');
        if (saved) {
            this.messages = JSON.parse(saved);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.coronelChatbox = new CoronelChatbox();

    // Exportar al namespace global (opcional)
    window.CORONEL = window.CORONEL || {};
    window.CORONEL.chatbox = window.coronelChatbox;
});
