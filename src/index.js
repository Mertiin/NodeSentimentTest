const sentiment = require("sentiment-swedish");
const fs = require("fs");
const readline = require("readline");

const inputFolder = "./input/";
const outputFolder = "./output/";

async function processLineByLine(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let totalScore = 0;
  for await (const line of rl) {
    const sent = sentiment(line);
    totalScore += sent.score;
  }

  return totalScore;
}

fs.readdir(inputFolder, async (err, files) => {
  const scores = [];
  for (const file of files) {
    const score = await processLineByLine(`${inputFolder}${file}`);
    scores.push({
      fileName: file,
      score: score
    });
  }

  console.log(scores);

  fs.writeFile(`${outputFolder}scores.json`, JSON.stringify(scores), () => {});
});
