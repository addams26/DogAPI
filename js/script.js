const form = document.querySelector("form");
const results = document.querySelector("#results");
const apiKey = "live_qPDCYXj0PclUpcrhndDznldGzyTG26PqEW2aX6qWC02v21oE7AJ2GkQBG44BbIzn";

form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
	event.preventDefault();
	const data = new FormData(event.target);
	const dataObject = Object.fromEntries(data.entries());

	let breedName = dataObject.userText.trim();
	//.trim() removes extra spaces at the start and end
	let temperament = dataObject.userTemperament;

	getDogs(breedName, temperament);
}

function getDogs(name, temperament)
//This calls the next function and hands it the two values
{
	const url = `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(name)}&api_key=${apiKey}`;

	fetch(url)
		.then((response) => response.json())
		.then((dogData) => {
			let matches = dogData;
			if (temperament !== "select") {
				matches = dogData.filter(
					(dog) =>
						dog.temperament &&
						dog.temperament.toLowerCase().includes(temperament)
				);
			}
			displayData(matches);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function displayData(dogs) {
	results.innerHTML = "";

	if (dogs.length === 0) {
		results.innerHTML = `<div class="result"><h2>No breed found</h2><p>Try a different name or temperament.</p></div>`;
		return;
	}

	dogs.forEach((dog) => {
		let image = dog.image ? dog.image.url : "";

		results.innerHTML +=
		//+= means add this on to what’s already there. Without the +, each dog would replace the last and you’d only see one card which was my error i kept having lol.
		`
			<div class="result">
				<img src="${image}" alt="${dog.name}">
				<h2>${dog.name}</h2>
				<p><strong>Life Span:</strong> ${dog.life_span}</p>
				<p><strong>Temperament:</strong> ${dog.temperament}</p>
			</div>
		`;
	});
}