//Wrap repository array in an IIFE to avoid accidentally accessing the global state
var pokemonRepository = (function() {
    //Creates an empty repository
    var repository = [];
    //Creates a variable to access the pokemon API
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    //Function to create a list of items from API
    function addListItem(pokemon) {
        //Assigns a variable to the ul list
        var $pokemonList = $('.pokemon-list');
        //Assigns a variable to the list item
        var $listItem = $('<li>');
        //listItem.text(pokemon.name);
        //Assigns a variable to the button
        var $button = $('<button class="my-class">' + pokemon.name + '</button>');
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
        return $.ajax(apiUrl)
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
            //check?
            //item.types = details.types.map(funtion(pokemon){
            //  return pokemon.type.name;
            //});
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

    // Function to console.log pokemon details
    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function() {
          console.log(item);
          showModal(item);
        });
    }
//check
    // Shows modal content
    function showModal(item) {
        var $modalContainer = $('#modal-container');
        //Clears existing content in the modal
        $modalContainer.empty();
        //Adds a div element to the dom
        var modal = $('div class="modal"></div>');
        //Creates closing button
        var closeButtonElement = $('<button class="modal-close">Close</button>');
        //Event listener to close the modal when clicked
        closeButtonElement.on('click', hideModal);
        //Adds pokemon name
        var nameElement = $('<h1>' + item.name + '</h1>');
    // creating img in modal content
    var imageElement = $('<img class="modal-img">');
    imageElement.attr('src', item.imageUrl);
    //creating element for height in modal content
    var heightElement = $('<p>' + 'height : ' + item.height + 'm' + '</p>');
    //creating element for weight in modal content
    var weightElement = $('<p>' + 'weight : ' + item.weight + 'kg' + '</p>');
    //creating element for type in modal content
    var typesElement = $('<p>' + 'types : ' + item.types + '</p>');
    //creating element for abilities in modal content
    var abilitiesElement = $('<p>' + 'abilities : ' + item.abilities + '</p>');
    // Append modal content to webpage
    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(imageElement);
    modal.append(heightElement);
    modal.append(weightElement);
    modal.append(typesElement);
    modal.append(abilitiesElement);
    $modalContainer.append(modal);
    // Add class to show modal
    $modalContainer.addClass('is-visible');
  }

  // hides modal when close button is clicked
  function hideModal() {
    var $modalContainer = $('#modal-container');
    $modalContainer.removeClass('is-visible');
  }

  // Hides model when ESC is clicked
  jQuery(window).on('keydown', e => {
    var $modalContainer = $('#modal-container');
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  // Hides modal if clicked outside of it
  var $modalContainer = document.querySelector('#modal-container');
  $modalContainer.addEventListener('click', e => {
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });

    // Returns the values that can be accessed outside of the IIFE
    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showModal: showModal,
        hideModal: hideModal,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    };
  })();
// Creates a list of pokemon with their name on the button
pokemonRepository.loadList().then(function(pokemon) {
    pokemonRepository.getAll().forEach(function(pokemon) {
        console.log(pokemon);
        pokemonRepository.addListItem(pokemon);
    });
});
