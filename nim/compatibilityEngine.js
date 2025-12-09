// nim/compatibilityEngine.js

const { calculateCoreProfile } = require("./numerologyEngine");

function scorePair(aVal, bVal) {
  if (aVal === null || bVal === null) return 0;
  const diff = Math.abs(aVal - bVal);
  if (diff === 0) return 25;
  if (diff === 1) return 18;
  if (diff === 2) return 12;
  if (diff === 3) return 8;
  return 4;
}

function describeConnection(score, lpA, lpB, suA, suB) {
  const lines = [];

  if (score >= 80) {
    lines.push(
      "This connection carries a strong soulmate-like frequency. Even if life pulls you apart and back again, the energetic imprint between you tends to stay."
    );
  } else if (score >= 60) {
    lines.push(
      "There is a healthy, balanced compatibility here. With honest communication and mutual effort, this bond can deepen beautifully over time."
    );
  } else if (score >= 40) {
    lines.push(
      "This connection brings both attraction and friction. It can be powerful for growth if both people are self-aware and willing to meet in the middle."
    );
  } else {
    lines.push(
      "This is a challenging compatibility pattern – not impossible, but it may require extra patience, emotional maturity and clear boundaries."
    );
  }

  if (lpA === lpB) {
    lines.push(
      "You share a similar life path energy, which can create a feeling of 'we understand each other at a very basic level'."
    );
  } else {
    lines.push(
      "Your life paths are different, which can be both a beautiful balance and a source of misunderstanding if not communicated."
    );
  }

  if (suA === suB) {
    lines.push(
      "Your emotional needs are quite similar – this can bring deep comfort when both of you allow vulnerability."
    );
  } else {
    lines.push(
      "Emotionally, you are wired a bit differently. If you learn each other’s love language, this difference can become a strength instead of a conflict."
    );
  }

  return lines.join(" ");
}

function describeStrengths(score, profileA, profileB) {
  const lines = [];

  if (score >= 70) {
    lines.push(
      "Together you have the potential to build something stable and meaningful – whether as partners, friends or collaborators."
    );
  }

  const lpA = profileA.lifePath.value;
  const lpB = profileB.lifePath.value;

  if ([2, 6, 9].includes(lpA) || [2, 6, 9].includes(lpB)) {
    lines.push(
      "There is a real capacity for emotional care and support in this connection when you both feel safe."
    );
  }
  if ([3, 5].includes(lpA) || [3, 5].includes(lpB)) {
    lines.push(
      "You can bring playfulness, fun and variety into each other’s worlds, preventing the relationship from becoming stale."
    );
  }
  if ([4, 8].includes(lpA) || [4, 8].includes(lpB)) {
    lines.push(
      "There is strong potential for building something practical together – projects, business, home or long-term plans."
    );
  }

  if (!lines.length) {
    lines.push(
      "Your connection has the capacity to teach both of you more about yourselves, especially through day-to-day interactions."
    );
  }

  return lines;
}

function describeChallenges(profileA, profileB) {
  const lines = [];
  const lpA = profileA.lifePath.value;
  const lpB = profileB.lifePath.value;
  const suA = profileA.soulUrge.value;
  const suB = profileB.soulUrge.value;

  if ([1, 8].includes(lpA) && [1, 8].includes(lpB)) {
    lines.push(
      "Both of you can be strong-willed or proud at times – ego clashes are possible if communication turns into competition."
    );
  }

  if ([5].includes(lpA) || [5].includes(lpB)) {
    lines.push(
      "Freedom vs stability may be a recurring theme – one (or both) of you might need more space than the other at times."
    );
  }

  if (suA !== suB) {
    lines.push(
      "Your emotional needs are not identical – one may crave words and reassurance, while the other leans more on actions or practical support."
    );
  }

  if (!lines.length) {
    lines.push(
      "Your main challenges will revolve around communication styles, timing and how each of you handles stress or emotional triggers."
    );
  }

  return lines;
}

function generateCompatibility(personA, personB) {
  const now = new Date();
  const profileA = calculateCoreProfile(personA.name, personA.dob, now);
  const profileB = calculateCoreProfile(personB.name, personB.dob, now);

  const lpA = profileA.lifePath.value;
  const lpB = profileB.lifePath.value;
  const destA = profileA.destiny.value;
  const destB = profileB.destiny.value;
  const suA = profileA.soulUrge.value;
  const suB = profileB.soulUrge.value;
  const persA = profileA.personality.value;
  const persB = profileB.personality.value;

  let score = 0;
  score += scorePair(lpA, lpB);
  score += scorePair(destA, destB);
  score += scorePair(suA, suB);
  score += scorePair(persA, persB);
  if (score > 100) score = 100;

  let headline = "Balanced connection with growth potential.";
  if (score >= 80) headline = "High compatibility – strong soulmate-style pattern.";
  else if (score >= 60)
    headline = "Good compatibility with real emotional depth possible.";
  else if (score >= 40)
    headline = "Mixed compatibility – intense at times, but powerful for growth.";
  else headline = "Challenging compatibility – karmic or lesson-focused connection.";

  const mainSummary = describeConnection(score, lpA, lpB, suA, suB);
  const strengths = describeStrengths(score, profileA, profileB);
  const challenges = describeChallenges(profileA, profileB);

  const finalVerdict =
    score >= 80
      ? "With mutual maturity and effort, this connection can feel like a true partner or soulmate dynamic."
      : score >= 60
      ? "If both of you communicate honestly and consistently, this connection can become stable, supportive and deeply rewarding."
      : score >= 40
      ? "If you are both self-aware and willing to grow, this bond can teach you a lot about love, boundaries and emotional honesty."
      : "Treat this connection as a powerful mirror – it may not always be easy, but it can show you exactly where healing and boundaries are needed.";

  return {
    score,
    headline,
    summary: mainSummary,
    details: {
      connectionEnergy: mainSummary,
      strengths,
      challenges,
      finalVerdict,
    },
    profiles: {
      personA: profileA,
      personB: profileB,
    },
    legal: {
      disclaimer:
        "Astravia compatibility readings are for emotional insight and reflection only. They do not guarantee outcomes or replace professional relationship, legal or mental health advice.",
    },
  };
}

module.exports = generateCompatibility;
