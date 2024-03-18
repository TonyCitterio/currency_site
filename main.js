console.log("hej");

/* fetch('https://cdn.forexvalutaomregner.dk/api/latest.json')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    const ratesArray = Object.entries(data.rates);
    return ratesArray
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

console.log(ratesArray) */

const fetchData = async () => {
  try {
    const response = await fetch(
      "https://cdn.forexvalutaomregner.dk/api/latest.json"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    const ratesArray = Object.entries(data.rates);
    return ratesArray;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const threeDecimal = (num) => {
  return num.toFixed(3)
}

const testDiv = async () => {
  const ratesArray = await fetchData();
  if (!ratesArray) return;
  const sek = ratesArray.filter((a) => a[0] === "SEK");
  document.getElementById("test").innerText = `USD till ${sek[0][0]} ${threeDecimal(sek[0][1])}`
};

testDiv()