document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');
    const modal = document.getElementById('qr-modal');
    const modalClose = modal?.querySelector('.qr-modal__close');
    const triggers = document.querySelectorAll('.qr-trigger');
    const revealItems = document.querySelectorAll('[data-reveal]');
    let lastTrigger = null;

    const closeMenu = () => {
        if (!menu || !menuToggle) return;
        menu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        if (!menu) return;
        const isOpen = menu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    const openModal = (trigger) => {
        if (!modal) return;
        lastTrigger = trigger;
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.classList.add('modal-open');
        modalClose?.focus();
    };

    const closeModal = () => {
        if (!modal || modal.hidden) return;
        modal.classList.remove('is-open');
        modal.hidden = true;
        document.body.classList.remove('modal-open');

        if (lastTrigger instanceof HTMLElement) {
            lastTrigger.focus();
        }
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            closeMenu();
            openModal(trigger);
        });
    });

    modal?.querySelectorAll('[data-modal-close]').forEach((control) => {
        control.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            closeModal();
        }
    });

    document.addEventListener('click', (event) => {
        if (!menu?.classList.contains('is-open') || !menuToggle) return;
        const target = event.target;

        if (target instanceof Node && !menu.contains(target) && !menuToggle.contains(target)) {
            closeMenu();
        }
    });

    if ('IntersectionObserver' in window) {
        document.documentElement.classList.add('motion-ready');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -8%',
            threshold: 0.08,
        });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }
});
