const mainContainer = document.getElementById("main")



class WatchlistEntry {
    constructor(data) {
        Object.assign(this, data)
        this.formatMovie = function() {
            const searchResultContainer = document.createElement("div")
            searchResultContainer.setAttribute("class", "search-result-container")
            searchResultContainer.setAttribute("id", `${this.ID}-Container`)
            mainContainer.appendChild(searchResultContainer)
            document.getElementById(`${this.ID}-Container`).innerHTML = `
            <div class="search-result flex justify-between" id="searchResult-${this.ID}">
            <div class="movie-poster flex justify-around align"><img src="${this.Poster}"></div>

            <div class="movie-description flex">
                <div class="desc-top">
                    <div class="movie-header flex justify-between">
                        <p class="movie-title">${this.Title}</p><p class="movie-rating">⭐ ${this.Rating.slice(0, -3)} / 10</p>
                    </div>

                    <div class="movie-details flex">
                        <div class="movie-runtime flex align">${this.Runtime}</div>

                        <div class="movie-genre flex align">${this.Genre}</div>

                        <div class="btn watchlist-add-btn flex justify-between align" data-remove-btn-${this.ID}>
                            <img src="images/plus-icon.svg" class="add-icon">
                            <p>Remove</p>
                        </div>
                    </div>
                </div>

                <div class="plot-container" id="plotContainer-${this.ID}">
                    <div class="movie-plot" id="moviePlot-${this.ID}">${this.Plot}</div>
                </div>
            </div>
        </div>`  
        
        fullPlot(this)
        }
    }
} 


function renderWatchlist() {    
    if(localStorage.length > 0){
        placeholder.style.display = "none"
        mainContainer.style.display = "flex"
        for(i = localStorage.length; i > 0; i--){
            let movieKeyData = JSON.parse(localStorage.getItem(localStorage.key(i - 1)))
            let newWatchlistEntry = new WatchlistEntry(movieKeyData)
            newWatchlistEntry.formatMovie()

            // Remove button
            document.querySelector(`[data-remove-btn-${movieKeyData.ID}]`).addEventListener("click", e => {
                    localStorage.removeItem(movieKeyData.Title)
                    let removeContainer = document.getElementById(`${movieKeyData.ID}-Container`)
                    let removeResult = document.getElementById(`searchResult-${movieKeyData.ID}`)

                    //play remove animation -> remove element after delay
                    removeResult.classList.add("dissolve")
                    setTimeout(() => {
                        removeContainer.outerHTML = ""
                        removeResult.outerHTML = ""
                        
                        if(localStorage.length === 0){
                            mainContainer.innerHTML = ""
                            mainContainer.style.display ="none"
                            placeholder.style.display = "flex"
                        }
                    }, 400);
                    
                })
        }
            
    } else {
        mainContainer.innerHTML = ""        
        mainContainer.style.display = "none"
        placeholder.style.display = "flex"
    }
}

//show full plot
function fullPlot(movie){
    const plotContainer = document.getElementById(`plotContainer-${movie.ID}`)
    const moviePlotEl = document.getElementById(`moviePlot-${movie.ID}`)

    plotContainer.addEventListener("click", e => {
        let plotDiv = document.createElement("div")
        plotDiv.setAttribute("id", "plotDiv")
        plotDiv.innerHTML = `
            <h3 class="plot-title">Full Plot for ${movie.Title}:</h3>
            ${moviePlotEl.innerText}`

        if(plotContainer.querySelector("#plotDiv") != null){
            document.getElementById("plotDiv").outerHTML = ""
            removeFade()
        } else {
            addFade()
            plotContainer.appendChild(plotDiv)

            setTimeout(() => {
                document.body.addEventListener("click", e => {
                    if(plotContainer.querySelector("#plotDiv") != null){
                        document.getElementById("plotDiv").outerHTML = ""
                        removeFade()
                    }
                }, {once : true})
            }, 20);
        }
    })
}

//add / remove fade
function addFade() {
    fadedWrapper.style.display = "block"
}

function removeFade() {
    fadedWrapper.style.display = "none"
}

renderWatchlist()
