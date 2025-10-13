document.addEventListener('DOMContentLoaded', () => {
    const accordionCards = document.querySelectorAll('.troubleshoot-card');

    if (accordionCards.length > 0) {
        accordionCards.forEach(card => {
            const header = card.querySelector('.troubleshoot-header');
            const icon = card.querySelector('.troubleshoot-icon');

            if (header) {
                header.addEventListener('click', () => {
                    const isActive = card.classList.toggle('active');
                    
                    if (isActive) {
                        if(icon) icon.setAttribute('data-lucide', 'minus-circle');
                    } else {
                        if(icon) icon.setAttribute('data-lucide', 'plus-circle');
                    }
                    lucide.createIcons();
                });
            }
        });
    }
});
