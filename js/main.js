AOS.init({
    duration: 680,
    once: true,
    offset: 55
});

/* NAVBAR SCROLL & ACTIVE LINK  */
window.addEventListener('scroll', function() {
    var navEl = document.getElementById('nav');
    if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 60);
    var bttEl = document.getElementById('btt');
    if (bttEl) bttEl.classList.toggle('show', window.scrollY > 300);
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/*  SMOOTH SCROLL + MOBILE NAV CLOSE  */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            // Close Bootstrap mobile navbar if open
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            // Scroll after slight delay to let navbar close
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});


/* SEARCH OVERLAY (only wired up on pages that have it) */
var searchOv = document.getElementById('searchOv');
var navSearchBtn = document.getElementById('navSearchBtn');
var searchCloseBtn = document.getElementById('searchClose');

function closeSearch() {
    if (searchOv) searchOv.classList.remove('open');
    document.body.style.overflow = '';
}

if (navSearchBtn && searchOv) {
    navSearchBtn.addEventListener('click', function() {
        searchOv.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function() {
            var si = document.getElementById('searchInput');
            if (si) si.focus();
        }, 220);
    });
}

if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
}

// Close when clicking backdrop
if (searchOv) {
    searchOv.addEventListener('click', function(e) {
        if (e.target === searchOv) closeSearch();
    });
}

// Category buttons inside search box
document.querySelectorAll('.sovcat').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.sovcat').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        var f = this.getAttribute('data-cat');
        closeSearch();
        setTimeout(function() {
            filterMenu(f);
            var menuSec = document.getElementById('menu');
            if (menuSec) {
                menuSec.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    });
});

// Trending tags fill the search input
document.querySelectorAll('.sovtrend .ttag').forEach(function(t) {
    t.addEventListener('click', function() {
        var si = document.getElementById('searchInput');
        if (si) {
            si.value = this.textContent.trim();
            si.focus();
        }
    });
});


$(document).ready(function() {
	$('.magnific_popup').magnificPopup({
	  disableOn: 700,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  fixedContentPos: false,
	  disableOn: 300
	});	
});


function filterMenu(cat) {
    // sync filter buttons
    document.querySelectorAll('.filtbtn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-f') === cat);
    });
    // sync category cards
    document.querySelectorAll('.catcard').forEach(function(c) {
        c.classList.toggle('active', c.getAttribute('data-filter') === cat);
    });
    // show/hide menu cards
    document.querySelectorAll('.mwrap').forEach(function(w) {
        var c = w.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            w.classList.remove('gone');
            w.style.opacity = '0';
            w.style.transform = 'translateY(16px)';
            setTimeout(function() {
                w.style.transition = 'opacity .38s,transform .38s';
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
            }, 60);
        } else {
            w.classList.add('gone');
        }
    });
}

// Filter buttons
document.querySelectorAll('.filtbtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterMenu(this.getAttribute('data-f'));
    });
});

// Category section cards -> scroll + filter
document.querySelectorAll('.catcard').forEach(function(card) {
    card.addEventListener('click', function() {
        var f = this.getAttribute('data-filter');
        var menuSec = document.getElementById('menu');
        if (menuSec) {
            window.scrollTo({
                top: menuSec.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        setTimeout(function() {
            filterMenu(f);
        }, 480);
    });
});


/* MENU ITEM POPUP (only wired up on pages that have it) */
var menuPop = document.getElementById('menuPop');
var mpQty = 1;

function openMenuPop(card) {
    if (!menuPop) return;
    var img = card.getAttribute('data-img');
    var title = card.getAttribute('data-title');
    var cat = card.getAttribute('data-cat');
    var price = card.getAttribute('data-price');
    var old = card.getAttribute('data-old');
    var rating = parseFloat(card.getAttribute('data-rating'));
    var reviews = card.getAttribute('data-reviews');
    var cal = card.getAttribute('data-cal');
    var time = card.getAttribute('data-time');
    var desc = card.getAttribute('data-desc');
    var tags = card.getAttribute('data-tags') || '';

    var mpImg = document.getElementById('mpImg');
    if (mpImg) mpImg.setAttribute('src', img);
    var mpCat = document.getElementById('mpCat');
    if (mpCat) mpCat.textContent = cat;
    var mpTitle = document.getElementById('mpTitle');
    if (mpTitle) mpTitle.textContent = title;

    var full = Math.round(rating),
        empty = 5 - full;
    var mpStars = document.getElementById('mpStars');
    if (mpStars) {
        mpStars.innerHTML =
            '<i class="fas fa-star"></i>'.repeat(full) + '\u2606'.repeat(empty) +
            ' <span style="color:#bbb;font-size:.78rem;">' + rating + ' (' + reviews + ' reviews)</span>';
    }

    var mpDesc = document.getElementById('mpDesc');
    if (mpDesc) mpDesc.textContent = desc;

    var mpPrice = document.getElementById('mpPrice');
    if (mpPrice) {
        mpPrice.innerHTML =
            price + (old ? '<small style="color:#ccc;text-decoration:line-through;margin-left:8px;font-size:1rem;">' + old + '</small>' : '');
    }

    var mpMeta = document.getElementById('mpMeta');
    if (mpMeta) {
        mpMeta.innerHTML =
            '<div class="mpm"><div class="mpmv">' + cal + ' kcal</div><div class="mpml">Calories</div></div>' +
            '<div class="mpm"><div class="mpmv">' + time + ' min</div><div class="mpml">Prep Time</div></div>' +
            '<div class="mpm"><div class="mpmv">' + rating + '/5</div><div class="mpml">Rating</div></div>';
    }

    var mpTags = document.getElementById('mpTags');
    if (mpTags) {
        mpTags.innerHTML =
            tags.split(',').filter(Boolean).map(function(t) {
                return '<span class="mptag">' + t.trim() + '</span>';
            }).join('');
    }

    mpQty = 1;
    var mpQnum = document.getElementById('mpQnum');
    if (mpQnum) mpQnum.textContent = 1;
    var mpAddCart = document.getElementById('mpAddCart');
    if (mpAddCart) {
        mpAddCart.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        mpAddCart.style.background = '';
    }

    menuPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Card click open popup
document.querySelectorAll('.mcard').forEach(function(card) {
    card.addEventListener('click', function() {
        openMenuPop(this);
    });
});

// + button  open popup (stop propagation to avoid double firing)
document.querySelectorAll('.madd').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMenuPop(this.closest('.mcard'));
    });
});

// Heart toggle (no popup)
document.querySelectorAll('.mhrt').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var ico = this.querySelector('i');
        ico.classList.toggle('far');
        ico.classList.toggle('fas');
        this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
    });
});

function closeMenuPop() {
    if (!menuPop) return;
    menuPop.classList.remove('open');
    document.body.style.overflow = '';
}

// Close popup
var mpCloseBtn = document.getElementById('mpClose');
if (mpCloseBtn) mpCloseBtn.addEventListener('click', closeMenuPop);
if (menuPop) {
    menuPop.addEventListener('click', function(e) {
        if (e.target === this) closeMenuPop();
    });
}

// Qty +/-
var mpPlusBtn = document.getElementById('mpPlus');
if (mpPlusBtn) {
    mpPlusBtn.addEventListener('click', function() {
        var mpQnum = document.getElementById('mpQnum');
        if (mpQnum) mpQnum.textContent = ++mpQty;
    });
}
var mpMinusBtn = document.getElementById('mpMinus');
if (mpMinusBtn) {
    mpMinusBtn.addEventListener('click', function() {
        if (mpQty > 1) {
            var mpQnum = document.getElementById('mpQnum');
            if (mpQnum) mpQnum.textContent = --mpQty;
        }
    });
}

// Add to cart button
var mpAddCartBtn = document.getElementById('mpAddCart');
if (mpAddCartBtn) {
    mpAddCartBtn.addEventListener('click', function() {
        var cartCount = document.getElementById('cartCount');
        if (cartCount) {
            var cnt = parseInt(cartCount.textContent) + mpQty;
            cartCount.textContent = cnt;
        }
        this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        this.style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
        var self = this;
        setTimeout(function() {
            closeMenuPop();
            self.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            self.style.background = '';
        }, 1000);
    });
}


/* RESERVATION BUTTON (only on pages that have it) */
var resBtn = document.getElementById('resBtn');
if (resBtn) {
    resBtn.addEventListener('click', function() {
        var btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        btn.disabled = true;
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
            btn.disabled = false;
            var ok = document.getElementById('resOk');
            if (ok) {
                ok.style.display = 'block';
                ok.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 1500);
    });
}


/* CONTACT FORM BUTTON (only on pages that have it) */
var ctcBtn = document.getElementById('ctcBtn');
if (ctcBtn) {
    ctcBtn.addEventListener('click', function() {
        var btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
            var ok = document.getElementById('ctcOk');
            if (ok) {
                ok.style.display = 'block';
                ok.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 1500);
    });
}


/* GALLERY POPUP (only wired up on pages that have it) */
var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

function openGal(i) {
    if (!galPop) return;
    galIdx = i;
    var g = galData[i];
    var gpImg = document.getElementById('gpImg');
    if (gpImg) gpImg.setAttribute('src', g.img);
    var gpTitle = document.getElementById('gpTitle');
    if (gpTitle) gpTitle.textContent = g.title;
    var gpDesc = document.getElementById('gpDesc');
    if (gpDesc) gpDesc.innerHTML = g.desc;
    galPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.gitem').forEach(function(item) {
    galData.push({
        img: item.getAttribute('data-gimg'),
        title: item.getAttribute('data-gtitle'),
        desc: item.getAttribute('data-gdesc')
    });
    item.addEventListener('click', function() {
        openGal(parseInt(this.getAttribute('data-gi')));
    });
});

function closeGal() {
    if (!galPop) return;
    galPop.classList.remove('open');
    document.body.style.overflow = '';
}

var gpCloseBtn = document.getElementById('gpClose');
if (gpCloseBtn) gpCloseBtn.addEventListener('click', closeGal);
if (galPop) {
    galPop.addEventListener('click', function(e) {
        if (e.target === this) closeGal();
    });
}

var gpPrevBtn = document.getElementById('gpPrev');
if (gpPrevBtn) {
    gpPrevBtn.addEventListener('click', function() {
        openGal((galIdx - 1 + galData.length) % galData.length);
    });
}
var gpNextBtn = document.getElementById('gpNext');
if (gpNextBtn) {
    gpNextBtn.addEventListener('click', function() {
        openGal((galIdx + 1) % galData.length);
    });
}

/*  ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeMenuPop();
        closeGal();
        if (typeof $.magnificPopup !== 'undefined') $.magnificPopup.close();
    }
});


/* TESTIMONIALS SWIPER (only on pages that have it)
   Initialized on window "load" (not immediately) so that all images/
   fonts have finished loading and the container has its final size -
   otherwise Swiper can compute the wrong slide widths on first paint
   and the carousel appears blank until the page is refreshed.
   observer/observeParents also make it auto re-calculate if the
   layout shifts (e.g. AOS animations, late-loading images/fonts). */
if (document.querySelector('.tesSwiper')) {
    window.addEventListener('load', function() {
        var tesSwiper = new Swiper('.tesSwiper', {
            slidesPerView: 1,
            spaceBetween: 22,
            loop: true,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                640: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            }
        });
        // Safety net: force a recalculation shortly after init in case
        // any late-loading assets (images/webfonts) still shifted the layout.
        setTimeout(function() {
            tesSwiper.update();
        }, 300);
    });
}


/* COUNTDOWN TIMER (only on pages that have it) */
if (document.getElementById('cdH')) {
    var cH = 8,
        cM = 45,
        cS = 30;
    setInterval(function() {
        cS--;
        if (cS < 0) {
            cS = 59;
            cM--;
        }
        if (cM < 0) {
            cM = 59;
            cH--;
        }
        if (cH < 0) {
            cH = 8;
            cM = 45;
            cS = 30;
        }
        document.getElementById('cdH').textContent = String(cH).padStart(2, '0');
        document.getElementById('cdM').textContent = String(cM).padStart(2, '0');
        document.getElementById('cdS').textContent = String(cS).padStart(2, '0');
    }, 1000);
}

/* NEWSLETTER (only on pages that have it) */
var nlBtn = document.getElementById('nlBtn');
if (nlBtn) {
    nlBtn.addEventListener('click', function() {
        var nlEmail = document.getElementById('nlEmail');
        var email = nlEmail ? nlEmail.value : '';
        if (email && email.includes('@')) {
            var btn = this;
            btn.textContent = '\u2713 Subscribed!';
            btn.style.background = '#4ade80';
            btn.style.color = '#222';
            if (nlEmail) nlEmail.value = '';
            setTimeout(function() {
                btn.textContent = 'Subscribe';
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        }
    });
}

/*  NUMBER COUNTER ANIMATION*/
var numAnimated = false;
window.addEventListener('scroll', function() {
    var hero = document.getElementById('hero');
    if (!numAnimated && hero && window.scrollY > hero.offsetHeight - 300) {
        numAnimated = true;
        document.querySelectorAll('.snum').forEach(function(el) {
            var txt = el.textContent;
            var num = parseInt(txt);
            var suf = txt.replace(/[0-9]/g, '');
            if (isNaN(num)) return;
            var start = 0;
            var step = Math.ceil(num / 55);
            var iv = setInterval(function() {
                start += step;
                if (start >= num) {
                    start = num;
                    clearInterval(iv);
                }
                el.textContent = start + suf;
            }, 1400 / 55);
        });
    }
});
