const fetchData = async () => {
  try {
    const response = await fetch(
      "https://cdn.forexvalutaomregner.dk/api/latest.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return Object.entries(data.rates);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const createAndAppendDivCurrencyRate = async () => {
  const rates = await fetchData();
  if (!rates) return;
  const currencyCodes = [ "SEK", "DKK", "EUR", "GBP", "TRY", "PLN", "THB", "NOK", "USD"];

  const filteredRates = rates.filter(([currencyCode, _]) =>
    currencyCodes.includes(currencyCode)
  );
  const sekRate = filteredRates.find(
    ([currencyCode, _]) => currencyCode === "SEK"
  )[1];
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
      currencyCard.innerText = `${currencyCode} to SEK: ${rateToSek.toFixed(
        3
      )}`;
      container.appendChild(currencyCard);
    }
  });
};

const createAndAppendCurrencyConversionCard = async () => {
  const rates = await fetchData();
  if (!rates) {
    displayFallbackMessage();
    return;
  }
  const sek = rates.filter((a) => a[0] === "SEK")[0][1];
  const eur = rates.filter((a) => a[0] === "EUR")[0][1];
  const eurToSek = sek / eur;
  const numbers = [5, 10, 25, 50, 100];
  
  const appendConversionCards = (fromCurrency, toCurrency, containerId) => {
    numbers.forEach((number) => {
      const container = document.getElementById(containerId);
      const card = document.createElement("div");
      card.classList.add("popularCurrencyToSekCard");
      card.innerHTML = `<p>${number} ${fromCurrency} <span></span> = <span></span>${(
        number * toCurrency
        ).toFixed(3)} SEK</p>`;
        container.appendChild(card);
      });
    };

  appendConversionCards("USD", sek, "usdToSekContainer");
  appendConversionCards("EUR", eurToSek, "eurToSekContainer");
};

const displayFallbackMessage = () => {
  const fallbackContainers = ["usdToSekContainer", "eurToSekContainer"];
  fallbackContainers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML =
    "<p class='errorMessage'>Ledsen, valuta kurser är för närvarande inte tillgängliga.</p>";
  });
};

createAndAppendDivCurrencyRate();
createAndAppendCurrencyConversionCard();
