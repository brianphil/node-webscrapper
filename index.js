const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Puppeteer script to scrape main index data
async function scrapeMainIndex(url, indexName) {
  const browser = await puppeteer.launch(); // Set timeout to 60 seconds
  const page = await browser.newPage(); // Set timeout to 60 seconds

  await page.goto(url, { timeout: 60000 });

  // Wait for the data to be dynamically loaded into the page
  await page.waitForSelector(".current-price.pricing");

  const data = await page.evaluate(() => {
    const mainIndex = {};
    mainIndex.currentPrice = document.querySelector(".current-price.pricing").textContent.trim();
    mainIndex.change = document.querySelector(".profit-lose.price-stats").textContent.trim();
    return mainIndex;
  });

  await browser.close();

  return { indexName, ...data };
}

// Puppeteer script to scrape main indices data
async function scrapeMainIndices(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Wait for the data to be dynamically loaded into the page
  await page.waitForSelector(".stock-filter-data.post");

  // Wait for the dynamically loaded values to be updated
  await page.waitForFunction(() => {
    const lastPrice = document.querySelector(".price").textContent.trim();
    const change = document.querySelector(".percentage").textContent.trim();
    const openPrice = document.querySelector(".data-col-3").textContent.trim();
    const closePrice = document.querySelector(".data-col-4").textContent.trim();

    return lastPrice !== "₹0" && change !== "0" && openPrice !== "₹0" && closePrice !== "₹0";
  });

  const data = await page.evaluate(() => {
    const companies = [];
    document.querySelectorAll(".stock-filter-data.post").forEach((element) => {
      const name = element.querySelector(".company-name span").textContent.trim();
      const lastPrice = element.querySelector(".price").textContent.trim();
      const change = element.querySelector(".percentage").textContent.trim();
      const openPrice = element.querySelector(".data-col-3").textContent.trim();
      const closePrice = element.querySelector(".data-col-4").textContent.trim();

      companies.push({ name, lastPrice, change, openPrice, closePrice });
    });
    return companies;
  });

  await browser.close();

  return data;
}

// Define routes
app.get("/sensex", async (req, res) => {
  const mainIndexUrl = "https://upstox.com/indices/sensex-share-price/#companies_list";
  const listedCompaniesUrl = "https://upstox.com/indices/sensex-share-price/#companies_list";
  try {
    const mainIndexData = await scrapeMainIndex(mainIndexUrl, "Sensex");
    const listedCompaniesData = await scrapeMainIndices(listedCompaniesUrl);
    res.json({ mainIndex: mainIndexData, listedCompanies: listedCompaniesData });
  } catch (error) {
    if (error.message.includes("timeout")) {
      console.error("Navigation Timeout Error:", error);
      res.status(500).json({ error: "Navigation timeout exceeded. Please try again later." });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  }
});

// Route for Bank Nifty
app.get("/bank-nifty", async (req, res) => {
  const mainIndexUrl = "https://upstox.com/indices/nifty-bank-share-price/#companies_list";
  const listedCompaniesUrl = "https://upstox.com/indices/nifty-bank-share-price/#companies_list";
  try {
    const mainIndexData = await scrapeMainIndex(mainIndexUrl, "Bank Nifty");
    const listedCompaniesData = await scrapeMainIndices(listedCompaniesUrl);
    res.json({ mainIndex: mainIndexData, listedCompanies: listedCompaniesData });
  } catch (error) {
    if (error.message.includes("timeout")) {
      console.error("Navigation Timeout Error:", error);
      res.status(500).json({ error: "Navigation timeout exceeded. Please try again later." });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  }
});

// Route for Nifty 50
app.get("/nifty-50", async (req, res) => {
  const mainIndexUrl = "https://upstox.com/indices/nifty-50-share-price/#companies_list";
  const listedCompaniesUrl = "https://upstox.com/indices/nifty-50-share-price/#companies_list";
  try {
    const mainIndexData = await scrapeMainIndex(mainIndexUrl, "Nifty 50");
    const listedCompaniesData = await scrapeMainIndices(listedCompaniesUrl);
    res.json({ mainIndex: mainIndexData, listedCompanies: listedCompaniesData });
  } catch (error) {
    if (error.message.includes("timeout")) {
      console.error("Navigation Timeout Error:", error);
      res.status(500).json({ error: "Navigation timeout exceeded. Please try again later." });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  }
});

// Route for Fin Nifty
app.get("/fin-nifty", async (req, res) => {
  const mainIndexUrl = "https://upstox.com/indices/nifty-fin-service-share-price/#companies_list";
  const listedCompaniesUrl =
    "https://upstox.com/indices/nifty-fin-service-share-price/#companies_list";
  try {
    const mainIndexData = await scrapeMainIndex(mainIndexUrl, "Fin Nifty");
    const listedCompaniesData = await scrapeMainIndices(listedCompaniesUrl);
    res.json({ mainIndex: mainIndexData, listedCompanies: listedCompaniesData });
  } catch (error) {
    if (error.message.includes("timeout")) {
      console.error("Navigation Timeout Error:", error);
      res.status(500).json({ error: "Navigation timeout exceeded. Please try again later." });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
