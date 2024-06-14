import { Cluster } from "puppeteer-cluster";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";
import * as fs from "node:fs";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

puppeteer.use(StealthPlugin());

async () => {
  const start = Date.now();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the page
  await page.goto("https://search.arin.net/rdap/?query=4.205.244.6");

  // Wait for the response you're interested in
  const response = await page.waitForResponse((response) =>
    response.url().includes("https://rdap.arin.net/registry/ip"),
  );
  const responseBody = await response.text();
  const josn = await JSON.parse(responseBody);
  console.log("Response body:", responseBody);
  console.log("Response body:", josn);
  const duritaion = Date.now() - start;

  console.log("Duration body:", duritaion);
  await browser.close();
  const jsonData = JSON.stringify(josn);
  fs.writeFile("data.json", jsonData, "utf8", (err) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
      return;
    }
    console.log("JSON data has been written to data.json");
  });
};
const s3 = new AWS.S3();
const uppload = () => {
  console.log("Uploading");
  const params = {
    Bucket: "bhargavahome",
    Key: "data1.json",
    Body: fs.createReadStream(__dirname + "/data.json"),
  };
  const getparem = {
    Bucket: "bhargavahome",
    Key: "data1.json",
  };

  s3.getObject(getparem, (err: any, data: any) => {
    if (err) {
      console.log("Error uploading file:", err);
    } else {
      console.log("File ggd successfully. File location:", data);
    }
  });
  // s3.upload(params, (err: any, data: any) => {
  //   if (err) {
  //     console.log("Error uploading file:", err);
  //   } else {
  //     console.log("File uploaded successfully. File location:", data);
  //   }
  // });
};
uppload();
