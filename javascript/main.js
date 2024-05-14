const usa = new Image();
usa.src = "../picture/icons8-usa-48.png";
usa.alt = "USA Flag";
const den = new Image();
den.src = "../picture/icons8-denmark-48.png";
den.alt = "Denmark Flag";
const eur = new Image();
eur.src = "../picture/icons8-european-union-circular-flag-48.png";
eur.alt = "European Union Flag";
const uk = new Image();
uk.src = "../picture/icons8-great-britain-48.png";
uk.alt = "Great Britain Flag";
const pol = new Image();
pol.src = "../picture/icons8-poland-48.png";
pol.alt = "Poland Flag";
const tha = new Image();
tha.src = "../picture/icons8-thailand-48.png";
tha.alt = "Thailand Flag";
const nor = new Image();
nor.src = "../picture/icons8-norway-48.png";
nor.alt = "Norway Flag";
const tur = new Image();
tur.src = "../picture/icons8-turkey-48.png";
tur.alt = "Turkey Flag";

const currencies = [
  { code: "USD", img: usa },
  { code: "DKK", img: den },
  { code: "SEK", img: eur },
  { code: "GBP", img: uk },
  { code: "PLN", img: pol },
  { code: "THB", img: tha },
  { code: "NOK", img: nor },
  { code: "TRY", img: tur },
];

const fetchData = async () => {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?to=USD,SEK,DKK,GBP,NOK,PLN,THB,TRY,EUR"
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

//Handles and displays popular rates
const createAndAppendDivCurrencyRate = async () => {
  const rates = await fetchData();
  if (!rates) {
    displayFallbackMessage(["currencyContainer"]);
    return;
  }

  const ratesObject = rates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});

  const appendCurrencyRateDiv = (currency, rate, img, containerId) => {
    const container = document.getElementById(containerId);
    const card = document.createElement("div");
    card.classList.add("toSekCard");
    card.innerHTML =
      currency === "SEK"
        ? `<p>EUR till SEK ${rate.toFixed(3)}</p>`
        : `<p>${currency} till SEK ${rate.toFixed(3)}</p>`;
    card.appendChild(img);
    container.appendChild(card);
  };

  currencies.forEach(({ code, img }) => {
    const rate =
      code === "SEK"
        ? ratesObject["SEK"]
        : ratesObject["SEK"] / ratesObject[code];
    appendCurrencyRateDiv(code, rate, img, "currencyContainer");
  });
};

//handle and display currency tables
const createAndAppendPopularCurrencyCard = async () => {
  const rates = await fetchData();

  if (!rates) {
    displayFallbackMessage(["usdToSekContent", "eurToSekContent"]);
    return;
  }
  const usd = rates.filter((a) => a[0] === "USD")[0][1];
  const sek = rates.filter((a) => a[0] === "SEK")[0][1];
  const usdToSek = sek / usd;
  const numbers = [5, 10, 25, 50, 100];

  const appendPopularCurrencyCards = (
    fromCurrency,
    toCurrency,
    containerId
  ) => {
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

  appendPopularCurrencyCards("USD", usdToSek, "usdToSekContent");
  appendPopularCurrencyCards("EUR", sek, "eurToSekContent");
};

//Handles and display error if the fetch didn't go through
const displayFallbackMessage = (containerIds) => {
  containerIds.forEach((containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML =
        "<p class='errorMessage'>Ledsen, valuta kurser är för närvarande inte tillgängliga.</p>";
    }
  });
};

//Fucus the parent div when the input is in focus
document.addEventListener("DOMContentLoaded", function () {
  let inputs = document.querySelectorAll(
    ".inputNumberTo input, .inputNumberFrom input"
  );

  inputs.forEach(function (input) {
    input.addEventListener("focus", function () {
      this.closest(".inputContentTo, .inputContentFrom").classList.add(
        "focused"
      );
    });

    input.addEventListener("blur", function () {
      this.closest(".inputContentTo, .inputContentFrom").classList.remove(
        "focused"
      );
    });
  });
});

const currencyCalculator = async () => {
  const rates = await fetchData();
  if (!rates) {
    displayFallbackMessage(["currencyContainer"]);
    return;
  }

  const ratesObject = rates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});

  const sek = document.getElementById("sek").value;
  const toCurrency = document.getElementById("toCurrency").value;
  let sekToEur = sek / ratesObject["SEK"]

  console.log(sek)
  console.log(toCurrency)
  console.log(sekToEur)
};

document.getElementById("sek").addEventListener("keyup", currencyCalculator);
document.getElementById("toCurrency").addEventListener("keyup", currencyCalculator);
/* const inputSek = document.getElementById("sek");
const toCurrency = document.getElementById("toCurrency"); */

/* document.getElementById("sek").addEventListener("input", async (event) => {
  const rates = await fetchData();
  inputSek = parseInt(event.target.value);

  const ratesObject = rates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});

  let result = inputSek / ratesObject["SEK"]
  console.log(result)
  
}); */

/* document.getElementById("toCurrency").addEventListener("input", (event) => {
  toCurrency = parseInt(event.target.value);

  currencyCalculator(inputSek, toCurrency);
}); */

/* const currencyCalculator = async (sek, toCurrency) => {
  const rates = await fetchData();

  const ratesObject = rates.reduce((acc, [currencyCode, rate]) => {
    acc[currencyCode] = rate;
    return acc;
  }, {});
  console.log(ratesObject["SEK"])
  let result = ratesObject["SEK"] * toCurrency;
  sek = result
}; */

/* inputSek.addEventListener("keyup", function(event) {
  const sek = parseInt(event.target.value);

  currencyCalculator(sek, toCurrency)
});

toCurrency.addEventListener("keyup", function(event) {
 const toCurrency = parseInt(event.target.value);

 currencyCalculator(sek, toCurrency)
}) */

createAndAppendDivCurrencyRate();
createAndAppendPopularCurrencyCard();
