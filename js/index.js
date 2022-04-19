const mainContainer = document.getElementById("main")
const searchBar = document.getElementById("searchBar")
const prevSearchBtn = document.getElementById("prevSearch")
const nextSearchBtn = document.getElementById("nextSearch")
let searchHistory = []
let historyPosition = -1
const searchBtn = document.getElementById("searchBtn")
const searchResultContainer = document.getElementById("searchResultContainer")
const otherSearchResultContainer = document.getElementById("otherSearchResultContainer")
const placeholder = document.getElementById("placeholder")
const fadedWrapper = document.getElementById("fadedWrapper")
let uniqueMovieName = ""



searchBtn.addEventListener("click", searchMovies)
document.body.addEventListener("keydown", e => {
    if(e.code === "Enter"){
        searchMovies()
    }
})


createAddBtn = function(data){
    let addBtn = document.getElementById("addBtn")
    addBtn.addEventListener("click", e => {
        const movieToAdd = {
            Poster : data.Poster,
            Title : data.Title,
            Rating : data.Ratings[0].Value,
            Runtime : data.Runtime,
            Genre : data.Genre,
            Plot : data.Plot,
            ID : data.imdbID
        }
        localStorage.setItem(data.Title, JSON.stringify(movieToAdd))
    })
}


function searchMovies(){
    //run if searchbar is not empty
    if(searchBar.value){

        //add current search to history => only if it is not equal to the last search in history
        let currentSearch = searchBar.value
        if(searchHistory.at(-1) != currentSearch){
            searchHistory.push(currentSearch)        
            placeholder.style.display = "none"
        }

        //main movie
        fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ee87a68d&t=${searchBar.value}&plot=full`)
            .then(res => res.json())
            .then(data => {
                if(data.Response != "False" && data.Ratings.length > 0 && data.Runtime != "N/A" && data.Genre != "N/A" && data.Plot != "N/A" && data.Poster != "N/A"){
                    mainContainer.style.display = "flex"
                    let newMovie = new mainMovie(data)
                    newMovie.formatMovie()    
                    uniqueMovieName = data.Title  
                    otherSearchResultContainer.innerHTML = ""
                    createAddBtn(data)               
                    searchOtherResults()

                } else if(data.Response === "False") {
                    searchResultContainer.innerHTML = ""
                    otherSearchResultContainer.innerHTML = ""
                    placeholder.style.display = "block"
                    placeholder.innerHTML = `
                        <h3 class="notification-header">
                            Sorry, we couldn't find a matching result.
                            <br>
                            Please try a different search!
                        </h3>
                        <img src="images/clapboard.png">`

                } else {
                    searchResultContainer.innerHTML = ""
                    otherSearchResultContainer.innerHTML = ""
                    placeholder.style.display = "block"
                    mainContainer.style.display = "none"
                    placeholder.innerHTML = `
                        <h3 class="notification-header">
                            Sorry, we don't have additional information on this movie.
                            <br>    
                            Please try a different search!
                        </h3>
                        <img src="images/clapboard.png">`
                } 
            })
        }                        
}

// previous Searchresult
prevSearchBtn.addEventListener("click", e => {
    if(searchHistory.length > 0){   
        if(historyPosition > -searchHistory.length){
            historyPosition -= 1
            searchBar.value = searchHistory.at(historyPosition)
        }     
    }
})


function mainMovie(data){
    Object.assign(this, data)
    this.formatMovie = function() {
        searchResultContainer.innerHTML = `
        <div class="search-result flex justify-between" id="searchResult">
            <div class="movie-poster flex justify-around align"><img src="${this.Poster}"></div>

            <div class="movie-description flex">
                <div class="desc-top">
                    <div class="movie-header flex justify-between">
                        <p class="movie-title">${this.Title}</p><p class="movie-rating">⭐ ${this.Ratings[0].Value.slice(0, -3)} / 10</p>
                    </div>

                    <div class="movie-details flex">
                        <div class="movie-runtime flex align">${this.Runtime}</div>

                        <div class="movie-genre flex align">${this.Genre}</div>

                        <div class="btn watchlist-add-btn flex justify-between align" id="addBtn">
                            <img src="images/plus-icon.svg" class="add-icon">
                            <p>to Watchlist</p>
                        </div>
                    </div>
                </div>

                <div class ="plot-container" id="plotContainer">
                    <div class="movie-plot" id="moviePlot">${this.Plot}</div>
                </div>
            </div>
        </div>        
        `
        
        fullPlot(this)
    }
}

//show full plot
function fullPlot(movie){
    const plotContainer = document.getElementById(`plotContainer`)
    const moviePlotEl = document.getElementById("moviePlot")

    plotContainer.addEventListener("click", e => {
        let plotDiv = document.createElement("div")
        plotDiv.setAttribute("id", "plotDiv")
        plotDiv.innerHTML = `
            <h3 class="plot-title">Full Plot for ${movie.Title}:</h3>
            ${moviePlotEl.innerText}`

        if(plotContainer.querySelector("#plotDiv") != null){
            document.getElementById("plotDiv").outerHTML = ""
            removeFadeWrapper()
        } else {
            addFadeWrapper()
            plotContainer.appendChild(plotDiv)

            setTimeout(() => {
                document.body.addEventListener("click", e => {
                    if(plotContainer.querySelector("#plotDiv") != null){
                        document.getElementById("plotDiv").outerHTML = ""
                        removeFadeWrapper()
                    }
                }, {once : true})
            }, 20);
        }
    })
}


//add / remove fade
function addFadeWrapper() {
    fadedWrapper.style.display = "block"
}

function removeFadeWrapper() {
    fadedWrapper.style.display = "none"
}


//Other Movies
function searchOtherResults(){
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ee87a68d&s=${searchBar.value}&type=movie`)
        .then(res => res.json())
        .then(data => { 
            if(data.Error === "Too many results."){
                otherSearchResultContainer.innerHTML += `
                <h3 class="intro-header">Not what you were looking for?<br>Please try a more specific search.</h3>`
                return
            }

            if(data.Response != "False"){
                if(data.Search.length > 1){
                    otherSearchResultContainer.innerHTML += `
                    <h3 class="intro-header">Not what you were looking for?<br>Try these other titles:</h3>`
                    
                    for(i = 0; i < data.Search.length; i++){
                        if(data.Search[i].Title != uniqueMovieName && data.Search[i].Poster != "N/A"){
                        let newMovie = new otherResult(data.Search[i])
                        newMovie.formatOtherResult()
                        }
                    }
                    document.querySelectorAll("[data-result-title]").forEach(item => {
                        item.addEventListener("click", e => {
                            (searchBar.value = e.target.innerText)
                            searchMovies()
                        })
                    })
                }
            }           
        })
}

function otherResult(data){
    Object.assign(this, data)
    this.formatOtherResult = function() {
       otherSearchResultContainer.innerHTML += `
        <div class="search-result flex align">
            <div class="movie-poster secondary-movie-poster flex justify-around"><img src="${this.Poster}"></div>
            <p class="movie-title secondary-title" data-result-title>${this.Title}</p>
        </div>
        `
    }
}

function test1(param){
    param += 1
    console.log(param)
}

test1(2)