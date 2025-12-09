// NIM Core Calculation Engine (Layer 1)

// Pythagorean name chart
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

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const KARMIC_DEBTS = [13, 14, 16, 19];

function parseDob(dobStr) {
  const [yearStr, monthStr, dayStr] = dobStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (!year || !month || !day) {
    throw new Error('Invalid dob format, expected YYYY-MM-DD');
  }
  return { year, month, day };
}

function reduceNumber(num, preserveMaster = true) {
  if (!Number.isFinite(num)) return null;

  while (num > 9) {
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    let sum = 0;
    String(num).split('').forEach(d => (sum += parseInt(d, 10)));
    num = sum;
  }
  return num;
}

function normalizeName(name) {
  return (name || '').toUpperCase().replace(/[^A-Z]/g, '');
}

// mode: 'all' | 'vowels' | 'consonants'
function sumName(name, mode = 'all') {
  const normalized = normalizeName(name);
  let sum = 0;

  for (const ch of normalized) {
    const val = LETTER_MAP[ch] || 0;
    const isVowel = VOWELS.has(ch);

    if (mode === 'vowels' && isVowel) sum += val;
    else if (mode === 'consonants' && !isVowel) sum += val;
    else if (mode === 'all') sum += val;
  }
  return sum;
}

function calculateLifePath(dobStr) {
  const { year, month, day } = parseDob(dobStr);
  const digits = `${year}${month.toString().padStart(2, '0')}${day
    .toString()
    .padStart(2, '0')}`;
  let total = 0;
  digits.split('').forEach(d => (total += parseInt(d, 10)));
  const raw = total;
  const value = reduceNumber(total, true);
  return { raw, value };
}

function calculateBirthDay(dobStr) {
  const { day } = parseDob(dobStr);
  const raw = day;
  if (day === 11 || day === 22) return { raw, value: day };
  return { raw, value: reduceNumber(day, false) };
}

function calculateDestiny(name) {
  const raw = sumName(name, 'all');
  const value = reduceNumber(raw, true);
  return { raw, value };
}

function calculateSoulUrge(name) {
  let raw = sumName(name, 'vowels');
  if (raw === 0) raw = sumName(name, 'consonants');
  const value = reduceNumber(raw, true);
  return { raw, value };
}

function calculatePersonality(name) {
  let raw = sumName(name, 'consonants');
  if (raw === 0) raw = sumName(name, 'vowels');
  const value = reduceNumber(raw, true);
  return { raw, value };
}

function calculatePersonalYear(dobStr, currentDate = new Date()) {
  const { month, day } = parseDob(dobStr);
  const year = currentDate.getFullYear();

  const dayRed = reduceNumber(day, false);
  const monthRed = reduceNumber(month, false);

  let yearSum = 0;
  String(year).split('').forEach(d => (yearSum += parseInt(d, 10)));
  const yearRed = reduceNumber(yearSum, false);

  const total = dayRed + monthRed + yearRed;
  const value = reduceNumber(total, false);

  return { year, value };
}

function calculatePersonalMonth(dobStr, currentDate = new Date()) {
  const personalYear = calculatePersonalYear(dobStr, currentDate).value;
  const month = currentDate.getMonth() + 1;
  const total = personalYear + reduceNumber(month, false);
  const value = reduceNumber(total, false);
  return { month, value };
}

function calculatePinnacles(dobStr) {
  const { year, month, day } = parseDob(dobStr);

  const dayRed = reduceNumber(day, false);
  const monthRed = reduceNumber(month, false);

  let yearSum = 0;
  String(year).split('').forEach(d => (yearSum += parseInt(d, 10)));
  const yearRed = reduceNumber(yearSum, false);

  const p1 = reduceNumber(dayRed + monthRed, false);
  const p2 = reduceNumber(dayRed + yearRed, false);
  const p3 = reduceNumber(p1 + p2, false);
  const p4 = reduceNumber(monthRed + yearRed, false);

  return [p1, p2, p3, p4];
}

function calculateChallenges(dobStr) {
  const { year, month, day } = parseDob(dobStr);

  const dayRed = reduceNumber(day, false);
  const monthRed = reduceNumber(month, false);

  let yearSum = 0;
  String(year).split('').forEach(d => (yearSum += parseInt(d, 10)));
  const yearRed = reduceNumber(yearSum, false);

  const c1 = Math.abs(dayRed - monthRed);
  const c2 = Math.abs(dayRed - yearRed);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(monthRed - yearRed);

  return [
    reduceNumber(c1, false),
    reduceNumber(c2, false),
    reduceNumber(c3, false),
    reduceNumber(c4, false)
  ];
}

function detectKarmicDebts(numbers) {
  const flags = [];
  for (const key of Object.keys(numbers)) {
    const raw = numbers[key].raw;
    if (KARMIC_DEBTS.includes(raw)) {
      flags.push({ type: key, raw });
    }
  }
  return flags;
}

function calculateCoreProfile(name, dobStr, currentDate = new Date()) {
  const lifePath = calculateLifePath(dobStr);
  const birthDay = calculateBirthDay(dobStr);
  const destiny = calculateDestiny(name);
  const soulUrge = calculateSoulUrge(name);
  const personality = calculatePersonality(name);
  const personalYear = calculatePersonalYear(dobStr, currentDate);
  const personalMonth = calculatePersonalMonth(dobStr, currentDate);
  const pinnacles = calculatePinnacles(dobStr);
  const challenges = calculateChallenges(dobStr);

  const karmicDebts = detectKarmicDebts({
    lifePath,
    birthDay,
    destiny,
    soulUrge
  });

  return {
    lifePath,
    birthDay,
    destiny,
    soulUrge,
    personality,
    personalYear,
    personalMonth,
    pinnacles,
    challenges,
    karmicDebts
  };
}

module.exports = {
  calculateCoreProfile,
  reduceNumber
};
