// SERVER-SIDE price table (Naira). The server never trusts the amount sent by the browser.
// Keep in sync with PRICES in index.html.
module.exports.PRICES = {
  MTN: { "500MB": 140, "1GB": 270, "2GB": 540, "3GB": 810, "5GB": 1350, "10GB": 2700 },
  Airtel: { "500MB": 135, "1GB": 265, "2GB": 530, "3GB": 795, "5GB": 1325, "10GB": 2650 },
  Glo: { "500MB": 130, "1GB": 255, "2GB": 510, "3GB": 765, "5GB": 1275, "10GB": 2550 },
  "9mobile": { "500MB": 125, "1GB": 250, "2GB": 500, "3GB": 750, "5GB": 1250, "10GB": 2500 },
};
