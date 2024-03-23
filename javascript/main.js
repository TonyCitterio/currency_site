const fetchData = async () => {
  try {
    const response = await fetch("https://cdn.forexvalutaomregner.dk/api/latest.json");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return Object.entries(data.rates);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const createAndAppendDiv = async () => {
  const rates = await fetchData();
  if (!rates) return;

  const currencyCodes = ["SEK", "DKK", "EUR", "GBP", "TRY", "PLN", "THB", "NOK", "USD"];
  const filteredRates = rates.filter(([currencyCode, _]) => currencyCodes.includes(currencyCode));
  const sekRate = filteredRates.find(([currencyCode, _]) => currencyCode === "SEK")[1];
  const container = document.getElementById("currencyContainer");

  /* const ratesObject = filteredRates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});

  const sek = ratesObject["SEK"]; */

  filteredRates.forEach(([currencyCode, rate]) => {
    if (currencyCode !== "SEK") {
      const rateToSek = sekRate / rate;
      const currencyCard = document.createElement("div");
      currencyCard.classList.add("toSekCard");
      currencyCard.innerText = `${currencyCode} to SEK: ${rateToSek.toFixed(3)}`;
      container.appendChild(currencyCard);
    }
  });
};

createAndAppendDiv();
