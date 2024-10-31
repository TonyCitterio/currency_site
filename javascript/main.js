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
  { code: "SEK", img: eur },
  { code: "USD", img: usa },
  { code: "GBP", img: uk },
  { code: "DKK", img: den },
  { code: "TRY", img: tur },
  { code: "THB", img: tha },
  { code: "PLN", img: pol },
  { code: "NOK", img: nor },
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
    if (!rates) throw new Error("Faild to fetch rates");
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

  const appendCurrencyRateDiv = (currency, rate, img, containerId) => {
    const container = document.getElementById(containerId);
    const card = document.createElement("div");
    card.classList.add("toSekCard");

    const textElement = document.createElement("p");
    textElement.innerHTML =
      currency === "SEK"
        ? `EUR Valutakurs ${rate.toFixed(3)}`
        : `${currency} Valutakurs ${rate.toFixed(3)}`;

    card.appendChild(img);
    card.appendChild(textElement);
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
  const success = await storeRatesGlobally();
  if (!success) {
    displayFallbackMessage(["usdToSekContent", "eurToSekContent"]);
    return;
  }

  const usdToSek = ratesObject["SEK"] / ratesObject["USD"];
  const numbers = [5, 10, 25, 50, 100];

  const appendPopularCurrencyCards = (fromCurrency, toCurrency, containerId) => {
    numbers.forEach((number) => {
      const container = document.getElementById(containerId);
      const card = document.createElement("div");
      card.classList.add("popularCurrencyToSekCard");
      card.innerHTML = `<p>${number} ${fromCurrency} = ${(
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
  const dropdownItems = Array.from(dropdownMenu.querySelectorAll("li"));
  const inputSek = document.getElementById("sek");
  const inputToCurrency = document.getElementById("toCurrency");
  let selectedCurrency = "EUR";
  let selectedCurrencyName = "Euro";
  let isUpdating = false;
  let isMenuOpen = false;
  let focusedItemIndex = -1;

  //Function to open the dropdown menu
  const openDropdownMenu = () => {
    dropdownMenu.style.display = "block";
    dropdown.setAttribute("aria-expanded", "true");
    isMenuOpen = true;
    document.addEventListener("click", outsideClick);
  };

  //Function to close the dropdown menu
  const closeDropdownMenu = () => {
    dropdownMenu.style.display = "none";
    dropdown.setAttribute("aria-expanded", "false");
    isMenuOpen = false;
    focusedItemIndex = -1;
    document.removeEventListener("click", outsideClick);
  };

  //Function to handle clicks outside the dropdown
  const outsideClick = (e) => {
    if (!dropdown.contains(e.target)) {
      closeDropdownMenu();
    }
  };

  //Function to update the dropdown content when an item is selected
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

  //Function to select a currency item
  const selectCurrency = (item) => {
    const currencyCode = item.getAttribute("data-currencyCode");
    const imgSrc = item.querySelector("img").src;
    const textParts = item.querySelector("p").textContent.split(" - ");
    const countryName = textParts[1].trim();
    const currencyName = textParts[2].trim();

    handleDropdownContent(currencyCode, imgSrc, countryName, currencyName);
    currencyCalculator(selectedCurrency, true, selectedCurrencyName);
    handleCurrencyCodeSmallScreen(selectedCurrency);

    closeDropdownMenu();
    dropdown.focus();
  };

  //Event listener for clicking on the dropdown to toggle menu
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      closeDropdownMenu();
    } else {
      openDropdownMenu();
    }
  });

  //Event listener for keyboard interactions on the dropdown
  dropdown.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isMenuOpen) {
          openDropdownMenu();
        } else {
          closeDropdownMenu();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isMenuOpen) {
          openDropdownMenu();
        }
        focusedItemIndex = 0;
        dropdownItems[focusedItemIndex].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isMenuOpen) {
          openDropdownMenu();
        }
        focusedItemIndex = dropdownItems.length - 1;
        dropdownItems[focusedItemIndex].focus();
        break;
      case "Escape":
        if (isMenuOpen) {
          e.preventDefault();
          closeDropdownMenu();
        }
        break;
    }
  });

  dropdownItems.forEach((item, index) => {
    item.setAttribute("tabindex", "-1");

    //Event listener for clicking on a dropdown item
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selectCurrency(item);
    });

    //Event listener for keyboard interactions on a dropdown item
    item.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          selectCurrency(item);
          break;
        case "ArrowDown":
          e.preventDefault();
          focusedItemIndex = (index + 1) % dropdownItems.length;
          dropdownItems[focusedItemIndex].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          focusedItemIndex =
            (index - 1 + dropdownItems.length) % dropdownItems.length;
          dropdownItems[focusedItemIndex].focus();
          break;
        case "Tab":
          if (isMenuOpen) {
            closeDropdownMenu();
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdownMenu();
          dropdown.focus();
          break;
      }
    });

    //Prevent default behavior for 'keydown' events to avoid conflicts
    item.addEventListener("keyup", (e) => {
      e.stopPropagation();
    });
  });

  //Prevent events from bubbling up from the dropdown menu
  dropdownMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  dropdownMenu.addEventListener("keydown", (e) => {
    e.stopPropagation();
  });

  //Event listeners for input fields
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

  handleDropdownContent("EUR", "./picture/icons8-european-union-circular-flag-48.png", "Euro", "Euro");
  currencyCalculator(selectedCurrency, true, selectedCurrencyName);
  handleCurrencyCodeSmallScreen(selectedCurrency);
});

//Handles the currencyCode on small screens
const handleCurrencyCodeSmallScreen = (currencyCode) => {
  const content = document.querySelector(".smallFromAndTo");
  let displayCurrencyCode = content.querySelector("p");

  if (!displayCurrencyCode) {
    displayCurrencyCode = document.createElement("p");
    content.appendChild(displayCurrencyCode);
  }

  displayCurrencyCode.innerText = `SEK > ${currencyCode}`;
};

//Handles the calculations
const currencyCalculator = async (currencyCode, isSekInput) => {
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
    createAndAppendSumDiv(currencyCode, selectedRate, 0, 0);
  }

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
        createAndAppendSumDiv("EUR", selectedRate, inputSekValue, result);
        break;
      case "USD":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "GBP":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "DKK":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "PLN":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "THB":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "NOK":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
        break;
      case "TRY":
        result = inputSekValue / selectedRate;
        createAndAppendSumDiv(currency, selectedRate, inputSekValue, result);
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
        createAndAppendSumDiv("EUR", selectedRate, result, inputToCurrencyValue);
        break;
      case "USD":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "GBP":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "DKK":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "PLN":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "THB":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "NOK":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
        break;
      case "TRY":
        result = inputToCurrencyValue * selectedRate;
        createAndAppendSumDiv(currency, selectedRate, result, inputToCurrencyValue);
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
const createAndAppendSumDiv = (currencyCode, rate, inputValue, result) => {
  if (inputValue === undefined || inputValue === null) {
    inputValue = 0;
  }

  let sumFrom;
  let sumTo;
  let currencyName;

  if (inputValue % 1 === 0 || inputValue.toFixed(2).endsWith("00")) {
    sumFrom = formatNumberWithSpaces(parseFloat(inputValue.toFixed(0)));
  } else {
    sumFrom = formatNumberWithSpaces(parseFloat(inputValue));
  }

  if (result % 1 === 0 || result.toFixed(2).endsWith("00")) {
    sumTo = formatNumberWithSpaces(parseFloat(result.toFixed(0)));
  } else {
    sumTo = formatNumberWithSpaces(parseFloat(result));
  }

  switch (currencyCode) {
    case "EUR":
      currencyName = "Euro";
      break;
    case "USD":
      if (sumTo != 1) {
        currencyName = "Amerikanska dollar";
      } else {
        currencyName = "Amerikansk dollar";
      }
      break;
    case "GBP":
      if (sumTo != 1) {
        currencyName = "Brittiska pund";
      } else {
        currencyName = "Brittisk pund";
      }
      break;
    case "DKK":
      if (sumTo != 1) {
        currencyName = "Danska kronor";
      } else {
        currencyName = "Dansk krona";
      }
      break;
    case "PLN":
      if (sumTo != 1) {
        currencyName = "Polska zloty";
      } else {
        currencyName = "Polsk zloty";
      }
      break;
    case "THB":
      if (sumTo != 1) {
        currencyName = "Thailänska bath";
      } else {
        currencyName = "Thailänsk bath";
      }
      break;
    case "NOK":
      if (sumTo != 1) {
        currencyName = "Norska kronor";
      } else {
        currencyName = "Norsk krona";
      }
      break;
    case "TRY":
      if (sumTo != 1) {
        currencyName = "Turkiska lire";
      } else {
        currencyName = "Turkisk lira";
      }
      break;
    default:
      console.log("Något gick fel");
  }

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
    sumFrom != 1
      ? `<p>${sumFrom} Svenska kronor</p>`
      : `<p>${sumFrom} Svensk krona</p>`;
  currencyTo.innerHTML = `<p>${sumTo} ${currencyName}</p>`;

  containerCurrencyInfo.appendChild(sumCurrencyCode);
  sumContainerFrom.appendChild(currencyFrom);
  sumContainerTo.appendChild(currencyTo);
};

function formatNumberWithSpaces(number) {
  const largeThreshold = 999999999999;
  const smallThreshold = 1 / largeThreshold;

  if (
    number >= largeThreshold ||
    number <= -largeThreshold ||
    (number !== 0 && (number < smallThreshold || number > largeThreshold))
  ) {
    return number.toExponential(2).replace(".", ",");
  } else {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
      number
    );
  }
}

createAndAppendDivCurrencyRate();
createAndAppendPopularCurrencyCard();
