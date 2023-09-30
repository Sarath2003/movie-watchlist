let moviesList = document.getElementById('movies-list')
let watchlistedMovies = JSON.parse(localStorage.getItem("watchlist-movies"))
let moviesHtml = ""

function render(watchlistedMovies){
    if(watchlistedMovies.length == 0){
        emptyWatchList()
    }
    else{
        for(let imdbID of watchlistedMovies){
            fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=940211cb`)
            .then(res => res.json())
            .then(data => {
                addToHtml(data)
                moviesList.innerHTML = moviesHtml
            })
        }
    }
}

function addToHtml(movieData){
    const {Poster, Title, imdbRating, Runtime, Genre, Plot, imdbID} = movieData
    moviesHtml += `
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
            <div class="add-to-watchlist">
                <i class="fa-solid fa-circle-minus" data-remove=${imdbID}></i>
                <p data-remove=${imdbID}>remove</p>
            </div>
        </div>
        <div class="about-movie">
            <p>${Plot}</p>
        </div>
    </div>`
}

function emptyWatchList(){
    moviesList.innerHTML = `
    <h4 class="gray-font">Your watchlist is loooking a little empty...</h4>
    <div id="search-movies-div">
        <i class="fa-solid fa-circle-minus"></i>
        <a href="./index.html" id="search-movies-btn">Let's add some movies!</a>
    </div>`
}

if(watchlistedMovies){
    render(watchlistedMovies)
}

document.addEventListener('click', (e)=>{
    if(e.target.dataset.remove){
        removeFromWatchList(e.target.dataset.remove)
    }
})

function removeFromWatchList(imdbID){
    const index = watchlistedMovies.indexOf(imdbID)
    watchlistedMovies.splice(index, 1)
    console.log(watchlistedMovies)
    localStorage.setItem("watchlist-movies", JSON.stringify(watchlistedMovies))
    moviesHtml = ""
    render(watchlistedMovies)
}