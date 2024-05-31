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
  { code: "SEK", img: eur, name: "Euro" },
  { code: "USD", img: usa, name: "Amerikanska dollar" },
  { code: "GBP", img: uk, name: "Pund sterling" },
  { code: "DKK", img: den, name: "Dansk krona" },
  { code: "TRY", img: tur, name: "Turkisk lira" },
  { code: "THB", img: tha, name: "Thailänsk bath" },
  { code: "PLN", img: pol, name: "Polsk zloty" },
  { code: "NOK", img: nor, name: "Norsk krona" },
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
    console.error("There has been a problem with the fetch operation:", error);
  }
};

//Fetch and store rates globally
const storeRatesGlobally = async () => {
  try {
    const rates = await fetchData();
    if(!rates) throw new Error("Faild to fetch rates");
    ratesObject = rates.reduce((acc, [currencyCode, rate]) => {
      acc[currencyCode] = rate;
      return acc;
    }, {});
    return true;
  } catch (error) {
    console.error("There has been a problem with the fetch operation", error);
    return false;
  }
};

//Handles and displays popular rates
const createAndAppendDivCurrencyRate = async () => {
  const success = await storeRatesGlobally();
  if (!success) {
    displayFallbackMessage(["currencyContainer"]);
    return;
  }

  /* const appendCurrencyRateDiv = (currency, rate, img, containerId) => {
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
  }); */
  const appendCurrencyRateDiv = (currency, rate, img, name, containerId) => {
  const container = document.getElementById(containerId);
  const card = document.createElement("div");
  card.classList.add("toSekCard");

  // Create a paragraph element for the text
  const textElement1 = document.createElement("p");
  textElement1.innerHTML = currency === "SEK"
    ? `EUR valutakurs ${rate.toFixed(3)}`
    : `${currency} valutakurs ${rate.toFixed(3)}`;

    const textElement2 = document.createElement("p");
  textElement2.innerHTML = currency === "SEK"
    ? ` Bla bla bla`
    : `Bla bla bla`;

  // Append the img element first
  card.appendChild(img);
  // Then append the text element
  card.appendChild(textElement1);

  

  // Finally, append the card to the container
  container.appendChild(card);
};

currencies.forEach(({ code, img, name }) => {
  const rate =
    code === "SEK"
      ? ratesObject["SEK"]
      : ratesObject["SEK"] / ratesObject[code];
  appendCurrencyRateDiv(code, rate, img, name, "currencyContainer");
});

};

//handle and display currency tables
const createAndAppendPopularCurrencyCard = async () => {
  const success = await storeRatesGlobally();
  if (!success) {
    displayFallbackMessage(["usdToSekContent","eurToSekContent" ]);
    return;
  }
 
  const usdToSek = ratesObject["SEK"] / ratesObject["USD"];
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
  appendPopularCurrencyCards("EUR", ratesObject["SEK"], "eurToSekContent");
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

//Format the inputs, fucus the parent div when the input is in focus.
document.addEventListener("DOMContentLoaded", () => {
  let inputs = document.querySelectorAll(
    ".inputNumberTo input, .inputNumberFrom input"
  );

  inputs.forEach(function (input) {
    input.setAttribute("autocomplete", "off");

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

    input.addEventListener("input", function () {
      let value = this.value;

      value = value.replace(/\./g, ",").replace(/[^0-9,]/g, "");

      let parts = value.split(",");
      if (parts.length > 1) {
        value = parts[0] + "," + parts[1].substring(0, 2);
      }

      value = value.replace(/,(?=\d*,)/g, "");

      this.value = value;
    });
  });
});

//Checking if the focused class is active.
const checkIfInputFromIsFocused = () => {
  let elements = document.querySelectorAll(".inputContentFrom");
  for (let element of elements) {
    if (element.classList.contains("focused")) {
      return true;
    }
  }
  return false;
};

const checkIfInputToIsFocused = () => {
  let elements = document.querySelectorAll(".inputContentTo");
  for (let element of elements) {
    if (element.classList.contains("focused")) {
      return true;
    }
  }
  return false;
};

//Handles and displaying the dropdown and "currency's" in the "to" div. And sending the chosen currency to the calculator
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = dropdown.querySelector(".dropdownMenu");
  const dropdownContent = dropdown.querySelector(".dropdownContent");
  const dropdownItems = dropdownMenu.querySelectorAll("li");
  const inputSek = document.getElementById("sek");
  const inputToCurrency = document.getElementById("toCurrency");
  let selectedCurrency = "SEK";
  let selectedCurrencyName = "Euro";
  let isUpdating = false;

  const toggleDropdownMenu = (e) => {
    if (
      dropdownMenu.style.display === "none" ||
      dropdownMenu.style.display === ""
    ) {
      dropdownMenu.style.display = "block";
      document.addEventListener("click", outsideClick);
    } else {
      dropdownMenu.style.display = "none";
      document.removeEventListener("click", outsideClick);
    }
    e.stopPropagation();
  };

  const outsideClick = (e) => {
    if (!dropdown.contains(e.target)) {
      dropdownMenu.style.display = "none";
      document.removeEventListener("click", outsideClick);
    }
  };

  const handleDropdownContent = (currencyCode, imgSrc, countryName, currencyName) => {
    const flag = dropdownContent.querySelector("img");
    const country = dropdownContent.querySelector(".dropdownCountry");
    const currencyTitle = dropdownContent.querySelector(
      ".dropdownCurrencyName"
    );

    flag.src = imgSrc;
    flag.alt = `${countryName} flagga`;

    if (currencyCode === "EUR") {
      country.textContent = currencyCode;
      currencyTitle.textContent = countryName;
    } else {
      country.textContent = countryName;
      currencyTitle.textContent = `${currencyName} (${currencyCode})`;
    }
    selectedCurrency = currencyCode;
    selectedCurrencyName = currencyName;

    inputSek.value = "";
    inputToCurrency.value = "";
  };

  const handleEventListeners = () => {
    dropdown.addEventListener("click", toggleDropdownMenu);

    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", function () {
        const currencyCode = this.getAttribute("data-currencyCode");
        const imgSrc = this.querySelector("img").src;
        const textParts = this.querySelector("p").textContent.split(" - ");
        const countryName = textParts[1].trim();
        const currencyName = textParts[2].trim();

        handleDropdownContent(currencyCode, imgSrc, countryName, currencyName);
        currencyCalculator(selectedCurrency, true, selectedCurrencyName);
        dropdownMenu.style.display = "none";
        document.removeEventListener("click", outsideClick);
      });
    });

    inputSek.addEventListener("input", () => {
      if (!isUpdating) {
        currencyCalculator(selectedCurrency, true, selectedCurrencyName);
      }
    });
    inputToCurrency.addEventListener("input", () => {
      if (!isUpdating) {
        currencyCalculator(selectedCurrency, false, selectedCurrencyName);
      }
    });
  };

  handleDropdownContent("EUR", "./picture/icons8-european-union-circular-flag-48.png", "Euro", "Euro");
  currencyCalculator(selectedCurrency, true, selectedCurrencyName);
  handleEventListeners();
});

//Handles the calculations
const currencyCalculator = async (currencyCode, isSekInput, currencyName) => {
  const success = await storeRatesGlobally();
  if (!success) {
    displayFallbackMessage(["sumContainer"]);
    return;
  }

  console.log(ratesObject["SEK"]);

  const inputSek = document.getElementById("sek");
  const inputToCurrency = document.getElementById("toCurrency");

  let currency;
  let result;
  let selectedRate;

  if (currencyCode === "EUR") {
    currency = "SEK";
  } else {
    currency = currencyCode;
  }

  switch (currency) {
    case "SEK":
      selectedRate = ratesObject["SEK"];
      break;
    case "USD":
      selectedRate = ratesObject["SEK"] / ratesObject["USD"];
      break;
    case "GBP":
      selectedRate = ratesObject["SEK"] / ratesObject["GBP"];
      break;
    case "DKK":
      selectedRate = ratesObject["SEK"] / ratesObject["DKK"];
      break;
    case "PLN":
      selectedRate = ratesObject["SEK"] / ratesObject["PLN"];
      break;
    case "THB":
      selectedRate = ratesObject["SEK"] / ratesObject["THB"];
      break;
    case "NOK":
      selectedRate = ratesObject["SEK"] / ratesObject["NOK"];
      break;
    case "TRY":
      selectedRate = ratesObject["SEK"] / ratesObject["TRY"];
  }

  if (inputSek.value.length < 1 || inputToCurrency.value.length < 1) {
    createAndAppendSumDiv(currencyCode, selectedRate, 0, 0, currencyName);
  }

  console.log(`bulle lull ${selectedRate}`);

  console.log(`Detta är test: ${currency}`);

  isUpdating = true;

  if (checkIfInputFromIsFocused()) {
    if (inputSek.value.length === 0) {
      inputToCurrency.value = "";
    }
  }

  if (checkIfInputToIsFocused()) {
    if (inputToCurrency.value.length === 0) {
      inputSek.value = "";
    }
  }

  if (isSekInput) {
    const inputSekValue = parseFloat(inputSek.value.replace(/,/g, "."));
    if (isNaN(inputSekValue)) {
      isUpdating = false;
      return;
    }

    switch (currency) {
      case "SEK":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv("EUR", selectedRate, inputSekValue, result, "Euro");
        break;
      case "USD":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "GBP":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "DKK":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "PLN":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "THB":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "NOK":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      case "TRY":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result, currencyName);
        break;
      default:
        console.log("Något gick fel");
    }
    if (!isNaN(result)) {
      inputToCurrency.value = result.toFixed(2);
    }
  } else {
    const inputToCurrencyValue = parseFloat(
      inputToCurrency.value.replace(/,/g, ".")
    );
    if (isNaN(inputToCurrencyValue)) {
      isUpdating = false;
      return;
    }

    switch (currency) {
      case "SEK":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv("EUR", selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "USD":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "GBP":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "DKK":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "PLN":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "THB":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "NOK":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      case "TRY":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue, currencyName);
        break;
      default:
        console.log("Något gick fel");
    }
    if (!isNaN(result)) {
      inputSek.value = result.toFixed(2);
    }
  }
  isUpdating = false;

  console.log(`Result: ${result}`);
};

//Creates and handles the summery content
const createAndAppendSumDiv = (currencyCode, rate, inputValue, result, currencyName) => {
  if (inputValue === undefined || inputValue === null) {
    inputValue = 0;
  }

  console.log(`Detta är inputValue: ${inputValue}`);

  const containerCurrencyInfo = document.querySelector(".currencyInfo");
  const sumContainerFrom = document.querySelector(".sumContainerFrom");
  const sumContainerTo = document.querySelector(".sumContainerTo");

  containerCurrencyInfo.innerHTML = "";
  sumContainerFrom.innerHTML = "";
  sumContainerTo.innerHTML = "";

  const sumCurrencyCode = document.createElement("p");
  const currencyFrom = document.createElement("p");
  const currencyTo = document.createElement("p");

  sumCurrencyCode.innerText = `Valutakurs 1 ${currencyCode} = ${rate.toFixed(
    3
  )} SEK`;
  currencyFrom.innerHTML =
    inputValue % 1 === 0
      ? `<p>${inputValue.toFixed(0)} SEK</p>`
      : `<p>${inputValue.toFixed(2)} SEK</p>`;
  currencyTo.innerHTML =
    result % 1 === 0
      ? `<p>${currencyName}</p> <p>${result.toFixed(0)}</p>`
      : `<p>${currencyName}</p> <p>${result.toFixed(2)}</p>`;

  containerCurrencyInfo.appendChild(sumCurrencyCode);
  sumContainerFrom.appendChild(currencyFrom);
  sumContainerTo.appendChild(currencyTo);
};

createAndAppendDivCurrencyRate();
createAndAppendPopularCurrencyCard();
