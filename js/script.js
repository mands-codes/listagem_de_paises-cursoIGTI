let tabCountries = null;
let tabFavorites = null;

let allCountries = []; 
let favoriteCountries = [];

let countCountries =0;
let countFavorites = 0;

let totalPopulationList =0;
let totalPopulationFavorites =0;

let numberFormat = null;

window.addEventListener('load', ()=>{
tabCountries = document.querySelector('#tabCountries');
tabFavorites = document.querySelector('#tabFavorites');
countCountries = document.querySelector('#countCountries');
countFavorites = document.querySelector('#countFavorites');

totalPopulationList = document.querySelector('#totalPopulationList')
totalPopulationFavorites = document.querySelector('#totalPopulationFavorites')

numberFormat = Intl.NumberFormat('pt-br');

//invocação do fetch
fetchCountries();
});
// pegando dados da api
async function fetchCountries(){
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();
    allCountries = json.map(country =>{
        return {
            id : country.numericCode,
            name: country.translations.pt,
            population: country.population,
            formattedPopulation: formatNumber(country.population),
            flag: country.flag
        };
    });
    render();
}
//alterar tudo simultaneamente
function render(){
    renderCountryList();
    renderFavorites();
    renderSummary();
    
    handleCountryButtons();

}
// popular a lista de paises
function renderCountryList(){
let countriesHTML = "<div>";

allCountries.forEach(country =>{
    const {name, flag, id, formattedPopulation} = country;

const countryHTML = `
    <div class='country'>
    <div>
        <a id="${id}" class="waves-effect waves-light btn">+</a>
    </div>
    <div>
    <img src="${flag}" alt="${name}">
    </div>
    <div>
    <ul>
    </ul>
    <li>${name}</li>
    <li>${formattedPopulation}</li>
    </div>
</div>
`;
countriesHTML += countryHTML;
}); //foreach
countriesHTML += '</div>'
tabCountries.innerHTML = countriesHTML;
}

//popular a lista de favoritos
function renderFavorites(){
 let favoritesHTML = "<div>";

 favoriteCountries.forEach(country =>{
    const {name, flag, id, formattedPopulation} = country;

    const favoriteCountryHTML = `
    <div class='country'>
    <div>
        <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
    </div>
    <div>
    <img src="${flag}" alt="${name}">
    </div>
    <div>
    <ul>
    </ul>
    <li>${name}</li>
    <li>${formattedPopulation}</li>
    </div>
</div>
`;
favoritesHTML += favoriteCountryHTML;
 });
 favoritesHTML += '</div>';
 tabFavorites.innerHTML = favoritesHTML;
}


//quantidade de paises e populacao
function renderSummary(){
    countCountries.textContent = allCountries.length;
    countFavorites.textContent = favoriteCountries.length;

    const totalPopulation = allCountries.reduce((accumulator, current)=>{
        return accumulator + current.population;
    }, 0);

    const totalFavorites = favoriteCountries.reduce((accumulator, current)=>{
        return accumulator + current.population;
    },0);

    totalPopulationList.textContent =  formatNumber(totalPopulation);
    totalPopulationFavorites.textContent = formatNumber(totalFavorites);

}
//buscar os botoes dentro da div tabCountries
function handleCountryButtons(){
    const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
    const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

    countryButtons.forEach(button =>{
        button.addEventListener('click', ()=> addToFavorites(button.id));
    });

    favoritesButtons.forEach(button =>{
        button.addEventListener('click', ()=> removeFromFavorites(button.id)); 
    }); 
}

function addToFavorites(id){
    const countryToAdd = allCountries.find(country => country.id ===id);
    //espalhar paises atuais e adicionar novos paises selecionados
    //espalhar e concatenar
    favoriteCountries = [...favoriteCountries, countryToAdd];
//ordenar na ordem alfabetica
    favoriteCountries.sort((a,b)=>{
        return a.name.localeCompare(b.name)
    });

 //remover pais selecionado da lista atual
 //se o id do pais que chegou na lista dos favoritos, for diferente dos demais, ele mantém na lista 01
 allCountries = allCountries.filter(country => country.id !== id);

 render();
}

function removeFromFavorites(id){
    const countryToRemove= favoriteCountries.find(country => country.id ===id);
    //espalhar paises atuais e adicionar novos paises selecionados
    //espalhar e concatenar
   allCountries = [...allCountries, countryToRemove];
//ordenar na ordem alfabetica
    allCountries.sort((a,b)=>{
        return a.name.localeCompare(b.name)
    });

 //remover pais selecionado dos favoritos
 favoriteCountries= favoriteCountries.filter(country => country.id !== id);

 render();
}

function formatNumber(number){
    return numberFormat.format(number);
}