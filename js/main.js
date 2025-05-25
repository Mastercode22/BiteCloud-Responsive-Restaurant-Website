(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
// Back to top button
$(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
});
$('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
});



    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// --- Cart Sidebar Logic ---
const cart = [];

function updateCartSidebar() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const cartFinal = document.getElementById('cartFinal');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = 'No items in cart.';
        cartCount.textContent = '0';
        cartTotal.textContent = '0.00';
        cartDiscount.textContent = '';
        cartFinal.textContent = '0.00';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center mb-2';

        div.innerHTML = `
            <div class="d-flex align-items-center" style="gap: 10px;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                <span>${item.name} - $${item.price.toFixed(2)}</span>
            </div>
           <button class="btn btn-sm" style="background-color: #FEA116; color: white; border-radius: 10px; font-size:25px; " onclick="removeFromCart(${idx})">&times;</button>
        `;
        cartItemsDiv.appendChild(div);
    });

    cartCount.textContent = cart.length;
    let discount = 0;
    if (total > 50) {
        discount = total * 0.1;
        cartDiscount.textContent = `Discount: -$${discount.toFixed(2)}`;
    } else {
        cartDiscount.textContent = '';
    }
    const final = total - discount;
    cartTotal.textContent = total.toFixed(2);
    cartFinal.textContent = final.toFixed(2);
}

function addToCart(name, price, image) {
    cart.push({ name, price, image });
    updateCartSidebar();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    updateCartSidebar();
}

function checkoutCart() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order!');
    cart.length = 0;
    updateCartSidebar();
    closeCart();
}

// --- Cart Sidebar Toggle ---
const cartSidebar = document.getElementById('cartSidebar');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

function openCart() {
    cartSidebar.style.right = '0';
    cartSidebar.setAttribute('aria-hidden', 'false');
}
function closeCart() {
    cartSidebar.style.right = '-350px';
    cartSidebar.setAttribute('aria-hidden', 'true');
}

cartToggleBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);

// --- Attach event listeners to all Add to Cart buttons ---
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = btn.closest('.card');
        const name = card.querySelector('.card-title span').textContent.trim();
        const priceText = card.querySelector('.card-title .text-primary').textContent.trim();
        const price = parseFloat(priceText.replace('$', ''));
        const image = card.querySelector('img').src;
        addToCart(name, price, image);
    });
});

// Initialize cart display
updateCartSidebar();
window.removeFromCart = removeFromCart;

// --- Checkout Modal Logic ---
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const closeCheckoutModalBtn = document.getElementById('closeCheckoutModal');

function showCheckoutModal() {
    checkoutModal.style.display = 'flex';
}
function hideCheckoutModal() {
    checkoutModal.style.display = 'none';
}

// Replace old checkout handler
checkoutBtn.removeEventListener('click', checkoutCart);
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    showCheckoutModal();
});

// Handle form submission
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const address = document.getElementById('userAddress').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!address || !email || !phone || !payment) {
        alert('Please fill in all fields.');
        return;
    }

    alert('Order placed successfully!\n\nThank you for your purchase.');

    cart.length = 0;
    updateCartSidebar();
    hideCheckoutModal();
    closeCart();
    checkoutForm.reset();
});

// Close modal on cancel
closeCheckoutModalBtn.addEventListener('click', hideCheckoutModal);

// Optional: Close modal when clicking outside the form
checkoutModal.addEventListener('click', function(e) {
    if (e.target === checkoutModal) hideCheckoutModal();
});
