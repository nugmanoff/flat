const request = require("request");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
app.set("port", 3000);

const COMPANIES_URL = "https://krisha.kz/pro/company/?page=";
const AGENTS_URL = "https://krisha.kz/pro/specialist/?page=";

var companies = {};
var agents = {};

const fetchCompany = async page => {
  request(`${COMPANIES_URL}${page}`, async (error, response, html) => {
    if (error) return;
    const $ = cheerio.load(html, { decodeEntities: false });
    const body = $(".company-card__list").html();

    const NAMES = /<div class="company-card__name">(.*?)<\/div>/gms;
    const ADS = /<div class="company-card__adverts-first"><b>(?<count>.*?)<\/b>.*?<\/div>/gms;
    const AGENTS = /<div class="company-card__adverts-second"><b>(?<count>.*?)<\/b>.*?<\/div>/gms;
    const COUNT = /<b>(?<number>.*?)<\/b>/;

    body
      .match(NAMES)
      .forEach(
        (e, i) => (companies[i * page] = { name: cheerio.load(e).text() })
      );
    body
      .match(ADS)
      .forEach(
        (e, i) => (companies[i * page].ads = e.match(COUNT).groups.number)
      );
    body
      .match(AGENTS)
      .forEach(
        (e, i) => (companies[i * page].agents = e.match(COUNT).groups.number)
      );
  });
};

const fetchAgent = async page => {
  request(`${AGENTS_URL}${page}`, async (error, response, html) => {
    if (error) return;
    const $ = cheerio.load(html, { decodeEntities: false });
    const body = $(".pro-list").html();

    const NAMES = /<div class="specialist-card__name">(.*?)<\/div>/gms;
    const ADS = /<div class="specialist-card__adverts-first"><b>(?<count>.*?)<\/b>.*?<\/div>/gms;
    const ADDRESS = /<div class="specialist-card__city">(.*?)<\/div>/gms;
    const COUNT = /<b>(?<number>.*?)<\/b>/;

    body
      .match(NAMES)
      .forEach((e, i) => (agents[i * page] = { name: cheerio.load(e).text() }));
    body
      .match(ADDRESS)
      .forEach((e, i) => (agents[i * page].address = cheerio.load(e).text()));
    body
      .match(ADS)
      .forEach((e, i) => (agents[i * page].ads = e.match(COUNT).groups.number));
  });
};

app.get("/", (req, res) => {
  console.log("Hello Nazerke teacher!\nThis is my submission of bonus task, I have scraped krisha.kz website using RegExps.\nI have uploaded my code to GitHub repository and made it public :)");
});

app.get("/companies", async (req, res) => {
  for (var i = 1; i <= 5; i++) {
    await fetchCompany(i);
  }
  console.log({ companies });
});

app.get("/agents", async (req, res) => {
  for (var i = 1; i <= 5; i++) {
    await fetchAgent(i);
  }
  console.log({ agents });
});

app.listen(app.get("port"), () => {
  console.log("Magic is happening on port: ", app.get("port"));
});
