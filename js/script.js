document.addEventListener('DOMContentLoaded', () => {
    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    refreshIcons();

    const isNestedPage = window.location.pathname.replace(/\\/g, '/').includes('/html/');
    if (isNestedPage) {
        const homeHrefMap = {
            '#': '../index.html',
            'index.html': '../index.html',
            'index.html#intro': '../index.html#intro',
            'index.html#payment-support': '../index.html#payment-support',
            'index.html#process': '../index.html#process',
            'index.html#faq-preview': '../index.html#faq-preview',
            'index.html#support': '../index.html#support'
        };

        document.querySelectorAll('a[href]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            const nextHref = homeHrefMap[href];

            if (nextHref) {
                anchor.setAttribute('href', nextHref);
            }
        });
    }

    const currentPath = window.location.pathname.replace(/\\/g, '/');
    const currentPage = currentPath.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const rawHref = link.getAttribute('href') || '';
        const normalizedHref = rawHref.replace(/^\.\.\//, '');

        const isHomeLink = currentPage === 'index.html' && normalizedHref === 'index.html';
        const isCurrentPageLink = normalizedHref.endsWith(currentPage);

        if (isHomeLink || isCurrentPageLink) {
            link.classList.add('active-link');
        }
    });

    const sections = document.querySelectorAll('.animate-section');
    const revealSection = (section) => {
        section.classList.add('is-visible');
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealSection(entry.target);
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
    } else {
        sections.forEach(revealSection);
    }

    window.setTimeout(() => {
        sections.forEach(revealSection);
    }, 1200);

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
        const isEnglishPage = document.documentElement.lang.toLowerCase().startsWith('en');
        const menuLabels = isEnglishPage
            ? { open: 'Open navigation menu', close: 'Close navigation menu' }
            : { open: '打开导航菜单', close: '关闭导航菜单' };

        const setMenuButton = (isMenuOpen) => {
            menuButton.setAttribute('aria-expanded', String(isMenuOpen));
            menuButton.setAttribute('aria-label', isMenuOpen ? menuLabels.close : menuLabels.open);
            menuButton.setAttribute('title', isMenuOpen ? menuLabels.close : menuLabels.open);
            menuButton.innerHTML = `<i data-lucide="${isMenuOpen ? 'x' : 'menu'}"></i>`;
            refreshIcons();
        };

        const closeMobileMenu = () => {
            mobileMenu.classList.add('hidden');
            menuButton.setAttribute('aria-expanded', 'false');
            setMenuButton(false);
        };

        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            menuButton.setAttribute('aria-expanded', String(isMenuOpen));
            setMenuButton(isMenuOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
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

    const blogFilterButtons = document.querySelectorAll('[data-blog-filter]');
    const blogArticles = document.querySelectorAll('[data-blog-tags]');
    const blogEmptyState = document.getElementById('blog-empty-state');

    if (blogFilterButtons.length && blogArticles.length) {
        const activeFilterClasses = ['bg-slate-900', 'text-white', 'hover:bg-slate-800'];
        const inactiveFilterClasses = ['bg-sky-500/10', 'text-sky-400', 'hover:bg-sky-500/20'];
        const normalizeFilter = (value) => (value || '').trim().toLowerCase();
        const knownFilters = Array.from(blogFilterButtons).map(button => normalizeFilter(button.dataset.blogFilter));

        const setFilterButtonState = (activeFilter) => {
            blogFilterButtons.forEach(button => {
                const isActive = normalizeFilter(button.dataset.blogFilter) === activeFilter;
                button.setAttribute('aria-pressed', String(isActive));
                button.classList.remove(...activeFilterClasses, ...inactiveFilterClasses);
                button.classList.add(...(isActive ? activeFilterClasses : inactiveFilterClasses));
            });
        };

        const updateFilterHash = (filter) => {
            const nextUrl = new URL(window.location.href);
            nextUrl.hash = filter === 'all' ? '' : `category=${encodeURIComponent(filter)}`;
            window.history.replaceState(null, '', nextUrl.toString());
        };

        const applyBlogFilter = (filter, shouldUpdateHash = true) => {
            const activeFilter = knownFilters.includes(normalizeFilter(filter)) ? normalizeFilter(filter) : 'all';
            let visibleCount = 0;

            blogArticles.forEach(article => {
                const articleTags = (article.dataset.blogTags || '').split('|').map(normalizeFilter);
                const shouldShow = activeFilter === 'all' || articleTags.includes(activeFilter);
                article.hidden = !shouldShow;
                article.classList.toggle('hidden', !shouldShow);

                if (shouldShow) visibleCount += 1;
            });

            if (blogEmptyState) {
                blogEmptyState.classList.toggle('hidden', visibleCount > 0);
            }

            setFilterButtonState(activeFilter);

            if (shouldUpdateHash) {
                const activeButton = Array.from(blogFilterButtons).find(button => normalizeFilter(button.dataset.blogFilter) === activeFilter);
                updateFilterHash(activeButton?.dataset.blogFilter || 'all');
            }
        };

        const initialHashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        applyBlogFilter(initialHashParams.get('category') || 'all', false);

        blogFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                applyBlogFilter(button.dataset.blogFilter || 'all');
            });
        });
    }

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
        refreshIcons();
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
            refreshIcons();
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
            refreshIcons();
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

    // Shop More Modal
    const shopMoreButtons = [
        document.getElementById('shop-more-btn'),
        document.getElementById('mobile-shop-more-btn')
    ];
    const shopMoreModal = document.getElementById('shop-more-modal');
    const shopModalOverlay = document.getElementById('shop-modal-overlay');
    const shopModalCloseBtn = document.getElementById('shop-modal-close-btn');
    const countdownTimer = document.getElementById('countdown-timer');
    const shopUrl = 'https://fe.dtyuedan.cn/shop/yueshi';

    let countdownInterval = null;

    if (shopMoreModal) {
        const openShopModal = () => {
            shopMoreModal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            refreshIcons();

            // Start countdown
            let count = 3;
            countdownTimer.textContent = count;

            countdownInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownTimer.textContent = count;
                } else {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    // Redirect to shop
                    window.open(shopUrl, '_blank');
                    closeShopModal();
                }
            }, 1000);
        };

        const closeShopModal = () => {
            shopMoreModal.classList.remove('is-visible');
            document.body.style.overflow = '';

            // Clear countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            countdownTimer.textContent = '3';
        };

        shopMoreButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openShopModal();
                });
            }
        });

        if (shopModalOverlay) {
            shopModalOverlay.addEventListener('click', closeShopModal);
        }

        if (shopModalCloseBtn) {
            shopModalCloseBtn.addEventListener('click', closeShopModal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && shopMoreModal.classList.contains('is-visible')) {
                closeShopModal();
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
