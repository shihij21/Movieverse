// ===============================
// Movie Data
// ===============================
const API_KEY = "2db8c2e5";

const movies = {

    "Interstellar": {
        poster: "images/interstellar.jpeg",
        title: "Interstellar",
        rating: "⭐ 4.8/5",
        genre: "Sci-Fi",
        director: "Christopher Nolan",
        year: "2014",
        description: "A team of astronauts travel through a wormhole in search of a new home for humanity."
    },

    "Inception": {
        poster: "images/inception.jpeg",
        title: "Inception",
        rating: "⭐ 4.7/5",
        genre: "Sci-Fi / Action",
        director: "Christopher Nolan",
        year: "2010",
        description: "A skilled thief enters people's dreams to steal secrets and perform impossible missions."
    },

    "Dune": {
        poster: "images/dune.jpeg",
        title: "Dune",
        rating: "⭐ 4.6/5",
        genre: "Sci-Fi",
        director: "Denis Villeneuve",
        year: "2021",
        description: "Paul Atreides journeys across the desert planet Arrakis to protect his family's future."
    },

    "Closer": {
        poster: "images/closer.jpeg",
        title: "Closer",
        rating: "⭐ 4.3/5",
        genre: "Drama / Romance",
        director: "Mike Nichols",
        year: "2004",
        description: "The lives of four people become intertwined through love, desire and betrayal."
    }

};

// ===============================
// Movie Details Modal
// ===============================

function showMovie(movieName) {

    let movie = movies[movieName];

    document.getElementById("modalPoster").src = movie.poster;
    document.getElementById("modalTitle").innerHTML = movie.title;
    document.getElementById("modalRating").innerHTML = movie.rating;
    document.getElementById("modalGenre").innerHTML = "<strong>Genre:</strong> " + movie.genre;
    document.getElementById("modalDirector").innerHTML = "<strong>Director:</strong> " + movie.director;
    document.getElementById("modalYear").innerHTML = "<strong>Year:</strong> " + movie.year;
    document.getElementById("modalDescription").innerHTML = movie.description;

    document.getElementById("movieModal").style.display = "flex";

}

function closeModal() {

    document.getElementById("movieModal").style.display = "none";

}

// ===============================
// Search Movies
// ===============================

function searchMovies() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let cards = document.getElementsByClassName("movie-card");

    for (let i = 0; i < cards.length; i++) {

        let title = cards[i].getElementsByTagName("h3")[0];

        if (title.innerText.toLowerCase().includes(input)) {

            cards[i].style.display = "block";

        } else {

            cards[i].style.display = "none";

        }

    }

}

// ===============================
// Star Rating
// ===============================

function rateMovie(star, rating) {

    let stars = star.parentElement.children;

    for (let i = 0; i < stars.length; i++) {

        if (i < rating) {

            stars[i].style.color = "gold";

        } else {

            stars[i].style.color = "gray";

        }

    }

    let text = star.parentElement.nextElementSibling;

    text.innerHTML = "You rated this movie " + rating + " ⭐";

}

// ===============================
// Favorite Button
// ===============================

// ===============================
// Favorite Button + Local Storage
// ===============================

function toggleFavorite(button, movieName) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(movieName)) {

        favorites = favorites.filter(movie => movie !== movieName);

        button.innerHTML = "🤍 Favorite";

    } else {

        favorites.push(movieName);

        button.innerHTML = "❤️ Favorited";

    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

}

// ===============================
// Back to Top Button
// ===============================

let topButton = document.getElementById("topBtn");

window.onscroll = function () {

    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

};

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
// ===============================
// Load Favorites Page
// ===============================

function loadFavorites() {

    let container = document.getElementById("favoritesContainer");

    if (!container) return;

    let localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let omdbFavorites = JSON.parse(localStorage.getItem("omdbFavorites")) || [];

    container.innerHTML = "";

    // Show hardcoded movies
    localFavorites.forEach(function(movieName){

        let movie = movies[movieName];

        if(movie){

            container.innerHTML += `
            <div class="movie-card">

                <img src="${movie.poster}" alt="${movie.title}">

                <h3>${movie.title}</h3>

                <p>${movie.rating}</p>

                <button onclick="showMovie('${movie.title}')">
                    View Details
                </button>

            </div>
            `;

        }

    });

    // Show OMDb movies
    omdbFavorites.forEach(function(movie){

        container.innerHTML += `
        <div class="movie-card">

            <img src="${movie.Poster}" alt="${movie.Title}">

            <h3>${movie.Title}</h3>

            <p>📅 ${movie.Year}</p>

            <button onclick="getMovieDetails('${movie.imdbID}')">
                View Details
            </button>

            <button onclick="removeOMDbFavorite('${movie.imdbID}')">
                ❌ Remove
            </button>

        </div>
        `;

    });

}

loadFavorites();
// ===============================
// Restore Favorite Buttons
// ===============================

function restoreFavoriteButtons() {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    document.querySelectorAll(".favorite-btn").forEach(function(button){

        // Get the movie name from the onclick attribute
        let onclickText = button.getAttribute("onclick");

        if (!onclickText) return;

        let movieName = onclickText.match(/'([^']+)'/);

        if(movieName && favorites.includes(movieName[1])){

            button.innerHTML = "❤️ Favorited";

        }

    });

}

restoreFavoriteButtons();
// ===============================
// Search Movies from OMDb
// ===============================

async function searchOMDb() {

    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
        alert("Please enter a movie name.");
        return;
    }

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        const results = document.getElementById("searchResults");

        results.innerHTML = "";

        if (data.Response === "False") {
            results.innerHTML = "<h3>No movies found.</h3>";
            return;
        }

        data.Search.forEach(movie => {

            let savedRating = localStorage.getItem("rating_" + movie.imdbID) || 0;

results.innerHTML += `
<div class="movie-card">

    <img src="${movie.Poster !== "N/A" ? movie.Poster : "images/no-image.png"}" alt="${movie.Title}">

    <h3>${movie.Title}</h3>

    <p>📅 ${movie.Year}</p>

    <div class="stars">
        <span onclick="rateOMDbMovie('${movie.imdbID}',1,this)" style="color:${savedRating>=1?'gold':'gray'}">⭐</span>
        <span onclick="rateOMDbMovie('${movie.imdbID}',2,this)" style="color:${savedRating>=2?'gold':'gray'}">⭐</span>
        <span onclick="rateOMDbMovie('${movie.imdbID}',3,this)" style="color:${savedRating>=3?'gold':'gray'}">⭐</span>
        <span onclick="rateOMDbMovie('${movie.imdbID}',4,this)" style="color:${savedRating>=4?'gold':'gray'}">⭐</span>
        <span onclick="rateOMDbMovie('${movie.imdbID}',5,this)" style="color:${savedRating>=5?'gold':'gray'}">⭐</span>
    </div>
    <p class="rating-text">Click to Rate</p>

    <button onclick="addOMDbFavorite('${movie.imdbID}', '${movie.Title.replace(/'/g, "\\'")}', '${movie.Year}', '${movie.Poster}')">
    ❤️ Favorite
</button>

<button onclick="addToWatchlist('${movie.imdbID}', '${movie.Title.replace(/'/g, "\\'")}', '${movie.Year}', '${movie.Poster}')">
    📺 Watchlist
</button>

<button onclick="getMovieDetails('${movie.imdbID}')">
    View Details
</button>

</div>
`;

        });

    }

    catch(error){

        console.error(error);

        alert("Something went wrong while fetching movies.");

    }

}
// ===============================
// Get Full Movie Details
// ===============================

async function getMovieDetails(imdbID){

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

    try{

        const response = await fetch(url);
        const movie = await response.json();

        document.getElementById("modalPoster").src = movie.Poster;
        document.getElementById("modalTitle").innerHTML = movie.Title;
        document.getElementById("modalRating").innerHTML = "⭐ IMDb: " + movie.imdbRating;
        document.getElementById("modalGenre").innerHTML = "<strong>Genre:</strong> " + movie.Genre;
        document.getElementById("modalDirector").innerHTML = "<strong>Director:</strong> " + movie.Director;
        document.getElementById("modalYear").innerHTML = "<strong>Year:</strong> " + movie.Year;
        document.getElementById("modalDescription").innerHTML = movie.Plot;

        document.getElementById("movieModal").style.display = "flex";

    }

    catch(error){

        console.error(error);

        alert("Unable to load movie details.");

    }

}
// ===============================
// Favorite OMDb Movies
// ===============================

function addOMDbFavorite(imdbID, title, year, poster) {

    let favorites = JSON.parse(localStorage.getItem("omdbFavorites")) || [];

    if (favorites.some(movie => movie.imdbID === imdbID)) {
        alert("Already in Favorites ❤️");
        return;
    }

    favorites.push({
        imdbID: imdbID,
        Title: title,
        Year: year,
        Poster: poster
    });

    localStorage.setItem("omdbFavorites", JSON.stringify(favorites));

    alert(title + " added to Favorites ❤️");
}

// ===============================
// Rate OMDb Movies
// ===============================

function rateOMDbMovie(id, rating, star) {

    localStorage.setItem("rating_" + id, rating);

    let stars = star.parentElement.children;

    for (let i = 0; i < stars.length; i++) {
        stars[i].style.color = i < rating ? "gold" : "gray";
    }

    let text = star.parentElement.nextElementSibling;

    if (text) {
        text.innerHTML = "You rated this movie " + rating + " ⭐";
    }
}

function removeOMDbFavorite(imdbID){

    let favorites = JSON.parse(localStorage.getItem("omdbFavorites")) || [];

    favorites = favorites.filter(movie => movie.imdbID !== imdbID);

    localStorage.setItem("omdbFavorites", JSON.stringify(favorites));

    loadFavorites();

}
// ===============================
// Load Top Rated Movies
// ===============================

function loadTopRated() {

    const container = document.getElementById("topRatedContainer");

    if (!container) return;

    container.innerHTML = "";

    let found = false;

    // Local movies
    for (let movieName in movies) {

        let rating = localStorage.getItem("rating_" + movieName);

        if (rating) {

            found = true;

            let movie = movies[movieName];

            container.innerHTML += `
                <div class="movie-card">

                    <img src="${movie.poster}">

                    <h3>${movie.title}</h3>

                    <p>Your Rating: ⭐ ${rating}/5</p>

                    <button onclick="showMovie('${movie.title}')">
                        View Details
                    </button>

                </div>
            `;
        }
    }

    // OMDb favorites
    let omdbFavorites = JSON.parse(localStorage.getItem("omdbFavorites")) || [];

    omdbFavorites.forEach(movie => {

        let rating = localStorage.getItem("rating_" + movie.imdbID);

        if (rating) {

            found = true;

            container.innerHTML += `
                <div class="movie-card">

                    <img src="${movie.Poster}">

                    <h3>${movie.Title}</h3>

                    <p>Your Rating: ⭐ ${rating}/5</p>

                    <button onclick="getMovieDetails('${movie.imdbID}')">
                        View Details
                    </button>

                </div>
            `;
        }

    });

    if (!found) {

        container.innerHTML = "<h3>You haven't rated any movies yet ⭐</h3>";

    }

}

loadTopRated();
// ===============================
// Logged In User
// ===============================

function checkLogin(){

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const loginLink = document.getElementById("loginLink");

    if(!loginLink) return;

    if(user){

        loginLink.innerHTML = "👋 " + user.name;

        loginLink.href = "#";

    }

}

checkLogin();
// ===============================
// Login & Logout
// ===============================

function checkLogin(){

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");

    if(!loginLink || !logoutLink) return;

    if(user){

        loginLink.innerHTML = "👋 " + user.name;
        loginLink.href = "#";

        logoutLink.style.display = "inline";

    }else{

        loginLink.innerHTML = "Login";
        loginLink.href = "login.html";

        logoutLink.style.display = "none";

    }

}

function logout(){

    localStorage.removeItem("currentUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";

}

checkLogin();
// ===============================
// Watchlist
// ===============================

function addToWatchlist(imdbID, title, year, poster){

    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if(watchlist.some(movie => movie.imdbID === imdbID)){
        alert("Movie already in Watchlist 📺");
        return;
    }

    watchlist.push({
        imdbID: imdbID,
        Title: title,
        Year: year,
        Poster: poster
    });

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    alert(title + " added to Watchlist 📺");

}
// ===============================
// Load Watchlist
// ===============================

function loadWatchlist(){

    const container = document.getElementById("watchlistContainer");

    if(!container) return;

    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if(watchlist.length === 0){

        container.innerHTML = "<h3>Your watchlist is empty 📺</h3>";

        return;

    }

    container.innerHTML = "";

    watchlist.forEach(movie=>{

        container.innerHTML += `
        <div class="movie-card">

            <img src="${movie.Poster}" alt="${movie.Title}">

            <h3>${movie.Title}</h3>

            <p>📅 ${movie.Year}</p>

            <button onclick="getMovieDetails('${movie.imdbID}')">
                View Details
            </button>

            <button onclick="removeFromWatchlist('${movie.imdbID}')">
                ❌ Remove
            </button>

        </div>
        `;

    });

}

function removeFromWatchlist(imdbID){

    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    loadWatchlist();

}

loadWatchlist();