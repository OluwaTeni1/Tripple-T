// document.addEventListener('DOMContentLoaded', async function() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const username = urlParams.get('name');
//         console.log('Username:', username);
//         // if (!username) {
//         //     throw new Error('Username parameter is missing');
//         // }
//         const response = await fetch(`/profile/${username}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch user details');
//         }
//         const userData = await response.json();
//         document.getElementById('username').textContent = userData.name;
//     } catch (error) {
//         console.error(error.message);
//        // alert('Failed to fetch user details');
//     }
// });


// // Add this code to your existing JavaScript file (user.js or main.js)

// document.addEventListener('DOMContentLoaded', async function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const username = urlParams.get('name');
//     const usernameElement = document.getElementById('username');

//     // Set username on page load if available
//     if (usernameElement && username) {
//         usernameElement.textContent = username;
//     }

//     // Assuming you've assigned an id of 'sign-out-btn' to your sign-out button
//     const signOutBtn = document.getElementById('sign-out-btn');
    
//     if (signOutBtn) {
//         signOutBtn.addEventListener('click', async function() {
//             try {
//                 const response = await fetch('/signout', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (response.ok) {
//                     console.log('User signed out successfully');
//                     // Clear username from the front end
//                     if (usernameElement) {
//                         usernameElement.textContent = '';
//                     }
//                     // Redirect to the login page after signing out
//                     window.location.href = '/login.html';
//                 } else {
//                     console.error('Failed to sign out:', response.status);
//                 }
//             } catch (error) {
//                 console.error('Error signing out:', error);
//             }
//         });
//     }
// });


document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('name');
    const usernameElement = document.getElementById('username');

    // Set username on page load if available
    if (usernameElement && username) {
        usernameElement.textContent = username;
    }

    // Assuming you've assigned an id of 'sign-out-btn' to your sign-out button
    const signOutBtn = document.getElementById('sign-out-btn');
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async function() {
            event.preventDefault();

            try {
                const response = await fetch('/signout', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log('User signed out successfully');
                    // Clear username from the front end
                    if (usernameElement) {
                        usernameElement.textContent = '';
                    }
                    // Redirect to the login page after signing out
                    window.location.href = '/login.html';
                } else {
                    console.error('Failed to sign out:', response.status);
                }
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }

});
