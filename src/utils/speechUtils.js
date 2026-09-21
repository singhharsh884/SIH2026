/**
 * Text preprocessor to convert abbreviations, markdown, units,
 * and numbers into smooth, dignified executive spoken language.
 */
export const prepareProfessionalSpeechText = (text, isHindi) => {
  if (!text) return '';

  let speech = text;

  // 1. Remove all emojis and pictographs so speech synthesizer doesn't skip or make noises
  // Uses Unicode Extended_Pictographic and designated emoji ranges (preserving currency symbols like ₹ \u20B9)
  speech = speech
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 2. Expand units, symbols and acronyms into spoken words
  if (isHindi) {
    speech = speech
      .replace(/₹\s*([0-9]+)\s*\/\s*kg/gi, '$1 रुपये प्रति किलोग्राम')
      .replace(/₹\s*([0-9]+)/g, '$1 रुपये')
      .replace(/₹/g, 'रुपये ')
      .replace(/(\d+)\s*°C\s*[-–—toसे]+\s*(\d+)\s*°C/gi, '$1 से $2 डिग्री सेल्सियस')
      .replace(/(\d+)\s*°C/gi, '$1 डिग्री सेल्सियस')
      .replace(/\bkg\b|\bकि\.?ग्रा\.?\b/gi, 'किलोग्राम')
      .replace(/\bRFQ\b(?:\s*निविदा)?/gi, 'आर एफ क्यू निविदा')
      .replace(/\bIoT\b/gi, 'आईओटी')
      .replace(/\bGPS\b/gi, 'जीपीएस')
      .replace(/\bAPI\b/gi, 'एपीआई')
      .replace(/\bAI\b/gi, 'एआई')
      .replace(/KisanDirect/gi, 'किसानडायरेक्ट');

    // Expand numerals in lists into dignified spoken connectors
    speech = speech
      .replace(/(?:^|\n)\s*1\.\s*/g, '\nप्रथम बिंदु, ')
      .replace(/(?:^|\n)\s*2\.\s*/g, '\nद्वितीय बिंदु, ')
      .replace(/(?:^|\n)\s*3\.\s*/g, '\nतृतीय बिंदु, ')
      .replace(/(?:^|\n)\s*4\.\s*/g, '\nचतुर्थ बिंदु, ')
      .replace(/(?:^|\n)\s*5\.\s*/g, '\nपंचम बिंदु, ');
  } else {
    speech = speech
      .replace(/₹\s*([0-9]+)\s*\/\s*kg/gi, '$1 Rupees per kilogram')
      .replace(/₹\s*([0-9]+)/g, '$1 Rupees')
      .replace(/₹/g, 'Rupees ')
      .replace(/(\d+)\s*°C\s*[-–—to]+\s*(\d+)\s*°C/gi, '$1 to $2 degrees Celsius')
      .replace(/(\d+)\s*°C/gi, '$1 degrees Celsius')
      .replace(/\bkg\b/gi, 'kilograms')
      .replace(/\bRFQ\b(?:\s*tender)?/gi, 'Request for Quotation tender')
      .replace(/KisanDirect/gi, 'KisanDirect');

    // Expand numerals in lists into dignified spoken connectors
    speech = speech
      .replace(/(?:^|\n)\s*1\.\s*/g, '\nFirst, ')
      .replace(/(?:^|\n)\s*2\.\s*/g, '\nSecond, ')
      .replace(/(?:^|\n)\s*3\.\s*/g, '\nThird, ')
      .replace(/(?:^|\n)\s*4\.\s*/g, '\nFourth, ')
      .replace(/(?:^|\n)\s*5\.\s*/g, '\nFifth, ');
  }

  // 3. Remove markdown syntax characters
  speech = speech
    .replace(/\*\*/g, '')
    .replace(/__+/g, '')
    .replace(/#+/g, '')
    .replace(/```[^`]*```/gs, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/---/g, '')
    .replace(/[[\]]/g, '');

  // 4. Soften punctuation pauses
  speech = speech
    .replace(/:\s+/g, ', ')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return speech;
};

/**
 * Voice selection helper to match professional neural personas.
 */
export const getPreferredVoice = (allVoices, isTargetHindi, persona) => {
  if (!allVoices || allVoices.length === 0) return null;

  const isFemale = persona === 'female';

  if (isTargetHindi) {
    if (isFemale) {
      // Swati - Senior Trade Advisor (Female)
      // Priorities: Microsoft Swara Natural > Kalpana > Neerja > Google हिन्दी > any hi-IN
      const swara = allVoices.find((v) => /swara/i.test(v.name));
      if (swara) return swara;

      const kalpana = allVoices.find((v) => /kalpana/i.test(v.name));
      if (kalpana) return kalpana;

      const neerja = allVoices.find((v) => /neerja/i.test(v.name));
      if (neerja) return neerja;

      const googleHindi = allVoices.find(
        (v) =>
          (/google/i.test(v.name) || /online/i.test(v.name)) &&
          (/hindi/i.test(v.name) || /हिन्दी/i.test(v.name) || (v.lang && v.lang.toLowerCase().startsWith('hi')))
      );
      if (googleHindi) return googleHindi;

      const anyHindiFemale = allVoices.find(
        (v) =>
          v.lang &&
          v.lang.toLowerCase().startsWith('hi') &&
          !/madhur|hemant|prabhat|male/i.test(v.name)
      );
      if (anyHindiFemale) return anyHindiFemale;

      const anyHindi = allVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('hi'));
      if (anyHindi) return anyHindi;
    } else {
      // Rohan - Logistics & Trade Director (Male)
      // Priorities: Microsoft Madhur Natural > Hemant > Prabhat > any male hi-IN > any hi-IN
      const madhur = allVoices.find((v) => /madhur/i.test(v.name));
      if (madhur) return madhur;

      const hemant = allVoices.find((v) => /hemant/i.test(v.name));
      if (hemant) return hemant;

      const prabhat = allVoices.find((v) => /prabhat/i.test(v.name));
      if (prabhat) return prabhat;

      const anyHindiMale = allVoices.find(
        (v) =>
          v.lang &&
          v.lang.toLowerCase().startsWith('hi') &&
          /male|man|madhur|hemant|prabhat/i.test(v.name)
      );
      if (anyHindiMale) return anyHindiMale;

      const anyHindi = allVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('hi'));
      if (anyHindi) return anyHindi;
    }
  } else {
    // English
    if (isFemale) {
      // Swati (English)
      const neerja = allVoices.find((v) => /neerja/i.test(v.name));
      if (neerja) return neerja;

      const jenny = allVoices.find((v) => /jenny/i.test(v.name) && /natural/i.test(v.name));
      if (jenny) return jenny;

      const googleUkFemale = allVoices.find(
        (v) => /google/i.test(v.name) && /uk|female/i.test(v.name) && /en/i.test(v.lang)
      );
      if (googleUkFemale) return googleUkFemale;

      const enInFemale = allVoices.find(
        (v) => /en-in/i.test(v.lang) && !/male|david|prabhat|george/i.test(v.name)
      );
      if (enInFemale) return enInFemale;

      const anyEn = allVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (anyEn) return anyEn;
    } else {
      // Rohan (English)
      const prabhat = allVoices.find((v) => /prabhat/i.test(v.name));
      if (prabhat) return prabhat;

      const guy = allVoices.find((v) => /guy/i.test(v.name) && /natural/i.test(v.name));
      if (guy) return guy;

      const george = allVoices.find((v) => /george|david|mark/i.test(v.name));
      if (george) return george;

      const enInMale = allVoices.find(
        (v) => /en-in/i.test(v.lang) && /male|prabhat/i.test(v.name)
      );
      if (enInMale) return enInMale;

      const anyEn = allVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (anyEn) return anyEn;
    }
  }

  return null;
};
