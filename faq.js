document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.faq-item');

    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const wasActive = item.classList.contains('active');
                    
                    accordionItems.forEach(otherItem => {
                        if (otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });

                    if (!wasActive) {
                        item.classList.add('active');
                    }
                });
            }
        });

        const firstItem = accordionItems[0];
        if (firstItem) {
            setTimeout(() => {
                firstItem.classList.add('active');
            }, 500); 
        }
    }
});
