import * as model from './model.js';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable'; // polyfilling almost everything
import 'regenerator-runtime/runtime'; // polyfilling async await
import { MODAL_CLOSE_SEC } from './config.js';

const { async } = require('regenerator-runtime');

/* if (module.hot) {
  module.hot.accept();
} */

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    // Fetching recipe
    const currHash = window.location.hash.slice(1);
    if (!currHash) return;

    // load spinner
    recipeView.renderSpinner();

    // highlight active recipe
    resultsView.update(model.getSearchResultsPage());
    // load recipe
    await model.loadRecipe(currHash);
    // show recipe
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmark);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    // render spinner
    resultsView.renderSpinner();
    // get search query
    const query = searchView.getQuery();
    console.log(query);
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // render pages
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlToggleBookmark = function () {
  if (!model.state.recipe.bookmarked) model.bookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // load spinner
    addRecipeView.renderSpinner();

    // upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state);

    // render newly created recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // render bookmark
    bookmarksView.render(model.state.bookmark);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close overlay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlToggleBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerButton(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
/* window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes); */
