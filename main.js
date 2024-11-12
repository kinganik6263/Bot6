const login = require("fca-priyansh");

const credentials = { appState: require("./appstade.json") }; // আপনার লগইন ডাটা

login(credentials, (err, api) => {
  if (err) {
    console.error("Login failed:", err);
    return;
  }
  console.log("Login successful");
});
