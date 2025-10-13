document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const sections = document.querySelectorAll('.animate-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });
    sections.forEach(section => {
        observer.observe(section);
    });

    const bookmarkBanner = document.getElementById('bookmark-banner');
    const dismissButton = document.getElementById('bookmark-dismiss');
    const acceptButton = document.getElementById('bookmark-accept');

    if (dismissButton && bookmarkBanner) {
        dismissButton.addEventListener('click', () => {
            bookmarkBanner.classList.add('is-hidden');
        });
    }

    if (acceptButton && bookmarkBanner) {
        acceptButton.addEventListener('click', () => {
            const isMac = navigator.platform.indexOf('Mac') >= 0;
            showToast(`请使用快捷键 <b>${isMac ? '⌘+D' : 'Ctrl+D'}</b> 收藏本页面<br>或手动添加到书签栏。`);
            bookmarkBanner.classList.add('is-hidden');
        });
    }

    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
        const menuIcon = menuButton.querySelector('i');
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            if (isMenuOpen) {
                menuButton.innerHTML = '<i data-lucide="x"></i>';
            } else {
                menuButton.innerHTML = '<i data-lucide="menu"></i>';
            }
            lucide.createIcons();
        });
    }

    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const isRechargeBtn = this.classList.contains('recharge-btn');
            const targetId = this.getAttribute('href');

            if (isRechargeBtn || targetId.length <= 1) {
                 e.preventDefault();
            } else {
                 const targetElement = document.querySelector(targetId);
                 if(targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        if (isLight) {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }

        const iconName = isLight ? 'moon' : 'sun';

        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = `<i data-lucide="${iconName}" class="w-6 h-6"></i>`;
        }
        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.innerHTML = `<i data-lucide="${iconName}" class="w-7 h-7"></i>`;
        }
        lucide.createIcons();
    };

    const toggleTheme = () => {
        const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const toastPopup = document.getElementById('toast-popup');
    const toastDetails = document.getElementById('toast-details');
    if (toastPopup && toastDetails) {
        const manageToast = () => {
            const updateToastContent = () => {
                const timeInSeconds = Math.floor(Math.random() * (30 * 60 - 3)) + 3;
                let timeString;
                if (timeInSeconds < 60) {
                    timeString = `${timeInSeconds}秒前`;
                } else {
                    timeString = `${Math.floor(timeInSeconds / 60)}分钟前`;
                }
                toastDetails.textContent = `${timeString}, 升级成功用户+1`;
            };

            const cycle = () => {
                const hideDuration = Math.floor(Math.random() * 8 + 3) * 1000;

                setTimeout(() => {
                    updateToastContent();
                    toastPopup.classList.add('toast-visible');

                    setTimeout(() => {
                        toastPopup.classList.remove('toast-visible');
                        cycle();
                    }, 5000);

                }, hideDuration);
            };

            setTimeout(cycle, 3000);
        };
        manageToast();
    }

    const rechargeButtons = document.querySelectorAll('.recharge-btn');
    const rechargeModal = document.getElementById('recharge-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (rechargeModal && rechargeButtons.length > 0) {
        const openModal = () => {
            rechargeModal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        };

        const closeModal = () => {
            rechargeModal.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        rechargeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rechargeModal.classList.contains('is-visible')) {
                closeModal();
            }
        });
    }

    // Purchase Notice Modal
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    const purchaseNoticeModal = document.getElementById('purchase-notice-modal');
    const purchaseModalOverlay = document.getElementById('purchase-modal-overlay');
    const purchaseModalCloseBtn = document.getElementById('purchase-modal-close-btn');

    if (purchaseNoticeModal && purchaseButtons.length > 0) {
        const openPurchaseModal = () => {
            purchaseNoticeModal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        };

        const closePurchaseModal = () => {
            purchaseNoticeModal.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        purchaseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openPurchaseModal();
            });
        });

        if (purchaseModalOverlay) {
            purchaseModalOverlay.addEventListener('click', closePurchaseModal);
        }

        if (purchaseModalCloseBtn) {
            purchaseModalCloseBtn.addEventListener('click', closePurchaseModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && purchaseNoticeModal.classList.contains('is-visible')) {
                closePurchaseModal();
            }
        });
    }
});

function copyWeixin() {
    const wx = document.getElementById('wxid').innerText;
    navigator.clipboard.writeText(wx).then(() => {
        const tip = document.getElementById('copyTip');
        tip.style.opacity = 1;
        setTimeout(() => {
            tip.style.opacity = 0
        }, 1000);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.querySelector('div').innerHTML = msg;
    toast.style.opacity = 1;
    toast.style.pointerEvents = 'auto';
    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.pointerEvents = 'none';
    }, 2000);
}