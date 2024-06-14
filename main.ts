import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";

puppeteer.use(StealthPlugin());
let pp: any = [];
const openmediem = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  const newa = await page.goto("https://medium.com/search?q=react+js", {
    waitUntil: "networkidle0",
  });
  const search =
    "/html/body/div[1]/div/div[3]/div[1]/div[2]/div[1]/div/div/input";
  page.on("response", async (res) => {
    const reslut = res.url().includes("https://medium.com/_/graphql");
    if (reslut) {
      const json = await res.json();
      if (json[0]?.data?.search?.posts?.items?.length > 0) {
        pp.push(json);
      }
    }
  });
  const html = await page.evaluate(() => {
    const element =
      document.querySelectorAll<HTMLInputElement>("[role=combobox]");

    if (element.length > 0) {
      const input = element[0];
      input.value = "svg in angular js\n";
      var event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);
      const event1 = new KeyboardEvent("keydown", {
        key: "Enter",
        keyCode: 13,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event1);
    }

    // const saveelement = await page.$eval(
    //   "input[role='combobox']",
    //   (el) => el.innerHTML,
    // );

    console.log("Save element:", element);
  }, page);
  await delay(6000);
  browser.close();
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

openmediem().then(() => {
  newfun();
});
const newfun = () => {
  console.log("Save element:", pp);
  console.log(pp[0][0]?.data?.search?.posts?.items);
  console.log("Save element:", pp[1][0]?.data?.search?.posts?.items);
  console.log("Save element:", pp[0][0]?.data?.search?.posts?.items.length);
  console.log("Save element:", pp[1][0]?.data?.search?.posts?.items.length);
  console.log("Save element:", JSON.stringify(pp[2]));
};
