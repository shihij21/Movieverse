let isLogin = true;

function toggleForm(){

    isLogin = !isLogin;

    document.getElementById("formTitle").innerHTML = isLogin ? "Login" : "Sign Up";

    document.getElementById("name").style.display = isLogin ? "none" : "block";

    document.getElementById("toggleText").innerHTML =
        isLogin ? "Don't have an account?" : "Already have an account?";

    document.querySelector(".toggle a").innerHTML =
        isLogin ? "Sign Up" : "Login";

}

function submitForm(){

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(isLogin){

        const user = users.find(u => u.email === email && u.password === password);

        if(!user){

            alert("Invalid email or password.");
            return;

        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Welcome back, " + user.name + "!");

        window.location.href = "index.html";

    }else{

        if(name === "" || email === "" || password === ""){

            alert("Please fill in all fields.");
            return;

        }

        if(users.some(u => u.email === email)){

            alert("An account with this email already exists.");
            return;

        }

        const newUser = {
            name,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert("Account created successfully!");

        window.location.href = "index.html";

    }

}