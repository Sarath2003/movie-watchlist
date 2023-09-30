const searchBar = document.getElementById('movie-search-bar')
let moviesList = document.getElementById('movies-list')
const form = document.getElementById('movie-input')
let watchlistedMovies = []
let moviesHtml = ""
const localStorageLeads = JSON.parse(localStorage.getItem("watchlist-movies"))

if(localStorageLeads){
    watchlistedMovies = localStorageLeads
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`https://www.omdbapi.com/?s=${searchBar.value}&apikey=940211cb`)
    .then(res => res.json())
    .then(data => {
        if(data.Response == 'False'){
            renderAplology()
            return
        }
        moviesHtml = ""
        let imdbIDArr = []
        let moviesData = data.Search
        for(let movie of moviesData){
            imdbIDArr.push(movie.imdbID)
        }
        getMovieData(imdbIDArr)
    })
})


function getMovieData(imdbIDArr){
    for(let imdbID of imdbIDArr){
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=940211cb`)
        .then(res => res.json())
        .then(data => {
            addToHtml(data)
            moviesList.innerHTML = moviesHtml
        })
    }
}

function addToHtml(movieData){
    if(watchlistedMovies.includes(movieData.imdbID)){
        moviesHtml += savedMovie(movieData)
    }
    else{
        moviesHtml += unsavedMovie(movieData)
    }
}

function savedMovie(movieData){
    const {Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID} = movieData
    return `
    <div class="movie">
        <img src=${Poster} alt="" class="movie-pic">
        <div class="first-line">
            <h4 class="movie-title">${Title}
            </h4>
            <div class="rating-div">
                <img src="./img/star.png" alt="star-img" class="rating-img">
                <p class="rating">${imdbRating}</p>
            </div>
        </div>
        <div class="second-line">
            <p class="movie-length">${Runtime}</p>
            <p class="genres">${Genre}</p>
            <div class="add-to-watchlist" id=${imdbID}-add-div>
                <i class="fa-sharp fa-solid fa-circle-check green"></i>
                <p class="green">saved</p>
            </div>
        </div>
        <div class="about-movie">
            <p>${Plot}</p>
        </div>
    </div>`
}

function unsavedMovie(movieData){
    const {Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID} = movieData
    return `
    <div class="movie">
        <img src=${Poster} alt="" class="movie-pic">
        <div class="first-line">
            <h4 class="movie-title">${Title}
            </h4>
            <div class="rating-div">
                <img src="./img/star.png" alt="star-img" class="rating-img">
                <p class="rating">${imdbRating}</p>
            </div>
        </div>
        <div class="second-line">
            <p class="movie-length">${Runtime}</p>
            <p class="genres">${Genre}</p>
            <div class="add-to-watchlist" id=${imdbID}-add-div>
                <i class="fa-solid fa-circle-plus" data-add=${imdbID}></i>
                <p data-add=${imdbID}>Watchlist</p>
            </div>
        </div>
        <div class="about-movie">
            <p>${Plot}</p>
        </div>
    </div>`
}

function renderAplology(){
    moviesList.innerHTML = `
    <h3 class="gray-font">Unable to find what you’re looking for.</h3>
    <h3 class="gray-font">Please try another search.</h3>`
}

document.addEventListener('click', (e)=>{
    if(e.target.dataset.add){
        addToWatchlist(e.target.dataset.add)
    }
})

function addToWatchlist(imdbID){
    watchlistedMovies.push(imdbID)
    localStorage.setItem("watchlist-movies", JSON.stringify(watchlistedMovies))
    savedHtml(imdbID)
}

function savedHtml(imdbID){
    document.getElementById(`${imdbID}-add-div`).innerHTML = `
    <i class="fa-sharp fa-solid fa-circle-check green"></i>
    <p class="green">saved</p>`
}