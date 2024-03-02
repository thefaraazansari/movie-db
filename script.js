const baseURL = "https://api.themoviedb.org/3";
const API_KEY = "63b9b5ddfc90942335ae9469a9aaad81";
const imageBaseURL = "https://image.tmdb.org/t/p/original";
const searchedMovie = document.querySelector("#search-box");

var trendingMovies;

const trendingURL = baseURL + "/trending/movie/week" + "?" + "api_key=" + API_KEY;
const searchURL = baseURL + "/search/company" + "?" + "api_key=" + API_KEY + "&query=";

function trendingReqListener() {
    trendingMovies = JSON.parse(this.responseText).results;
    console.log(trendingMovies);
    displayMovies(trendingMovies);
}

function displayMovies(trendingMovies) {
    const moviesContainer = document.querySelector(".container");
    for (let index = 0; index < trendingMovies.length; index++) {
        movie_id = trendingMovies[index].id;
        moviesContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="card">
                <img src="${imageBaseURL + trendingMovies[index].poster_path}" alt="${trendingMovies[index].title}">
            <div class="movie-info">
            <details>
                <summary>${trendingMovies[index].title}</summary>
                <p>${trendingMovies[index].overview}</p>
            </details>
            <p>Release date: ${new Date(trendingMovies[index].release_date).toDateString().slice(4)} </p>  
            <p>Rating: ${trendingMovies[index].vote_average} (${trendingMovies[index].vote_count
            })</p>
            </div>
        </div>`
        );
    }
}

function loadPage() {
    const trendingMoviesReq = new XMLHttpRequest();
    trendingMoviesReq.addEventListener("load", trendingReqListener);
    trendingMoviesReq.open("GET", trendingURL);
    trendingMoviesReq.send();
}

function searchReqListener() {
    const movies = JSON.parse(this.responseText);
    const searchMoviesContainer = document.querySelector(".search-results");
    for (let index = 0; index < movies.results.length; index++) {
        searchMoviesContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="movie-search">
                <p>${movies.results[index].name}</p>
            </div>`
        );
    }
}

document.querySelector("#search-box").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        const list = document.querySelector(".search-results");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        searchResult();
    }
});

function searchResult() {
    const searchMoviesReq = new XMLHttpRequest();
    searchMoviesReq.addEventListener("load", searchReqListener);
    searchMoviesReq.open("GET", searchURL + searchedMovie.value);
    searchMoviesReq.send();
}

document.querySelector("#search-box").addEventListener("blur", outOfFocus);

function outOfFocus() {
    document.querySelector("#search-box").value = "";
    const list = document.querySelector(".search-results");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}

document.querySelector("#sort-by-votes").addEventListener("click", sortMoviesByVotes);

function sortMoviesByVotes(event) {
    if (event.currentTarget.classList.contains("asc-order")) {
        event.currentTarget.classList.remove("asc-order");
        trendingMovies.sort((a, b) => b.vote_average - a.vote_average);
    } else {
        event.currentTarget.classList.add("asc-order");
        trendingMovies.sort((a, b) => a.vote_average - b.vote_average);
    }
    const moviesList = document.querySelector(".container");
    while (moviesList.hasChildNodes()) {
        moviesList.removeChild(moviesList.firstChild);
    }
    displayMovies(trendingMovies);
}

document.querySelector("#sort-by-date").addEventListener("click", sortMoviesByDate);

function sortMoviesByDate(event) {

    if (event.currentTarget.classList.contains("asc-order")) {
        event.currentTarget.classList.remove("asc-order");
        trendingMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else {
        event.currentTarget.classList.add("asc-order");
        trendingMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    }
    const moviesList = document.querySelector(".container");
    while (moviesList.hasChildNodes()) {
        moviesList.removeChild(moviesList.firstChild);
    }
    displayMovies(trendingMovies);
}

document.querySelector("#sort-by-popularity").addEventListener("click", sortMoviesByPopularity);

function sortMoviesByPopularity(event) {
    if (event.currentTarget.classList.contains("asc-order")) {
        event.currentTarget.classList.remove("asc-order");
        trendingMovies.sort((a, b) => b.popularity - a.popularity);
    } else {
        event.currentTarget.classList.add("asc-order");
        trendingMovies.sort((a, b) => a.popularity - b.popularity);
    }
    const moviesList = document.querySelector(".container");
    while (moviesList.hasChildNodes()) {
        moviesList.removeChild(moviesList.firstChild);
    }
    displayMovies(trendingMovies);
}

const sortButtons = document.querySelectorAll(".sort-btn");
[...sortButtons].forEach(btn => {
    btn.addEventListener("click", addActiveClass);
});

function addActiveClass(event) {
    const active = event.currentTarget;
    [...sortButtons].forEach(btn => {
        btn.classList.remove("active");
    });
    active.classList.add("active");
}

loadPage();
