import https from 'https';

/**
 * Downloads a chunk of synthesized Vietnamese audio from standard Google TTS.
 */
export function fetchVietnameseTtsChunk(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url =
      'https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=' +
      encodeURIComponent(text);

    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`TTS service returned status code ${res.statusCode}`));
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

/**
 * Splits Vietnamese text into speech-friendly chunks under the character limit (160 chars)
 * respecting sentence boundaries (. ! ? \n ,).
 */
export function splitVietnameseText(text: string, maxLength = 160): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((currentChunk + ' ' + trimmed).trim().length <= maxLength) {
      currentChunk = (currentChunk + ' ' + trimmed).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (trimmed.length <= maxLength) {
        currentChunk = trimmed;
      } else {
        const words = trimmed.split(/\s+/);
        let subChunk = '';
        for (const w of words) {
          if ((subChunk + ' ' + w).trim().length <= maxLength) {
            subChunk = (subChunk + ' ' + w).trim();
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = w;
          }
        }
        currentChunk = subChunk;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks.slice(0, 10);
}
