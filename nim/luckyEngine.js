// nim/luckyEngine.js

const { calculateCoreProfile, reduceNumber } = require("./numerologyEngine");

// Same mappings
const LETTER_MAP = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const NUMBER_TO_LETTERS = {
  1: ["A", "J", "S"],
  2: ["B", "K", "T"],
  3: ["C", "L", "U"],
  4: ["D", "M", "V"],
  5: ["E", "N", "W"],
  6: ["F", "O", "X"],
  7: ["G", "P", "Y"],
  8: ["H", "Q", "Z"],
  9: ["I", "R"]
};

const luckyColorMap = {
  1: ["Gold", "Sun Yellow", "Warm Orange"],
  2: ["Soft White", "Cream", "Pastel Green"],
  3: ["Lavender", "Light Purple", "Peach"],
  4: ["Navy Blue", "Earthy Brown", "Grey"],
  5: ["Turquoise", "Mint Green", "Aqua"],
  6: ["Rose Pink", "Soft Blue", "Pearl"],
  7: ["Indigo", "Deep Violet", "Sea Green"],
  8: ["Deep Blue", "Dark Green", "Black"],
  9: ["Crimson Red", "Wine", "Maroon"]
};

const luckyDayMap = {
  1: ["Sunday", "Monday"],
  2: ["Monday", "Friday"],
  3: ["Thursday", "Tuesday"],
  4: ["Saturday", "Sunday"],
  5: ["Wednesday", "Friday"],
  6: ["Friday", "Thursday"],
  7: ["Monday", "Thursday"],
  8: ["Saturday", "Sunday"],
  9: ["Tuesday", "Thursday"]
};

function normalizeName(name) {
  return (name || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function sumName(name) {
  const n = normalizeName(name);
  let sum = 0;
  for (const ch of n) {
    sum += LETTER_MAP[ch] || 0;
  }
  return sum;
}

/**
 * Suggest simple name variants that tune towards targetNumber
 */
function suggestNameVariants(name, targetNumber, maxSuggestions = 5) {
  const baseRaw = sumName(name);
  const suggestions = [];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (const letter of alphabet) {
    const rawTotal = baseRaw + (LETTER_MAP[letter] || 0);
    const reduced = reduceNumber(rawTotal, true);
    if (reduced === targetNumber) {
      suggestions.push({
        variant: `${name}${letter}`,
        addedLetter: letter,
        targetNumber
      });
    }
    if (suggestions.length >= maxSuggestions) break;
  }

  return {
    targetNumber,
    baseRaw,
    suggestions
  };
}

function describeAbundance(lifePath, destiny) {
  const lines = [];

  lines.push(
    "Your abundance flow is tied to how authentically you show up in your work, relationships and decisions."
  );

  if ([8].includes(lifePath) || [8].includes(destiny)) {
    lines.push(
      "You carry a strong material mastery vibration – money, power and leadership can grow with you when you act with integrity."
    );
  } else if ([4].includes(lifePath) || [4].includes(destiny)) {
    lines.push(
      "Your wealth tends to build steadily over time – consistency, systems and long-term projects are your best allies."
    );
  } else if ([5].includes(lifePath) || [5].includes(destiny)) {
    lines.push(
      "Your money journey may come in waves – change, movement and new opportunities are part of how you attract abundance."
    );
  } else if ([3].includes(lifePath) || [3].includes(destiny)) {
    lines.push(
      "Creativity, communication and expression are directly linked to your earning potential – the more you share your ideas, the more doors open."
    );
  }

  return lines.join(" ");
}

function describeColorMeaning(primaryNumber, colors) {
  if (!primaryNumber || !colors || !colors.length) return "";

  const main = colors[0];
  return `For you, ${main} acts like an energetic highlighter – it amplifies your presence and helps your decisions feel clearer and more aligned. Surrounding yourself with these shades during important meetings, launches, pitches or new beginnings can subtly tilt energy in your favour.`;
}

function describeNameTuning(name, targetNumber) {
  return (
    `Your current name carries a certain vibration, but tuning it closer to your core number can make things feel more 'clicked in'. ` +
    `By gently adjusting spelling or adding one supportive letter, you are not changing who you are – you are simply aligning the outer label with the inner frequency.`
  );
}

function generateLuckyProfile(name, dobStr, now = new Date()) {
  const core = calculateCoreProfile(name, dobStr, now);

  const lifePath = core.lifePath.value;
  const destiny = core.destiny.value;
  const soulUrge = core.soulUrge.value;
  const personality = core.personality.value;
  const personalYear = core.personalYear.value;

  const primaryNumber = lifePath;
  const secondaryNumber = destiny;
  const supportNumbers = Array.from(
    new Set([soulUrge, personality].filter(Boolean))
  );

  const colors = luckyColorMap[primaryNumber] || [];
  const days = luckyDayMap[primaryNumber] || [];
  const initials = NUMBER_TO_LETTERS[primaryNumber] || [];

  const nameSuggestions = suggestNameVariants(name, primaryNumber);

  const abundanceStory = describeAbundance(lifePath, destiny);
  const colorStory = describeColorMeaning(primaryNumber, colors);
  const tuningStory = describeNameTuning(name, primaryNumber);

  return {
    meta: {
      generatedAt: now.toISOString(),
      engine: "Astravia Lucky v2.0",
      name,
      dob: dobStr
    },
    baseNumbers: {
      lifePath,
      destiny,
      soulUrge,
      personality,
      personalYear
    },
    luckyNumbers: {
      primary: primaryNumber,
      secondary: secondaryNumber,
      support: supportNumbers
    },
    luckyColors: colors,
    luckyDays: days,
    luckyInitials: initials,
    nameTuning: nameSuggestions,
    narrative: {
      abundanceVibe: abundanceStory,
      colorMeaning: colorStory,
      nameTuningStory: tuningStory,
      practicalTips: [
        "Use your lucky colours in key brand elements, clothes or surroundings on important days.",
        "Schedule important decisions and launches on your lucky days whenever possible.",
        "If you resonate with a tuned name variant, start by using it in low-risk spaces (usernames, display names, branding) and feel the energy shift."
      ]
    },
    legal: {
      disclaimer:
        "Astravia lucky name and abundance guidance is based on numerology patterns and is meant for inspiration and experimentation, not as financial or business advice. You remain responsible for your choices and actions."
    }
  };
}

module.exports = generateLuckyProfile;
