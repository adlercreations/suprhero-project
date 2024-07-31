//index.js
//Opening event listener to let the user know the get ready!
window.addEventListener("load", () => {
    alert("LET'S GET READY TO RUMBBBLLLLLEEE!!");
})

//variables to manage DOM
const heroesContainer = document.getElementById("heroes-container");
const hero1Div = document.getElementById("hero1");
const hero2Div = document.getElementById("hero2");
const fightButton = document.getElementById("fight-button");
const winnerDiv = document.getElementById("winner");
const leaderboardDiv = document.getElementById("leaderboard");

//empty varaibles to contain later data
let selectedHeroes = [];
let heroesData = [];

//fetching data, filtering heroes, gathering battle wins, displaying heroes & leaderboard
fetch('https://akabab.github.io/superhero-api/api/all.json')
    .then(response => response.json())
    .then(data => {
        heroesData = filterHeroes(data);
        heroesData.forEach(hero => hero.wins = getWinsFromStorage(hero.id));
        displayHeroes(heroesData);
        displayLeaderboard();
    })
.catch(error => console.error('Error fetching data:', error));

//Fight button click event Listener
fightButton.addEventListener("click", handleFight);

// const ranomVar = document.querySelector("#winner")
// console.log(ranomVar)

// ranomVar.addEventListener("click", () => {
//     console.log("Hello Superman")
// })

//filterHeroes function to gather our heroes
function filterHeroes(data) {
    const heroNames = ["Hulk", "Superman", "Goku", "Silver Surfer", "Spider-Man", "Thor", "Batman", "Wonder Woman", "Deadpool", "Wolverine"];
    //returns the heeros we are looking for
    return data.filter(hero => {
        //Ran into problem with a second Batman showing up. had to filter it out using its ID
        return heroNames.includes(hero.name) && hero.id !== 69;
    });
}

//Reusable function to add each hero to DOM
function displayHeroes(heroes) {
    heroes.forEach(hero => {
        addHeroToContainer(hero);
    });
}

//Reusable function to manage individual DOM hero elements for the heros data to show on screen
function addHeroToContainer(hero) {
    const heroDiv = document.createElement("div");
    heroDiv.classList.add("hero");
    heroDiv.innerHTML = `<img src="${hero.images.sm}" alt="${hero.name}" data-id="${hero.id}">`;

    //Event Listeners for mouseover info and users hero selection
    heroDiv.addEventListener("mouseover", () => showHeroDetails(hero, heroDiv));
    heroDiv.addEventListener("mouseout", () => hideHeroDetails(heroDiv));
    heroDiv.addEventListener("click", () => selectHero(hero));

    heroesContainer.appendChild(heroDiv);
}

//Functions to tell event listeners what info to show and hide
function showHeroDetails(hero, heroDiv) {
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("hero-details");
    detailsDiv.innerHTML = `<p>${hero.name}: Power Level ${hero.powerstats.power}</p>`;
    heroDiv.appendChild(detailsDiv);
}

function hideHeroDetails(heroDiv) {
    const detailsDiv = heroDiv.querySelector(".hero-details");
    if (detailsDiv) {
        heroDiv.removeChild(detailsDiv);
    }
}

//Function for selecting which heroes got battle
function selectHero(hero) {
    if (selectedHeroes.length < 2) {
        selectedHeroes.push(hero);
        displaySelectedHeroes();
    } else {
        alert("Two heroes are already selected!");
    }
}

//Function to display chosen fighters in designated area
function displaySelectedHeroes() {
    if (selectedHeroes.length > 0) {
        const hero1 = selectedHeroes[0];
        hero1Div.innerHTML = `<img src="${hero1.images.sm}" alt="${hero1.name}"><p>${hero1.name}</p>`;
    }
    if (selectedHeroes.length > 1) {
        const hero2 = selectedHeroes[1];
        hero2Div.innerHTML = `<img src="${hero2.images.sm}" alt="${hero2.name}"><p>${hero2.name}</p>`;
    }
}

//function to determine winner of fight after button is clicked
function handleFight() {
    if (selectedHeroes.length === 2) {
        const hero1 = selectedHeroes[0];
        const hero2 = selectedHeroes[1];
        //variable for winner defined by power levels
        const winner = hero1.powerstats.power > hero2.powerstats.power ? hero1 : hero2;

        //Shows winner of fight and updates leaderboard
        winnerDiv.innerHTML = `<h2>${winner.name} Wins!</h2>`;
        updateLeaderboard(winner);

        //resets selection process for next battle
        selectedHeroes = [];
        hero1Div.innerHTML = "";
        hero2Div.innerHTML = "";
    } else {
        alert("Select two heroes for battle.");
    }
}

//Update win tallies for leaderboard. stored locally
function updateLeaderboard(winner) {
    winner.wins = (winner.wins || 0) + 1;
    setWinsInStorage(winner.id, winner.wins);
    displayLeaderboard();
}

//Function to display updated leaderboard
function displayLeaderboard() {
    leaderboardDiv.innerHTML = "";
    const sortedHeroes = heroesData.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    sortedHeroes.forEach(hero => {
        if (hero.wins) {
            //adds heros to leaderboard
            const heroDiv = document.createElement("div");
            heroDiv.classList.add("hero");
            heroDiv.innerHTML = `<p>${hero.name}: ${hero.wins} wins</p>`;
            leaderboardDiv.appendChild(heroDiv);
        }
    });
}

//Retreiving win tallies from browser storage
function getWinsFromStorage(heroId) {
    return parseInt(localStorage.getItem(`hero-${heroId}-wins`)) || 0;
}

//Saves the win tallis to browser storage
function setWinsInStorage(heroId, wins) {
    localStorage.setItem(`hero-${heroId}-wins`, wins);
}
