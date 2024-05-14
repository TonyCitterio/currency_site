// const currencyCodes = [ "SEK", "DKK", "EUR", "GBP", "TRY", "PLN", "THB", "NOK", "USD"];

/* const fetchData = async () => {
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
}; */

//Handles and displays popular rates
/* const createAndAppendDivCurrencyRate = async () => {
  const rates = await fetchData();
  if (!rates) {
    displayFallbackMessage(['currencyContainer']);
    return;
  }

  const filteredRates = rates.filter(([currencyCode, _]) =>
    currencyCodes.includes(currencyCode)
  );

  const ratesObject = filteredRates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});

  const appendCurrencyRateDiv = (currency, rate, img, containerId) => {
    const container = document.getElementById(containerId);
    const card = document.createElement("div");
    card.classList.add("toSekCard");
    card.innerHTML = `<p>${currency} till SEK ${rate.toFixed(3)}</p>`;
    card.appendChild(img);
    container.appendChild(card);
  };
  
  currencies.forEach(({ code, img }) => {
    const rate = ratesObject["SEK"] / ratesObject[code];
    appendCurrencyRateDiv(code, rate, img, "currencyContainer");
  });
}; */

//handle and display currency tables
/* const createAndAppendPopularCurrencyCard = async () => {
  const rates = await fetchData();
  if (!rates) {
    displayFallbackMessage(['usdToSekContent', 'eurToSekContent']);
    return;
  }
  const sek = rates.filter((a) => a[0] === "SEK")[0][1];
  const eur = rates.filter((a) => a[0] === "EUR")[0][1];
  const eurToSek = sek / eur;
  const numbers = [5, 10, 25, 50, 100];
  
  const appendPopularCurrencyCards = (fromCurrency, toCurrency, containerId) => {
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

  appendPopularCurrencyCards("USD", sek, "usdToSekContent");
  appendPopularCurrencyCards("EUR", eurToSek, "eurToSekContent");
};

const currencyCalculator = async () => {
  
} */

/* createAndAppendDivCurrencyRate();
createAndAppendPopularCurrencyCard(); */

/* const loadImages = () => ({
  "USD": {src: "../picture/icons8-usa-48.png", alt: "USAs Flagga"},
  "DKK": {src: "../picture/icons8-denmark-48.png", alt: "Danmarks Flagga"},
  "EUR": {src: "../picture/icons8-european-union-circular-flag-48.png", alt: "EUs Flagga"},
  "GBP": {src: "../picture/icons8-great-britain-48.png", alt: "Storbritanniens Flagga"},
  "PLN": {src: "../picture/icons8-poland-48.png", alt: "Polens Flagga"},
  "THB": {src: "../picture/icons8-thailand-48.png", alt: "Thailands Flagga"},
  "NOK": {src: "../picture/icons8-norway-48.png", alt: "Norges Flagga"},
  "TRY": {src: "../picture/icons8-turkey-48.png", alt: "Turkiets Flagga"},
}); */