// Cart
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart-box');
let closeCart = document.querySelector('#close-cart');

cartIcon.onclick = () => {
    cart.classList.add('active');
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};


// Cart Working JS

if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready);
}
else{
    ready();
}

//Making Function
function ready(){
    //remove Items From cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    console.log(removeCartButtons);
    for (var i = 0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem); 
    }
    //Quantity Changes
    var quantityInputs = document.getElementsByClassName('quantity');
    for (var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged);
    }
    // Add To Cart
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    //Buy Button Work
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buttonClicked);
    loadCartItems();
}
//Buy Button
function buttonClicked(){
    var cartContent = document.getElementsByClassName('cart-cont-main')[0];
    while (cartContent.hasChildNodes()){
        cartContent.removeChild(cartContent.firstChild);
    }
    //updateTotal();
    clearCart();

    alert('Your order has been placed successfully');
}


//Remove Items from cart
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
}

//quantity changes
function quantityChanged(event){
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

// Add To Cart
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-decr')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    var quantity = 1;

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('name');

    const maxItemsAllowed = 4;

    var cartItems = document.getElementsByClassName('cart-content');
    if(cartItems.length >= maxItemsAllowed) {
        alert('You have reached the maximum number of items in your cart. Please complete your current order before adding more items.');
        return;
    }
    
    addProductToCart(title, price, productImg, quantity);
    updateTotal();



    fetch('add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, price, productImg, quantity, username})
    })
    .then(response =>{
        if (response.ok) {
            console.log('Item added to cart');
        }else {
            console.error('Failed to add item to cart:', response.status);
        }
    })
    .catch(error => {
        console.error('Error adding item to cart:', error);
    });
}

function addProductToCart(title, price, productImg){
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-content');
    var cartItems = document.getElementsByClassName('cart-cont-main')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-title');
    for (var i = 0; i < cartItemsNames.length; i++){
        if(cartItemsNames[i].innerText == title){
            alert('You Have already add this item to cart');
        return;
        }
    }
    var cartBoxContent = `
                        <img src="${productImg}" alt="" class="cart-img">
                        <div class="cart-texts">
                            <div class="cart-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" class="quantity" value="1">
                        </div>
                        <i class="fa-solid fa-trash cart-remove"></i>
    `;
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox
        .getElementsByClassName('quantity')[0]
        .addEventListener('change', quantityChanged);

    saveCartItems();
    updateCartIcon();
}

// Update Total
function updateTotal(){
    var cartContent = document.getElementsByClassName('cart-cont-main')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-content');
    var total = 0;
    for (var i=0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total= total + (price * quantity);
        //If price contain some cents value
        
    }
    total = Math.round(total * 100) / 100;

        document.getElementsByClassName('total-price')[0].innerText = '$' + total;

        localStorage.setItem('cartTotal', total)
}

function saveCartItems() {
    var cartContent = document.getElementsByClassName('cart-cont-main')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-content');
    var cartItems = [];

    for (var i=0; i< cartBoxes.length; i++) {
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-title')[0];
        var priceElement = cart.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartItems() {
    var cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for (var i = 0; i < cartItems.length; i++){
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName('cart-content');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
    }
    updateCartIcon();
}

function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-content');
    var quantity = 0;

    for (var i=0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}

function clearCart(){
    console.log("Clearing cart...")
    var cartContent = document.getElementsByClassName('cart-cont-main')[0];
    cartContent.innerHTML = '';
    updateTotal();
    localStorage.removeItem('cartItems');
}