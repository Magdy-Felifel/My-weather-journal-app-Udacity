/* Global Variables */
const key = "f3d506a9aa819d8281f5a900af93884b&units=metric";
const url = "https://api.openweathermap.org/data/2.5/weather?zip=";
const zipElement = document.getElementById("zip");
const feelingsElement = document.getElementById("feelings");
const generateButton = document.getElementById("generate");
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

//Create event listener method to listen when clicking generate button after making sure to write in the fields.
generateButton.addEventListener("click", function () {
  if (zipElement.value.trim() === "" || feelingsElement.value.trim() === "") {
    alert("required fields");
    return;
  }
  //Declare function to getting the temp with API.
  getWeatherTemp(url, zipElement.value, key)
    .then((data) =>
      // Declare function to sending the data i get to the server side.
      sendDataToServer({
        date: newDate,
        temp: data.main.temp,
        feelings: feelingsElement.value,
      })
    )
    // Declare function to update UI
    .then(() => retrieveData());
});
// Create asynchronous function to fetch the weather temp from URL with zipcode and API key.
async function getWeatherTemp(baseUrl, zipCode, apiKey) {
  const fetchingData = await fetch(baseUrl + zipCode + "&appid=" + apiKey);
  try {
    const res = await fetchingData.json();
    return res;
  } catch (err) {
    console.log("err", err);
  }
}
// Create asynchronous function to send the data to the server side after transform into JSON.
async function sendDataToServer(data = {}) {
  const postData = await fetch("/addData", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const res = await postData.json();
    return res;
  } catch (err) {
    console.log("err", err);
  }
}
// Create asynchronous function to update the UI with the data i have get from API.
const retrieveData = async () => {
  const request = await fetch("/getData");
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    document.getElementById("date").innerHTML = "Today : " + allData.date;
    document.getElementById("temp").innerHTML =
      "Temperature : " + Math.round(allData.temp) + "° C";
    document.getElementById("content").innerHTML =
      "You feel " + allData.feelings + "!!!";
  } catch (err) {
    console.log("err", err);
  }
};
