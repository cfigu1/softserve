const puppeteer = require('puppeteer');
const website = 'https://www.ryanair.com/ie/en/trip/flights/select?ADT=1&TEEN=0&CHD=0&INF=0&DateOut=2020-05-01&DateIn=&Origin=STN&Destination=DUB&isConnectedFlight=false&RoundTrip=false&Discount=0&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=2020-05-01&tpEndDate=&tpOriginIata=STN&tpDestinationIata=DUB&tpIsConnectedFlight=false&tpIsReturn=false&tpDiscount=0';

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ["--ash-host-window-bounds=1920x1080", "--window-size=1920,1048", "--window-position=0,0"] });
  const page = await browser.newPage();
  await page.setViewport({width: 1600, height: 900});
  await page.goto(website);
  await page.waitForSelector('flight-list > div > flight-card');
  const flightCardsHandler = await page.$$('flight-list > div > flight-card');
  const flightCards = flightCardsHandler.map(async (card) => {
    const deparureTime = await card.$eval('div > button > div.card-info > flight-info :nth-child(1) > span.h1', elem => elem.textContent);
    const deparureCity = await card.$eval('div > button > div.card-info > flight-info :nth-child(1) > span.b3', elem => elem.textContent);
    const arrivalTime = await card.$eval('div > button > div.card-info > flight-info :nth-child(3) > span.h1', elem => elem.textContent);
    const arrivalCity = await card.$eval('div > button > div.card-info > flight-info :nth-child(3) > span.b3', elem => elem.textContent);
    const flightNumber = await card.$eval('div > button > div.card-info > div:nth-child(3)', elem => elem.getAttribute('data-ref'));
    const flightPrice = await card.$eval('div > button > div.card-price >  flight-price > div > span.price-value', elem => elem.textContent);

    const flightsData = {
      deparureTime,
      deparureCity,
      arrivalTime,
      arrivalCity,
      flightNumber,
      flightPrice,
    };

    return JSON.stringify(flightsData);
  });

  console.log(await Promise.all(flightCards));
  
})();

