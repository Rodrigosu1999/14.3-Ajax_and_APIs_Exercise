"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(keyword) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/singlesearch/shows?q=${keyword}`)
  return res.data;

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

    const $show = $(
        `<div data-show-id="${shows.id}" class="Show col-md-12 col-lg-6 mb-4" id="currShow">
         <div class="media">
           <img 
              src="${shows.image.original}" 
              alt="${shows.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${shows.name}</h5>
             <div><small>${shows.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */


//Here we are adding a click event  to get the show's id and to get the episodes of the series.
//We are also removing the "display: none" style for the episodes to show when they click on the episodes button
const showsList = $showsList.get(0)
showsList.addEventListener("click", async function getEpisodesOfShow(event) {
  event.preventDefault();
  const $currShow = $("#currShow");
  const id = $currShow.attr("data-show-id");
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  populateEpisodes(res.data);
  $episodesArea.attr("style", "");
 } )




/** Write a clear docstring for this function... */

//This function creates a new li for each episode of the Series currently displayed
const $ul = $("#episodes-list")
function populateEpisodes(episodes) {
  console.log(episodes);
  for (const episode of episodes) {
    $ul.append(`<li>Season ${episode.season}, number ${episode.number}, ${episode.name}</li>`)
  }
}
