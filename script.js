const planetsDiv = document.getElementById('planets');
const searchInput = document.getElementById('search');
let currentDetailsDiv = null;

async function fetchPlanets() {
    try {
        const response = await fetch('https://swapi.dev/api/planets/?format=json');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao obter planetas:', error);
        return [];
    }
}

function displayPlanetDetails(planet) {
    if (currentDetailsDiv) {
        currentDetailsDiv.remove(); // Remove detalhes de planetas que foram detalhados antes, a não ser que = null (inicialização)
    }
    
    const detailsDiv = document.createElement('div');
    detailsDiv.style.padding = '10px';
    detailsDiv.style.border = '1px solid #ccc';
    detailsDiv.style.borderRadius = '5px';
    detailsDiv.innerHTML = `
        <h2><strong>Nome:</strong>${planet.name}</h2>
        <p><strong>Clima:</strong> ${planet.climate}</p>
        <p><strong>População:</strong> ${planet.population}</p>
        <p><strong>Terreno:</strong> ${planet.terrain}</p>
    `;
    
    currentDetailsDiv = detailsDiv;
    return detailsDiv;
}

function displayPlanets(planets) {
    planetsDiv.innerHTML = '';
    planets.forEach(planet => {
        const button = document.createElement('button');
        button.textContent = planet.name;
        button.style.margin = '5px';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = () => {
            const details = displayPlanetDetails(planet);
            planetsDiv.appendChild(details);
        };
        planetsDiv.appendChild(button);
    });
}

async function init() {
    const planets = await fetchPlanets();
    displayPlanets(planets);

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredPlanets = planets.filter(planet => planet.name.toLowerCase().includes(searchText));
        displayPlanets(filteredPlanets);
    });
}

init();
