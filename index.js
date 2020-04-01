var searchType;
var drinksArray;

function turnOnBackButton() {
  $('button#back-btn').on('click', function() {
    $('.search-form-page').show();
    $('.search-results-page').html('');
    $('button#back-btn').remove();
  });
};


function listDrinks(data) {
  drinksArray = data.drinks
  console.log(drinksArray)

  // $('.drink-name-and-image').remove(); // <- working solution

  for(var i = 0; i < drinksArray.length; i++){
    $('.search-results-page').append(`
      <div id='${drinksArray[i]['idDrink']}' class="drink-name-and-image">
      <h1 class='drink-name'>${drinksArray[i]['strDrink']}</h1>
      <img class='drink-image' src='${drinksArray[i]['strDrinkThumb']}'>
      </div>`)


  }
}

function chooseDrink(drinksArray) {
  $('.drink-name-and-image').on('click', function() {
    var drinkId = $(this).attr('id')
    console.log(drinkId)
    getDrinkDetails(drinkId, drinksArray)
  })
}

function getDrinkDetails(drinkId, drinksArray) {
  $('.drink-name-and-image').remove()
  for (var i =0; i < drinksArray.length; i++) {
    if (drinksArray[i].idDrink === drinkId) {
      console.log(drinksArray[i])
      $('.search-results-page').prepend(`<h2>${drinksArray[i]['strDrink']}</h2>`)
      $('.search-results-page').prepend(`<img class='drink-image' src='${drinksArray[i]['strDrinkThumb']}'>`)

      if (searchType === "name") {
        addRecipe(drinksArray[i])
      } else {
        $.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinksArray[i]['strDrink']}`, function(data) {
          addRecipe(data.drinks[0])
        })
      }
    }
  }

}

function addRecipe(recipe) {
  $('.search-results-page').append(`
  <p><i>Category:</i><strong> ${recipe.strCategory}</strong></p>
  <p><strong>${recipe.strAlcoholic}<strong></p>
  <p><i>Please use a ${recipe.strGlass}.</i></p>
  <p><i>Instructions:</i> ${recipe.strInstructions}</p>
  <table>
    <tr>
      <th>
        Ingredient
      </th>
      <th>
        Measurement
      </th>
    </tr>
  </table>
  `);
  console.log(recipe)
  var recipeKeys = Object.keys(recipe)
  console.log(recipeKeys)
  var ingredients = []
  var measurements = []
  for (var i = 0; i < recipeKeys.length; i++) {
    if (recipeKeys[i].includes('strIngredient')) {
      ingredients.push(recipeKeys[i])
    } else if (recipeKeys[i].includes('strMeasure')) {
      measurements.push(recipeKeys[i])
    };
  };

  for (var i = 0; i < ingredients.length; i++) {
    if (recipe[ingredients[i]]) {
      $('.search-results-page table').append(`
      <tr>
        <td>
          ${recipe[ingredients[i]]}
        </td>
        <td>
          ${recipe[measurements[i]]}
        </td>
      </tr>
      `)
    }
  }
}

function hideSearchOptions(searchTypeSelected) {
  $('#choose-search-option').hide();
  $('#search-area').show();
  searchType = searchTypeSelected;
}

$(document).ready(function() {
  $('.search-by-name').on('click', function() {
    hideSearchOptions('name')
  })
  $('.search-by-ingredient').on('click', function() {
    hideSearchOptions('ingredient')
  })
  // $('.search-results-page').hide()
  // $('.search-again-button').hide(0)


  // $('.search-again-button').click(function(event){
  //       event.preventDefault()
  //       $('.search-form-page').show(0)
  //       $('.search-results-page').hide(0)
  //       $('.search-again-button').hide(0)
  // })




  $('.search-form-page').on('submit', function(event) {
    event.preventDefault()
    console.log($('#search-input').val())
    var searchInput = $('#search-input').val()

    if (searchInput) {
      if (searchType === 'name') {
        $.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`, function(data) {
          console.log(data)
          listDrinks(data)
          chooseDrink(drinksArray)

        })
      } else {
        $.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}&key=1`, function(data) {
          console.log(data)
          listDrinks(data)
          chooseDrink(drinksArray)
        })
      }
      $('#search-input').val('');
      $('.search-form-page').hide();
      $('.search-results-page').append('<button id="back-btn">Go Back</button>');

    }else {
      $('.search-form-page').append('<p style="color:red">Please enter something</p>');
    };

    if ($('p')) {
      $('p').remove();
    };

    turnOnBackButton();


  })

  // $(document).on('click', '.drink-name-and-image', function(event)  {
  //   event.preventDefault();
  //   console.log($(this).text())
  // })





});
