$(function () {
  $("#navbarToggle").blur(function () {
    if (window.innerWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Insert HTML into page
var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

// Show loading icon
var showLoading = function (selector) {
  insertHtml(selector,
    "<div class='text-center'><img src='images/ajax-loader.gif'></div>");
};

// Replace {{property}}
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

// Activate Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace("active", "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    document.querySelector("#navMenuButton").className += " active";
  }
};

// 🔥 LOAD HOME ON PAGE LOAD
document.addEventListener("DOMContentLoaded", function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );
});

// Build Home HTML
function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var randomCategory =
        chooseRandomCategory(categories).short_name;

      var finalHtml =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + randomCategory + "'"
        );

      insertHtml("#main-content", finalHtml);
    },
    false
  );
}

// Choose random category
function chooseRandomCategory(categories) {
  var index = Math.floor(Math.random() * categories.length);
  return categories[index];
}

// Load categories
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

// Load menu items
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML);
};

// Categories page
function buildAndShowCategoriesHTML(categories) {

  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {

      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {

          switchMenuToActive();

          var finalHtml =
            buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml);

          insertHtml("#main-content", finalHtml);
        },
        false);
    },
    false);
}

// Build categories HTML
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    html = insertProperty(html, "name", categories[i].name);
    html = insertProperty(html, "short_name", categories[i].short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// Menu items page
function buildAndShowMenuItemsHTML(categoryMenuItems) {

  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {

      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {

          switchMenuToActive();

          var finalHtml =
            buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml);

          insertHtml("#main-content", finalHtml);
        },
        false);
    },
    false);
}

// Build menu items HTML
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name);

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  var items = categoryMenuItems.menu_items;
  var catShort = categoryMenuItems.category.short_name;

  for (var i = 0; i < items.length; i++) {
    var html = menuItemHtml;

    html = insertProperty(html, "short_name", items[i].short_name);
    html = insertProperty(html, "catShortName", catShort);
    html = insertProperty(html, "name", items[i].name);
    html = insertProperty(html, "description", items[i].description || "");

    if (i % 2 !== 0) {
      html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

global.$dc = dc;

})(window);
