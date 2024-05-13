const baseURL = 'https://pokeapi.co/api/v2/',
      searchInput = getElement('.search-input'),
      searchButton = getElement('.search-button'),
      buttonLoadMorePokemons = getElement('.load-more-button'),
      containerPokemon = getElement('.pokemon-list'),
      counterTotalPokemon = getElement('#counter'),
      counterShowingResultPokemon = getElement('#showing-data-pokemon'),
      containerData = getElement(".container-data"),
      containerMenu = getElement(".item-menu"),
      noImage = "https://placehold.co/280x280?text=No-Image",
      circleBackgroundPokemonCard = getElement(".image-pokemon:before"),
      modalNamePokemon = getElement('#namePokemon'),
      modalIdPokemon = getElement('#idPokemon'),
      modalIconTypePokemon = getElement('#iconTypePokemon'),
      modalImagePokemon = getElement('#imagePokemon'),
      modalBgType= getElement('.images-modal'),
      modalWeight= getElement('#weight'),
      modalHeight= getElement('#height'),
      modalAbility= getElement('#ability'),
      modalHp= getElement('#hp'),
      modalAttack= getElement('#attack'),
      modalDefense= getElement('#defense'),
      modalSpAttack= getElement('#spattack'),
      modalSpDefense= getElement('#spdefense'),
      modalSpeed= getElement('#speed'),
      modalTextType1 = getElement('#textType1'),
      modalTextType2 = getElement('#textType2'),
      modalBgType1 = getElement('#bgType1'),
      modalBgType2 = getElement('#bgType2');

const Pokemon = {
  idPokemon: 0,
  name: "",
  type1: "",
  type2: "",
  image:"",
  height:"",
  weight:"",
  ability:"",
  hp: 0,
  attack: 0,
  defense: 0,
  sp_attack: 0,
  sp_defense: 0,
  speed: 0
}

let listNamePokemon = [],
    listInfoPokemon = [],
    countTotalPokemon = 0,
    countShowingPokemon = 0,
    countOffset = 0,
    pokemonCard = "",
    type = 'all';

function getElement(element) {
    return document.querySelector(element);
} 

function getPokemon(offset, type){
  type == 'all' ?  getAllPokemon(offset) : getPokemonForType(offset, type) ;
}

async function getAllPokemon(offset){
  countOffset += (offset ? offset : 0 );
  buttonLoadMorePokemons.style.display = "block"
  const resultListNamePokemon = await fetch(`${baseURL}pokemon/?offset=${countOffset}&limit=9`)
  const dataListNamePokemon = await resultListNamePokemon.json()
  countTotalPokemon = dataListNamePokemon.count;
  listNamePokemon = [];

  for (let i = 0; i < dataListNamePokemon.results.length; i++) {
      listNamePokemon.push(dataListNamePokemon.results[i].name)
  }

  getInfoPokemon(listNamePokemon, type);
}

async function getPokemonForType(offset, type){
  countOffset += (offset ? offset : 9 );
  buttonLoadMorePokemons.style.display = "none"
  try {
    const resultListNamePokemon = await fetch(`${baseURL}type/${type}`)
    const dataListNamePokemon = await resultListNamePokemon.json()
    listNamePokemon = [];
    for (let i = 0; i < dataListNamePokemon.pokemon.length; i++) {
        listNamePokemon.push(dataListNamePokemon.pokemon[i].pokemon.name)
    }
    getInfoPokemon(listNamePokemon, type)
  } catch (error) {
  console.log(error);
  }
}


async function getInfoPokemon(listNamePokemon, type){
  countShowingPokemon += listNamePokemon.length;
  counterTotalPokemon.innerHTML = `${countTotalPokemon} Pokémons`;
  counterShowingResultPokemon.innerHTML = `Showing ${countShowingPokemon} results for: <strong>'${firstLetterCapitalized(type)}'</strong>`;

    for (let i = 0; i < listNamePokemon.length; i++) {

      try {

        const resultListInfoPokemon = await fetch('https://pokeapi.co/api/v2/pokemon/' + listNamePokemon[i])
        const dataInfoPokemon = await resultListInfoPokemon.json()
        let pokemonObj = Object.create(Pokemon);
        pokemonObj.idPokemon = dataInfoPokemon.id;
        pokemonObj.name = dataInfoPokemon.name;
        pokemonObj.type1 = dataInfoPokemon.types[0].type.name;
        pokemonObj.type2 = dataInfoPokemon.types[1] ? dataInfoPokemon.types[1].type.name : null;
        pokemonObj.image = 
                            dataInfoPokemon.sprites.other.dream_world.front_default || 
                            dataInfoPokemon.sprites.other["official-artwork"].front_default || 
                            dataInfoPokemon.sprites.other.home.front_default || noImage;
        pokemonObj.ability = dataInfoPokemon.abilities[0].ability.name;
        pokemonObj.height = dataInfoPokemon.height;
        pokemonObj.weight = dataInfoPokemon.weight;
        pokemonObj.hp = dataInfoPokemon.stats[0].base_stat;
        pokemonObj.attack = dataInfoPokemon.stats[1].base_stat;
        pokemonObj.defense = dataInfoPokemon.stats[2].base_stat;
        pokemonObj.sp_attack = dataInfoPokemon.stats[3].base_stat;
        pokemonObj.sp_defense = dataInfoPokemon.stats[4].base_stat;
        pokemonObj.speed = dataInfoPokemon.stats[5].base_stat;
        listInfoPokemon.push(pokemonObj);        
        }  
      catch (error) {
        countShowingPokemon = 0;
        counterTotalPokemon.innerHTML = "Search results";
        counterShowingResultPokemon.innerHTML = `Showing ${countShowingPokemon} results for: <strong>'${firstLetterCapitalized(type)}'</strong>`; 
        console.log(`Erro ao buscar informações do Pokémon: ${error}`);
      }
    }
    pokemonCard = "";
    for (let i = 0; i < listInfoPokemon.length; i++) {
        pokemonCard += createCardPokemon(listInfoPokemon[i], i);
    }
    containerData.style.visibility = "visible";
    containerPokemon.innerHTML = pokemonCard;
    hideSpinner()
}
function getTypePokemonForMenu(url) {
    fetch(url + "type?offset=0&limit=100")
      .then(response => response.json())
      .then(data => {
        listTypePokemon = data;
        containerMenu.innerHTML = createListTypeMenu(listTypePokemon);
      })
      .catch(err => console.log(err));
  }
function createCardPokemon (pokemonData, index) {
    let card;
    let idPokemon;

    idPokemon = `${pokemonData.idPokemon}`;
    idPokemon = idPokemon.length <= 3 ? ("000" + idPokemon).slice(-3) : idPokemon;

    showType2 = `<img src="images/${pokemonData.type2}.svg" title="Type ${pokemonData.type2}" alt="Type ${pokemonData.type2}"></img>`;
    pokemonData.type2 ? pokemonData.type2 : showType2 = '';

    card = `
        <div class="card-pokemon" onclick="openModal(${index})"> 
            <div class="image-pokemon" ">
              <div class="image-pokemon-circle" style="background-color: var(--color-${pokemonData.type1});">
              </div>
                <img src="${pokemonData.image}" alt="Image of Pokémon ${pokemonData.name}">
            </div>
            <p>#${idPokemon}</p>
            <div class="info-pokemon">
              <span title="${firstLetterCapitalized(pokemonData.name)}">${firstLetterCapitalized(pokemonData.name)}</span>
              <div>
                <img src="images/${pokemonData.type1}.svg" title="Type ${pokemonData.type1}" alt="Type ${pokemonData.type1}">
                ${showType2}
              </div>
            </div>
        </div>
    `;
    return card;
}

function createListTypeMenu (listTypePokemon) {
    menu = `
            <li id="all" class="active" onclick="searchPokemonFromType(event, this.id)">
              <a href=""><img src="images/icon-menu-ball.svg" style="padding: 0.5rem" alt="">
                <span>All</span>
              </a>
            </li>
    `;

    for (let i = 0; i < listTypePokemon.count; i++) {
      menu += `
        <li id="${listTypePokemon.results[i].name}" onclick="searchPokemonFromType(event, this.id)">
          <a href="#"><img id="icon-menu-${listTypePokemon.results[i].name}" src="images/${listTypePokemon.results[i].name}.svg" onerror="imageNotFound(this.id, '${listTypePokemon.results[i].name}')" alt="">
            <span style="color: var(--color-${listTypePokemon.results[i].name})">${firstLetterCapitalized(listTypePokemon.results[i].name)}</span>
          </a>
        </li>
      `;
    }
    return menu;
  }

function firstLetterCapitalized (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function searchPokemonFromType(event, type) {
  event.preventDefault();
  showSpinner()
  containerData.style.visibility = "hidden";
  counterTotalPokemon.innerHTML = "";
  containerPokemon.innerHTML = "";
  listNamePokemon = [];
  listInfoPokemon = [];
  countShowingPokemon = 0;
  countOffset = 0;
  getPokemon(countOffset, type);

  const itensMenu = document.querySelectorAll('.item-menu li');
  itensMenu.forEach(function(itemMenu) {
    itemMenu.classList.remove('active');
  });

  const elemento = document.getElementById(type);
    elemento.classList.add("active");
}

function searchPokemon(valueInput) {
  showSpinner()
  containerData.style.visibility = "hidden";
  containerPokemon.innerHTML = "";
  buttonLoadMorePokemons.style.display = "none"
  listNamePokemon = [];
  listInfoPokemon = [];
  countShowingPokemon = 0;
  countOffset = 0;
  listNamePokemon.push(valueInput.toLowerCase()); 
  getInfoPokemon(listNamePokemon, valueInput);
  counterTotalPokemon.innerHTML = "Search results";
}

searchButton.addEventListener('click', event => {
  event.preventDefault();
  searchPokemon(searchInput.value);
});
  
searchInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    searchPokemon(searchInput.value);
  }
});

buttonLoadMorePokemons.addEventListener('click', event => {
  event.preventDefault();
  showSpinner()
  getPokemon(9, 'all');

});

document.addEventListener("DOMContentLoaded", function() {
  showSpinner()
  getTypePokemonForMenu(baseURL);
  getPokemon(0, 'all');
  slideHero();
});

function showSpinner() {
  document.getElementById("overlay").style.display = "block";
}

function hideSpinner() {
  document.getElementById("overlay").style.display = "none";
}

function openModal(index) {
  modalNamePokemon.innerText = `${firstLetterCapitalized(listInfoPokemon[index].name)}`;
  idPokemon = `${listInfoPokemon[index].idPokemon}`;
  idPokemon = idPokemon.length <= 3 ? ("000" + idPokemon).slice(-3) : idPokemon;
  modalIdPokemon.innerHTML = `#${idPokemon}`;
  modalIconTypePokemon.src = `/images/${listInfoPokemon[index].type1}.svg`;
  modalImagePokemon.src = `${listInfoPokemon[index].image}`;
  modalBgType.style.background = `url(../images/bg-modal-${listInfoPokemon[index].type1}.svg) no-repeat top center`;
  modalWeight.innerHTML = `${listInfoPokemon[index].weight.toFixed(1)/10}kg`;
  modalHeight.innerHTML = `${(listInfoPokemon[index].height/10).toFixed(1)}m`;
  modalAbility.innerHTML = `${firstLetterCapitalized(listInfoPokemon[index].ability)}`;
  modalHp.style.width  = `${listInfoPokemon[index].hp}%`;
  modalAttack.style.width  = `${listInfoPokemon[index].attack}%`;
  modalDefense.style.width  = `${listInfoPokemon[index].defense}%`;
  modalSpAttack.style.width  = `${listInfoPokemon[index].sp_attack}%`;
  modalSpDefense.style.width  = `${listInfoPokemon[index].sp_defense}%`;
  modalSpeed.style.width  = `${listInfoPokemon[index].speed}%`;
  modalTextType1.innerHTML  = `${firstLetterCapitalized(listInfoPokemon[index].type1)}`;
  modalTextType1.style.color  = `var(--color-${listInfoPokemon[index].type1})`;
  modalBgType1.style.backgroundColor   = `var(--color-${listInfoPokemon[index].type1})`;
  document.getElementById('groupType2').style.display = 'none';

  if (listInfoPokemon[index].type2) {
    document.getElementById('groupType2').style.display = 'block';
    modalTextType2.innerHTML  = `${firstLetterCapitalized(listInfoPokemon[index].type2)}`;
    modalTextType2.style.color  = `var(--color-${listInfoPokemon[index].type2})`;
    modalBgType2.style.backgroundColor   = `var(--color-${listInfoPokemon[index].type2})`;
  }

  setTimeout(function() {
    document.getElementById('modal').style.display = 'block';
  }, 100);
  
}

function closeModal() {
  document.getElementById('modal').style.animation = "fadeOut 0.3s";
  setTimeout(function() {
    document.getElementById('modal').style.animation = "";
    document.getElementById('modal').style.display = 'none';
  }, 250);
  
}


function imageNotFound(idImage, idLi) {
  let image = document.getElementById(idImage);
  if (!image.complete || image.naturalHeight === 0) {
    document.querySelector('li#'+idLi).style.display = 'none';
  }
}

function slideHero() {
  const overlaySlideHero = document.getElementById('overlaySlideHero');
    let isDragging = false;
    let startX;
    let preventSwipe = true;

    overlaySlideHero.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
    });

    overlaySlideHero.addEventListener('mouseup', function(e) {

      if(isDragging) {
        const endX = e.clientX;
        const deltaX = endX - startX;
        if (deltaX > 50 && preventSwipe) {
          setTimeout(function() {
            document.getElementById('hero2').style.display = 'block';
            document.querySelector('.container-bg-slide-hero-blue').style.display = 'block';
            document.getElementById('hero1').style.display = 'none';
            document.querySelector('.container-bg-slide-hero-red').style.display = 'none';
          }, 100);
          
          preventSwipe = false;
        } else if (deltaX < -50 && !preventSwipe) {
          setTimeout(function() {
            document.getElementById('hero1').style.display = 'block';
            document.querySelector('.container-bg-slide-hero-red').style.display = 'block';
            document.getElementById('hero2').style.display = 'none';
            document.querySelector('.container-bg-slide-hero-blue').style.display = 'none';
          }, 100);
          preventSwipe = true;
        }
        isDragging = false;
      }
    });

    overlaySlideHero.addEventListener('touchstart', function(e) {
      isDragging = true;
      startX = e.touches[0].clientX;
    });

    overlaySlideHero.addEventListener('touchend', function(e) {
      if(isDragging) {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (deltaX > 50 && preventSwipe) {
          setTimeout(function() {
            document.getElementById('hero2').style.display = 'block';
            document.querySelector('.container-bg-slide-hero-blue').style.display = 'block';
            document.getElementById('hero1').style.display = 'none';
            document.querySelector('.container-bg-slide-hero-red').style.display = 'none';
          }, 100);
          
          preventSwipe = false;
        } else if (deltaX < -50 && !preventSwipe) {
          setTimeout(function() {
            document.getElementById('hero1').style.display = 'block';
            document.querySelector('.container-bg-slide-hero-red').style.display = 'block';
            document.getElementById('hero2').style.display = 'none';
            document.querySelector('.container-bg-slide-hero-blue').style.display = 'none';
          }, 100);
          preventSwipe = true;
        }
        isDragging = false;
      }
    });
}

function setFocusToTextBox(event){
  event.preventDefault();
  var textbox = document.getElementById("searchInput");
  textbox.focus();
  textbox.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  window.scrollBy(0, -30); 
}