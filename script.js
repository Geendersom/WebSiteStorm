
// CONFIGURAÇÃO INICIAL - CARREGAMENTO DO DOM

// Aguarda o carregamento completo do DOM antes de executar o JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // FUNCIONALIDADE DO MENU MOBILE
    
    // Seleciona elementos do menu hambúrguer
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Verifica se os elementos existem antes de adicionar eventos
    if (hamburger && navMenu) {
        // Adiciona evento de clique no menu hambúrguer
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // SCROLL SUAVE PARA LINKS DE NAVEGAÇÃO

    // Seleciona todos os links de navegação que apontam para âncoras
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        // Adiciona evento de clique para cada link
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o comportamento padrão
            const targetId = this.getAttribute('href'); // Pega o ID do alvo
            const targetSection = document.querySelector(targetId); // Seleciona a seção alvo
            
            if (targetSection) {
                // Calcula a posição considerando o header fixo
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth' // Scroll suave
                });
                
                // Fecha o menu mobile se estiver aberto
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // EFEITO DE SCROLL NO HEADER
    
    // Seleciona o elemento header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    // Adiciona evento de scroll para mudar a aparência do header
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Muda a aparência do header quando scroll passa de 100px
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // INTERSECTION OBSERVER PARA ANIMAÇÕES
    
    // Configurações para o Intersection Observer
    const observerOptions = {
        threshold: 0.1, // Trigger quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem para ativar antes do elemento aparecer
    };
    
    // Cria o observer para animar elementos quando entram na tela
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Anima o elemento quando ele fica visível
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Seleciona elementos para animação e configura o estado inicial
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .benefit-item');
    animatedElements.forEach(el => {
        // Define estado inicial dos elementos (invisíveis e deslocados)
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el); // Inicia a observação do elemento
    });
    
    // ANIMAÇÃO DOS CONTADORES DE ESTATÍSTICAS
    
    // Seleciona todos os números de estatísticas
    const stats = document.querySelectorAll('.stat-number');
    
    // Cria observer específico para os contadores
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target); // Inicia animação do contador
                statsObserver.unobserve(entry.target); // Para de observar após animação
            }
        });
    }, { threshold: 0.5 }); // Trigger quando 50% do elemento está visível
    
    // Inicia observação de cada estatística
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // FUNÇÃO DE ANIMAÇÃO DOS CONTADORES
    
    function animateCounter(element) {
        const target = element.textContent; // Pega o texto atual do elemento
        const isPercentage = target.includes('%'); // Verifica se é porcentagem
        const isK = target.includes('K'); // Verifica se tem 'K' (milhares)
        const isM = target.includes('M'); // Verifica se tem 'M' (milhões)
        const hasPlus = target.includes('+'); // Verifica se há sufixo '+' simples

        // Descobre casas decimais no valor original (ex.: 1.2K -> 1 casa)
        const decimalMatch = target.match(/\.(\d+)/);
        const decimalPlaces = decimalMatch ? decimalMatch[1].length : 0;

        // Extrai o número final baseado no tipo
        let finalNumber;
        if (isM) {
            finalNumber = parseFloat(target.replace('M', ''));
        } else if (isK) {
            finalNumber = parseFloat(target.replace('K', ''));
        } else if (isPercentage) {
            finalNumber = parseFloat(target.replace('%', ''));
        } else {
            finalNumber = parseFloat(target.replace('+', ''));
        }

        // Configura a animação
        let current = 0;
        const steps = 50;
        const increment = finalNumber / steps; // Divide em 50 etapas para animação suave
        const timer = setInterval(() => {
            current += increment;

            // Para quando chega no número final
            if (current >= finalNumber) {
                current = finalNumber;
                clearInterval(timer);
            }

            // Atualiza o texto do elemento com o valor atual
            let valueString = decimalPlaces > 0
                ? current.toFixed(decimalPlaces)
                : String(Math.floor(current));

            if (isM) {
                element.textContent = valueString + 'M+';
            } else if (isK) {
                element.textContent = valueString + 'K+';
            } else if (isPercentage) {
                element.textContent = valueString + '%';
            } else if (hasPlus) {
                element.textContent = valueString + '+';
            } else {
                element.textContent = valueString;
            }
        }, 30); // Executa a cada 30ms para animação fluida
    }
    
    // EFEITOS HOVER NOS CARDS DE PREÇOS
    
    // Seleciona todos os cards de preços
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        // Efeito quando o mouse entra no card
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        // Efeito quando o mouse sai do card
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // ANIMAÇÃO DA INTERFACE DO WHATSAPP
    
    // Seleciona todas as mensagens do chat
    const chatMessages = document.querySelectorAll('.message');
    let messageIndex = 0;
    
    function animateChat() {
        if (messageIndex < chatMessages.length) {
            chatMessages[messageIndex].style.opacity = '0';
            chatMessages[messageIndex].style.transform = 'translateX(-20px)';
            chatMessages[messageIndex].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                chatMessages[messageIndex].style.opacity = '1';
                chatMessages[messageIndex].style.transform = 'translateX(0)';
                messageIndex++;
                
                if (messageIndex < chatMessages.length) {
                    setTimeout(animateChat, 1000);
                } else {
                    // Restart animation after 3 seconds
                    setTimeout(() => {
                        messageIndex = 0;
                        chatMessages.forEach(msg => {
                            msg.style.opacity = '0';
                            msg.style.transform = 'translateX(-20px)';
                        });
                        setTimeout(animateChat, 500);
                    }, 3000);
                }
            }, 100);
        }
    }
    
    // Start chat animation when hero section is visible
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateChat, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // EFEITOS DE CLIQUE NOS BOTÕES (RIPPLE)
    
    // Seleciona todos os botões
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    buttons.forEach(button => {
        // Adiciona efeito ripple quando clicado
        button.addEventListener('click', function(e) {
            // Cria elemento para o efeito ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Configura o elemento ripple
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Adiciona o ripple ao botão
            this.appendChild(ripple);
            
            // Remove o ripple após a animação
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // VALIDAÇÃO DE FORMULÁRIOS (FUTURO)
    
    // Função para validar email (para uso futuro com formulários)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // EFEITO PARALLAX NO FUNDO DO HERO
    
    // Adiciona efeito parallax ao fundo da seção hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5; // Velocidade do parallax
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // LAZY LOADING DE IMAGENS (FUTURO)
    
    // Seleciona imagens com atributo data-src para lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Carrega a imagem
                img.classList.remove('lazy');
                imageObserver.unobserve(img); // Para de observar
            }
        });
    });
    
    // Inicia observação de cada imagem
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // BOTÃO VOLTAR AO TOPO
    
    // Cria botão para voltar ao topo da página
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    
    // Estilos inline do botão
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Adiciona o botão ao DOM
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn-primary, .btn-secondary, .btn-outline {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background-color: white;
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                padding: 20px 0;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 15px 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Header scroll effect
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Scroll to top button
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 10);
    
    window.removeEventListener('scroll', function() {});
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // FINALIZAÇÃO DO CARREGAMENTO
    
    console.log('StormCHAT website loaded successfully! 🚀');
});

// FUNÇÕES UTILITÁRIAS ADICIONAIS

// Função para exibir notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Anima a entrada da notificação
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// EXPORTAÇÃO DE FUNÇÕES PARA USO EXTERNO

// Disponibiliza funções para uso externo via window.StormCHAT
window.StormCHAT = {
    showNotification: showNotification
};
