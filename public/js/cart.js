const payBtn = document.querySelector('.btn-buy');


payBtn.addEventListener('click', () => {
    const name = document.getElementById('username').innerText;
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    const totalPrice = parseFloat(document.getElementsByClassName('total-price')[0].innerText.replace('$', ''));

    if (!name.trim()) {
        alert('Please log in to proceed with your purchase.');
        // Redirect the user to the login page
        window.location.href = '/login.html';
        return;
    }

    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cartItems: cartItems,
            price: totalPrice,
            username: name
        })
    })
    .then(response => {
        if (response.ok) {
            clearCart();
            //alert('Purchase')
            

            // Item added successfully, redirect to success page
            ///window.location.href = '/sucess';
            
        } else {
            // Handle error response
            console.error('Failed to add item to cart:', response.status);
        }
    })
    .catch(error => {
        // Handle network error
        console.error('Error adding item to cart:', error);
    });
});