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

async function fetchResidents(residents) {
    try {
        const promises = residents.map(async residentUrl => {
            const response = await fetch(residentUrl);
            const data = await response.json();
            return { name: data.name, birthYear: data.birth_year };
        });
        return await Promise.all(promises);
    } catch (error) {
        console.error('Erro ao obter residentes:', error);
        return [];
    }
}

function displayPlanetDetails(planet) {
    if (currentDetailsDiv) {
        currentDetailsDiv.remove();
    }
    
    const detailsDiv = document.createElement('div');
    detailsDiv.style.padding = '10px';
    detailsDiv.style.border = '1px solid #ccc';
    detailsDiv.style.borderRadius = '5px';
    detailsDiv.innerHTML = `
        <h2>${planet.name}</h2>
        <p><strong>Clima:</strong> ${planet.climate}</p>
        <p><strong>População:</strong> ${planet.population}</p>
        <p><strong>Terreno:</strong> ${planet.terrain}</p>
    `;

    if (planet.residents.length > 0) {
        const residentsTable = document.createElement('table');
        residentsTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Ano de Nascimento</th>
                </tr>
            </thead>
            <tbody id="residentsTableBody"></tbody>
        `;
        detailsDiv.appendChild(residentsTable);

        const residentsTableBody = residentsTable.querySelector('#residentsTableBody');
        fetchResidents(planet.residents)
            .then(residents => {
                residents.forEach(resident => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${resident.name}</td>
                        <td>${resident.birthYear}</td>
                    `;
                    residentsTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Erro ao exibir residentes:', error);
            });
    } else {
        const noResidentsMessage = document.createElement('p');
        noResidentsMessage.textContent = 'Este planeta não possui habitantes.';
        detailsDiv.appendChild(noResidentsMessage);
    }

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
