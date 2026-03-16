document.getElementById('currentYear').textContent = new Date().getFullYear();
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});


window.addEventListener('scroll', () => {
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('.nav-links a');
    let headerHeight = 80;
    
    sections.forEach(section => {
        let top = section.offsetTop - headerHeight - 10;
        let bottom = top + section.offsetHeight;
        let scroll = window.scrollY;
        let id = section.getAttribute('id');
        
        if (scroll >= top && scroll < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});


function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function closeToast() {
    document.getElementById('toast').classList.remove('show');
}


document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    
    
    const data = {
        nome: formData.get('Nome'),
        email: formData.get('Email'),
        whatsapp: formData.get('WhatsApp'),
        mensagem: formData.get('Mensagem')
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showToast('✅ Mensagem enviada com sucesso!');
            form.reset();
        } else {
            showToast('❌ ' + (result.error || 'Erro ao enviar. Tente novamente.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('❌ Erro de conexão. Verifique se o servidor está rodando.');
    }
});

// Animações
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .pricing-card, .grid-item, .about-content > *').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Menu mobile
function createMobileMenu() {
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.classList.add('menu-toggle');
            menuToggle.innerHTML = '☰';
            menuToggle.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                display: block;
            `;
            
            nav.insertBefore(menuToggle, navLinks);
            
            menuToggle.addEventListener('click', () => {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '70px';
                    navLinks.style.left = '0';
                    navLinks.style.width = '100%';
                    navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
                    navLinks.style.padding = '1rem';
                    navLinks.style.backdropFilter = 'blur(10px)';
                }
            });
        }
    } else {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (menuToggle) {
            menuToggle.remove();
            navLinks.style.display = 'flex';
            navLinks.style.position = 'static';
            navLinks.style.flexDirection = 'row';
            navLinks.style.width = 'auto';
            navLinks.style.background = 'none';
            navLinks.style.padding = '0';
        }
    }
}

window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);