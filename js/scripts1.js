//Wrap repository array in an IIFE to avoid accidentally accessing the global state
var pokemonRepository = (function() {
    //Creates an empty repository
    var repository = [];
    //Creates a variable to access the pokemon API
    var $apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    //Function to create a list of items from API
    function addListItem(pokemon) {
        //Assigns a variable to the ul list
        var $pokemonList = $('.pokemon-list');
        //Assigns a variable to the list item
        var $listItem = $('<li>');
        //Assigns a variable to the button
        var $button = $('<button type = "button" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModal">' + pokemon.name + '</button>');
        $listItem.append($button);
        $pokemonList.append($listItem);
        $button.on('click', function(event) {
        showDetails(pokemon);
        });
    }

    //Function to add each pokemon and attributes
    function add(pokemon) {
        repository.push(pokemon);
    }

    //Function to pull all pokemon data
    function getAll() {
        return repository;
    }

    //Function to load pokemon list from API
    function loadList() {
        return $.ajax($apiUrl)
        .then(function(json) {
          json.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
            });
        })
        .catch(function(e) {
            console.error(e);
        });
    }

    // Function to load details for each pokemon:
    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url)
        .then(function(details) {
            // Adds the details to each item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = [];
             for (var i = 0; i < details.types.length; i++){
               item.types.push(details.types[i].type.name);
             }
            item.abilities = [];
            for (var i = 0; i < details.abilities.length; i++){
              item.abilities.push(details.abilities[i].ability.name);
            }
            return item;
          })
          .catch(function(e) {
            console.error(e);
        });
    }

    // Shows modal content
    function showModal(item) {
        $('.modal-title').text(item.name);
        $('.height').text("Height: " + item.height + "m");
        $('.type').text("Type: " + item.types);
        $('.image').attr("src", item.imageUrl);
        $('.abilities').text("Abilities: " + item.abilities);
      }

        // Function to console.log pokemon details
        function showDetails(item) {
           pokemonRepository.loadDetails(item).then(function() {
            console.log(item);
            showModal(item);
        });
       }

    // Returns the values that can be accessed outside of the IIFE
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        showModal: showModal,
        loadDetails: loadDetails,
        showDetails: showDetails
    };
  })();

  // Creates a list of pokemon with their name on the button
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        console.log(pokemon);
        pokemonRepository.addListItem(pokemon);
    });
});
