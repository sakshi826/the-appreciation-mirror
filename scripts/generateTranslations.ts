import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'AIzaSyC0ZrBzIxWgc0jV7VGcAEcBRANoJVsSTiw';
const BASE_LANG = 'en';
const ALL_LANGUAGES = [
  'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl', 'nl', 'ms'
];

const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');
const EN_JSON_PATH = path.join(LOCALES_DIR, 'en.json');

async function translateText(text: string, targetLang: string) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: BASE_LANG,
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data: any = await response.json();
    if (data.error) {
      console.error(`Error translating to ${targetLang}:`, data.error.message);
      if (data.error.message.includes('API key expired')) {
        process.exit(1); // Stop if key expired
      }
      return null;
    }
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error(`Fetch error for ${targetLang}:`, error);
    return null;
  }
}

async function run() {
  const enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
  const keys = Object.keys(enData);
  const values = Object.values(enData) as string[];

  for (const lang of ALL_LANGUAGES) {
    console.log(`Translating to ${lang}...`);
    const translatedData: Record<string, string> = {};
    
    // Chunking translations might be better for API limits, but for small files we can do one by one or batch
    // Google Translate API v2 supports multiple 'q' parameters for batching.
    
    const translatedValues: string[] = [];
    for (const v of values) {
      const t = await translateText(v, lang);
      translatedValues.push(t || v);
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
    }

    keys.forEach((key, i) => {
      translatedData[key] = translatedValues[i];
    });

    fs.writeFileSync(
      path.join(LOCALES_DIR, `${lang}.json`),
      JSON.stringify(translatedData, null, 2),
      'utf-8'
    );
    console.log(`Finished ${lang}`);
  }
}

run().catch(console.error);
