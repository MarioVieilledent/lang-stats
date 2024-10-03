const filename = "./languages/German.txt";

const fs = require("fs");
const path = require("path");

function readTxtFiles(directory) {
  const fileContents = [];

  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);

    if (path.extname(file) === ".txt") {
      const content = fs.readFileSync(filePath, "utf8");
      fileContents.push({ name: file, content });
    }
  });

  return fileContents;
}

const allLanguages = readTxtFiles("languages");

const variousLengths = (stats, startingLetter) => {
  for (let i = 2; i < 8; i++) {
    console.log(
      createMostObviousWordOfSizeStartingWith(stats, i, startingLetter)
    );
  }
};

const createMostObviousWordOfSize = (stats, n) => {
  let word = "";

  const firstLetter = mostCommonLetterAfter(stats, "^");
  word += firstLetter;

  for (let i = 0; i < n; i++) {
    const nextLetter = mostCommonLetterAfter(stats, word[i]);
    word += nextLetter;
  }

  return word;
};

const createWord = (stats, size) => {
  let word = "";

  let previousLetter = "^";

  for (let i = 0; i < size; i++) {
    const nextLetter = pickLetterAfter(stats, previousLetter);
    if (nextLetter === "$") {
      return word;
    }
    word += nextLetter;
    previousLetter = nextLetter;
  }

  return word;
};

const createMostObviousWordOfSizeStartingWith = (stats, n, startingLetter) => {
  let word = "";

  word += startingLetter;

  for (let i = 0; i < n; i++) {
    const nextLetter = mostCommonLetterAfter(stats, word[i]);
    word += nextLetter;
  }

  return word;
};

const mostCommonLetterAfter = (stats, letter) => {
  for (const key in stats) {
    if (key.startsWith(letter)) {
      return key.charAt(1);
    }
  }
  return null;
};

const pickLetterAfter = (stats, letter) => {
  const startingWithStats = Object.entries(stats).filter((entry) =>
    entry[0].startsWith(letter)
  );
  const total = startingWithStats.reduce((acc, entry) => acc + entry[1], 0);

  let randomInt = randIntBetween(0, total);
  let index = 0;
  let nextLetter = "?";
  while (randomInt > 0) {
    if (randomInt <= startingWithStats[index][1]) {
      nextLetter = startingWithStats[index][0].charAt(1);
      break;
    } else {
      randomInt -= startingWithStats[index][1];
      index++;
    }
  }

  return nextLetter;
  // console.log(nextLetter);
};

const mostCommonLetterBefore = (stats, letter) => {
  for (const key in stats) {
    if (key.endsWith(letter)) {
      return key.charAt(0);
    }
  }
  return null;
};

const randIntBetween = (from, to) =>
  Math.floor(Math.random() * (to - from + 1)) + from;

allLanguages.forEach((language) => {
  console.log("\n" + language.name.slice(0, -4) + "\n");

  const words = language.content.split("\n").map((w) => w.toLocaleLowerCase());

  const longestWord = words.sort((a, b) => b.length - a.length)[0];
  let sizes = Array(longestWord.length + 1).fill(0);
  words.forEach((w) => sizes[w.length]++);

  // console.log(sizes.map((s, i) => `${i} letters: ${s}`));

  const mostCommonWordSize = sizes.indexOf(Math.max(...sizes));
  // console.log("Most common word size: " + mostCommonWordSize);

  const letters = [
    ...words
      .join("")
      .split("")
      .reduce((acc, l) => {
        const index = acc.findIndex((e) => e.letter === l);
        if (index >= 0) {
          acc[index].occurence++;
          return acc;
        } else {
          acc.push({
            letter: l,
            occurence: 1,
          });
          return acc;
        }
      }, [])
      .sort((a, b) => b.occurence - a.occurence),
    { letter: "^" },
    { letter: "$" },
  ];
  // console.log(letters);

  let stats = letters.reduce(
    (acc1, l1) => ({
      ...acc1,
      ...letters.reduce(
        (acc2, l2) => ({
          ...acc2,
          [`${l1.letter}${l2.letter}`]: 0,
        }),
        {}
      ),
    }),
    {}
  );
  // console.log(stats);

  words.forEach((word) => {
    word.split("").forEach((letter, indexLetter) => {
      if (indexLetter === 0) {
        stats[`^${letter}`]++;
      } else if (indexLetter === word.length - 1) {
        stats[`${word[indexLetter - 1]}${word[indexLetter]}`]++;
        stats[`${letter}$`]++;
      } else {
        stats[`${word[indexLetter - 1]}${word[indexLetter]}`]++;
      }
    });
  });

  // Sort stats by occurences
  stats = Object.fromEntries(
    Object.entries(stats).sort(([, val1], [, val2]) => val2 - val1)
  );
  // console.log(stats);

  let sentence = "";

  for (let i = 0; i < 200; i++) {
    sentence += createWord(stats, randIntBetween(2, 15)) + " ";
  }

  console.log(sentence);
});

fs.readFile(filename, (err, data) => {
  if (err) {
    console.warn(err);
  } else if (data) {
  }
});
