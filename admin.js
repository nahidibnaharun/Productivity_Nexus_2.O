// Check if admin is logged in
function checkAdminLogin() {
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
        alert("Please log in as admin first.");
        window.location.href = 'index.html';
    }
}

checkAdminLogin(); // Call this function when the admin page loads

// Function to display users in the table
function displayUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch_users.php", true); 
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            const users = JSON.parse(xhr.responseText);
            const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
            usersTable.innerHTML = ''; // Clear existing data

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const row = usersTable.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                const cell3 = row.insertCell();
                const cell4 = row.insertCell();
                const cell5 = row.insertCell();
                const cell6 = row.insertCell();

                cell1.innerHTML = user.id;
                cell2.innerHTML = user.name;
                cell3.innerHTML = user.username;
                cell4.innerHTML = user.email;
                cell5.innerHTML = user.password;
                cell6.innerHTML = `<button onclick="deleteUser(${user.id})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>`;
            }
        } else {
            console.error('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

// Function to delete a user
function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "delete_user.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                alert(xhr.responseText);
                displayUsers(); // Update the user list
            } else {
                console.error('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send("userId=" + userId);
    }
}

// Function to create a new user
function createUser() {
    const name = prompt("Enter the user's name:");
    const username = prompt("Enter the user's username:");
    const email = prompt("Enter the user's email:");
    const password = prompt("Enter the user's password:");

    if (name && username && email && password) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "create_user.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                alert(xhr.responseText);
                displayUsers(); // Update the user list
            } else {
                console.error('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send("name=" + name + "&username=" + username + "&email=" + email + "&password=" + password);
    }
}

// Function to log out the admin
function logout() {
    // Clear the admin_logged_in session storage variable
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'index.html';
}

// Display users when the page loads
displayUsers();