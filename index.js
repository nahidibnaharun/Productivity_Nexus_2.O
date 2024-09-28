
let users = JSON.parse(localStorage.getItem('users')) || [];

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'none';
}

function showRegistration() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('adminLoginForm').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'block';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
           
            if (xhr.responseText === "Login successful!") {
                sessionStorage.setItem('logged_in', true); 
                sessionStorage.setItem('username', username); 
                window.location.href = 'dashboard.html';
            } else {
                alert(xhr.responseText);
            }
        } else {
           
            alert(xhr.responseText);
        }
    };

    xhr.send("username=" + username + "&password=" + password);
}

function adminLogin() {
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;

   
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "admin_login.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            
            if (xhr.responseText === "Admin login successful!") {
                sessionStorage.setItem('admin_logged_in', true);
                window.location.href = 'admin.html';
            } else {
                alert(xhr.responseText);
            }
        } else {
            alert(xhr.responseText);
        }
    };

    xhr.send("adminUsername=" + adminUsername + "&adminPassword=" + adminPassword);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

function register() {
    const name = document.getElementById('regName').value;
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "register.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText); 
            if (xhr.responseText === "Registration successful!") {
                showLogin();
            } 
        } else {
            alert(xhr.responseText);
        }
    };

    xhr.send("name=" + name + "&username=" + username + "&email=" + email + "&password=" + password);
}

showLogin();

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (document.getElementById('loginForm').style.display === 'block') {
            login(); 
        } else if (document.getElementById('registrationForm').style.display === 'block') {
            register();
        } else if (document.getElementById('adminLoginForm').style.display === 'block') {
            adminLogin();
        }
    }
}); 
