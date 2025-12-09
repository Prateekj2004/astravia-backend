// nim/reportGenerator.js

const { calculateCoreProfile } = require("./numerologyEngine");
const {
  lifePathMeanings,
  destinyMeanings,
  soulUrgeMeanings,
  personalityMeanings,
  personalYearMeanings,
} = require("./interpretations");

// ---- Helper functions to create more engaging text ---- //

function lineBreakJoin(lines) {
  return lines.filter(Boolean).join(" ");
}

function describeLifeTheme(lpVal, destVal) {
  if (!lpVal) return "";

  if (lpVal === 1) {
    return "You carry the energy of a natural leader – someone who is here to initiate, take charge and go first. Even when you doubt yourself, life keeps pushing you into positions where you must decide and others quietly look to you.";
  }
  if (lpVal === 2) {
    return "Your life theme is sensitivity, partnership and peace-making. You are the one who feels small shifts in people and rooms that others miss, and when you trust this sensitivity, it becomes your superpower.";
  }
  if (lpVal === 3) {
    return "Your path is about expression, creativity and joy. You are not designed for a dull, mechanical life – your soul wants colour, words, art, humour and space to play.";
  }
  if (lpVal === 4) {
    return "Your life is about building something solid – systems, structures, foundations. You think long-term, even when you’re impatient, and you are at your best when you can see clear steps and routines.";
  }
  if (lpVal === 5) {
    return "You are the adventurer archetype. Your soul cannot stay stuck in one box for too long. Change, travel, new experiences, ideas and people keep you alive inside.";
  }
  if (lpVal === 6) {
    return "You carry the vibration of the healer and guardian. Family, loyalty, responsibility and care are big themes in your life – even when you try to detach, you end up holding things together.";
  }
  if (lpVal === 7) {
    return "You are the seeker: a mix of logic and spirituality. You don’t blindly believe – you investigate, observe, research and then create your own truth.";
  }
  if (lpVal === 8) {
    return "Your life theme is power, impact and material mastery. Money, influence and responsibility are meant to grow with you, as you learn to handle them with maturity.";
  }
  if (lpVal === 9) {
    return "You carry an old-soul humanitarian energy. Your life often pulls you towards helping, guiding or uplifting people in some way – even when you say you are done, your heart is never fully detached.";
  }
  if (lpVal === 11) {
    return "You have a heightened intuitive and spiritual antenna. You pick up meanings and patterns beneath the surface and are here to inspire, guide or awaken others through your presence and ideas.";
  }
  if (lpVal === 22) {
    return "You carry a rare master builder frequency – the ability to take big visions and turn them into something tangible that serves many people over time.";
  }

  return "Your life path is unique – you are not supposed to copy anyone’s template. You are here to experiment, observe and then walk in your own custom direction.";
}

function describeLovePattern(suVal, persVal) {
  if (!suVal) return "";

  const lines = [];

  if (suVal === 2 || suVal === 6) {
    lines.push(
      "In love, you are a giver by nature – you crave emotional safety, consistency and someone who really sees you, not just your surface."
    );
  } else if (suVal === 5) {
    lines.push(
      "You need love that feels alive, honest and free. Too many rules, control or emotional pressure can make you pull away silently."
    );
  } else if (suVal === 7) {
    lines.push(
      "Emotionally, you open slowly. You may appear calm or even distant at first, but once you trust someone, your loyalty runs deep."
    );
  } else if (suVal === 8) {
    lines.push(
      "You take commitment seriously and you secretly want a partner who matches your ambition and work ethic – someone you can build with, not just spend time with."
    );
  } else {
    lines.push(
      "Your heart wants connection that feels real – honest conversations, shared values and emotional depth matter more to you than superficial attraction."
    );
  }

  if (persVal === 1 || persVal === 8) {
    lines.push(
      "To others you may look strong and sorted, so your softer emotional needs are often invisible until you feel really safe."
    );
  } else if (persVal === 3) {
    lines.push(
      "People may experience you as fun, expressive or playful – but behind that you carry deeper layers that not everyone gets to see."
    );
  }

  return lineBreakJoin(lines);
}

function describeCareer(core) {
  const lp = core.lifePath.value;
  const dest = core.destiny.value;
  const lines = [];

  if ([1, 8].includes(dest) || [1, 8].includes(lp)) {
    lines.push(
      "You thrive in roles where decisions, ownership and impact matter – leadership, entrepreneurship, management, strategy or anything where you are not just 'another cog in the machine'."
    );
  } else if ([3, 5].includes(dest)) {
    lines.push(
      "You shine in creative, communication or flexible roles – content, media, marketing, design, consulting, teaching, performance or anything that lets you express and experiment."
    );
  } else if ([4].includes(dest)) {
    lines.push(
      "You do well in structured environments – operations, finance, tech, engineering, law, project management – anywhere your ability to plan and stabilise is valued."
    );
  } else if ([6, 9].includes(dest)) {
    lines.push(
      "You carry a natural service/healing energy – counselling, coaching, HR, wellness, education, social impact, design or people-centric roles suit you strongly."
    );
  } else {
    lines.push(
      "Your best work is where you can be useful, heard and respected – a space that values your viewpoint and gives you room to grow at your own pace."
    );
  }

  return lineBreakJoin(lines);
}

function describeMoney(core) {
  const lp = core.lifePath.value;
  const su = core.soulUrge.value;
  const lines = [];

  lines.push(
    "Money in your life is closely linked to your alignment – the more you act like your true self, the more flow you experience."
  );

  if ([8].includes(lp) || [8].includes(su)) {
    lines.push(
      "You are built for abundance, but also for responsibility – when you respect money and use it wisely, it tends to return to you in bigger ways."
    );
  } else if ([4].includes(lp)) {
    lines.push(
      "Slow, consistent effort and long-term thinking bring you more wealth than shortcuts or risky bets."
    );
  } else if ([5].includes(lp)) {
    lines.push(
      "Your money journey may go through phases of ups and downs, but each phase unlocks more wisdom about where and how you truly want to invest your energy."
    );
  }

  return lineBreakJoin(lines);
}

function describeTiming(core) {
  const py = core.personalYear.value;
  if (!py) return "";

  if (py === 1) {
    return "This is a new chapter year – a time to plant seeds, start fresh cycles, launch ideas and say yes to things that feel like upgrades for your future self.";
  }
  if (py === 2) {
    return "This is a patience and alignment year – more about planning, emotional healing and quietly positioning yourself than loud external moves.";
  }
  if (py === 3) {
    return "This is a creativity and expression year – a good time to speak up, share, create, socialise and show more of who you really are.";
  }
  if (py === 4) {
    return "This is a foundation-building year – work, health, routines and systems may demand attention, but what you create now supports you for years ahead.";
  }
  if (py === 5) {
    return "This is a change and turning-point year – expect movement, unexpected shifts and invitations to step outside your comfort zone.";
  }
  if (py === 6) {
    return "This is a responsibility and relationship year – family, home, commitments and long-term decisions may come into focus.";
  }
  if (py === 7) {
    return "This is an inner work and spiritual year – reflection, study, healing and more alone-time can bring powerful clarity.";
  }
  if (py === 8) {
    return "This is a power and results year – career, money, status and recognition themes may intensify, giving you chances to level up.";
  }
  if (py === 9) {
    return "This is a closure and release year – old cycles, people or patterns may complete, making space for a new version of you.";
  }

  return "This year brings important subtle shifts – stay honest with yourself and trust the gentle inner nudges more than outside noise.";
}

function buildStrengths(core) {
  const lines = [];

  const lp = core.lifePath.value;
  const dest = core.destiny.value;
  const su = core.soulUrge.value;
  const pers = core.personality.value;

  if ([1, 8].includes(lp) || [1, 8].includes(dest)) {
    lines.push("You are naturally wired for leadership, initiative and taking charge when it truly matters.");
  }
  if ([2, 6, 9].includes(lp) || [2, 6, 9].includes(su)) {
    lines.push("You have a strong heart energy – people often feel understood, seen or held when they are around you.");
  }
  if ([3, 5].includes(lp) || [3, 5].includes(pers)) {
    lines.push("You bring freshness, creativity or humour into spaces that might otherwise feel heavy or serious.");
  }
  if ([7].includes(lp) || [7].includes(su)) {
    lines.push("You have a rare depth of perception – you notice patterns, subtleties and truths that many miss.");
  }
  if (!lines.length) {
    lines.push("You have a mix of strengths that make you adaptable, observant and able to move through different phases of life with wisdom.");
  }

  return lines;
}

function buildGrowthAreas(core) {
  const lp = core.lifePath.value;
  const su = core.soulUrge.value;
  const lines = [];

  if ([1].includes(lp)) {
    lines.push("Learning to ask for support instead of trying to do everything alone.");
  }
  if ([2].includes(lp) || [2].includes(su)) {
    lines.push("Not taking things too personally and trusting your own decisions more.");
  }
  if ([3].includes(lp)) {
    lines.push("Finishing what you start and not hiding your deeper feelings behind jokes or busyness.");
  }
  if ([5].includes(lp)) {
    lines.push("Balancing freedom with commitment so that you don’t sabotage good opportunities.");
  }
  if ([7].includes(lp)) {
    lines.push("Letting people in emotionally instead of staying only in your head or withdrawing.");
  }
  if ([8].includes(lp)) {
    lines.push("Trusting that power and softness can coexist – you don’t have to choose only one.");
  }

  if (!lines.length) {
    lines.push("Being kinder to yourself during transitions and allowing support instead of carrying everything alone.");
  }

  return lines;
}

function buildAffirmation(core, name) {
  const lp = core.lifePath.value;
  const base = name ? `I, ${name}, now choose to ` : "I now choose to ";

  if (lp === 1) {
    return base + "lead my life with courage, clarity and self-respect, trusting that my path is meant to be different.";
  }
  if (lp === 2) {
    return base + "honour my sensitivity as a strength and call in relationships that feel safe, equal and kind.";
  }
  if (lp === 3) {
    return base + "express my true self freely and allow my creativity to be seen, heard and valued.";
  }
  if (lp === 4) {
    return base + "build stable foundations that support my long-term peace, success and security.";
  }
  if (lp === 5) {
    return base + "embrace change with wisdom, choosing adventures that are aligned with my highest good.";
  }
  if (lp === 6) {
    return base + "create a life where love, responsibility and self-care are in healthy balance.";
  }
  if (lp === 7) {
    return base + "trust my inner knowing and honour my need for depth, meaning and spiritual truth.";
  }
  if (lp === 8) {
    return base + "handle power and money with integrity, allowing abundance to flow in balanced ways.";
  }
  if (lp === 9) {
    return base + "live with compassion and purpose, releasing what no longer serves my heart.";
  }

  return base + "walk my own path with trust, courage and self-love.";
}

// ---- Main generator ---- //

function generateReport(name, dobStr, now = new Date()) {
  const core = calculateCoreProfile(name, dobStr, now);

  const lpVal = core.lifePath.value;
  const destVal = core.destiny.value;
  const suVal = core.soulUrge.value;
  const persVal = core.personality.value;
  const pyVal = core.personalYear.value;

  const lifePathInfo = lifePathMeanings[lpVal] || null;
  const destinyInfo = destinyMeanings[destVal] || null;
  const soulUrgeInfo = soulUrgeMeanings[suVal] || null;
  const personalityInfo = personalityMeanings[persVal] || null;
  const personalYearInfo = personalYearMeanings[pyVal] || null;

  const lifeTheme = describeLifeTheme(lpVal, destVal);
  const lovePattern = describeLovePattern(suVal, persVal);
  const careerPath = describeCareer(core);
  const moneyVibe = describeMoney(core);
  const timingInsight = describeTiming(core);
  const strengthsList = buildStrengths(core);
  const growthAreasList = buildGrowthAreas(core);
  const affirmation = buildAffirmation(core, name);

  const comboSummary = lineBreakJoin([
    lifeTheme,
    lovePattern,
    careerPath,
    moneyVibe,
    timingInsight,
  ]);

  const headline = lifePathInfo
    ? `You walk the path of ${lifePathInfo.title} – with your own unique twist.`
    : "You walk a unique life path that doesn’t fit into anyone else’s template.";

  return {
    meta: {
      generatedAt: now.toISOString(),
      engine: "Astravia Core v2.0",
      name,
      dob: dobStr,
    },
    coreNumbers: {
      lifePath: core.lifePath,
      birthDay: core.birthDay,
      destiny: core.destiny,
      soulUrge: core.soulUrge,
      personality: core.personality,
      personalYear: core.personalYear,
      personalMonth: core.personalMonth,
      pinnacles: core.pinnacles,
      challenges: core.challenges,
      karmicDebts: core.karmicDebts,
    },
    meanings: {
      lifePath: lifePathInfo,
      destiny: destinyInfo,
      soulUrge: soulUrgeInfo,
      personality: personalityInfo,
      personalYear: personalYearInfo,
    },
    // Important: keep summary.headline + comboSummary for email + frontend
    summary: {
      headline,
      comboSummary,
      love: lovePattern,
      career: careerPath,
      money: moneyVibe,
      timing: timingInsight,
      strengths: strengthsList,
      growthAreas: growthAreasList,
      affirmation,
    },
    legal: {
      disclaimer:
        "Astravia provides numerology-based insights for guidance and self-reflection only. It is not a substitute for professional financial, medical, legal or psychological advice. You are responsible for your own choices.",
    },
  };
}

module.exports = generateReport;
