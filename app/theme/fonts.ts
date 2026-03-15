/**
 * Urdu font: Noto Nastaliq Urdu for correct shaping of ک (kaaf) and other letters.
 * Jameel Noori can show ک as half-form or "K" on some devices; Noto Nastaliq has proper joining.
 */
export const URDU_FONT_FAMILY = "JameelNooriNastaleeq";

/** Use when language === "urdu" or for Urdu-script content. Uses Noto Nastaliq for proper letter forms. */
export function getUrduStyle(baseFontSize: number) {
  return {
    fontFamily: "JameelNooriNastaleeq",
    fontSize: baseFontSize,
  };
}

/** True if the string is primarily Arabic/Urdu script (e.g. from backend). Use for dynamic content. */
export function isUrduScript(str: string | undefined): boolean {
  if (!str || !str.trim()) return false;
  const arabicRange = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  let arabicCount = 0;
  let letterCount = 0;
  for (const char of str) {
    if (arabicRange.test(char)) arabicCount++;
    if (/\p{L}/u.test(char)) letterCount++;
  }
  return letterCount > 0 && arabicCount / letterCount >= 0.3;
}

/**
 * Use for dynamic text (e.g. customer name, address from backend).
 * Applies Urdu font + RTL alignment when content is Urdu script, else default alignment.
 */
export function getStyleForDynamicText(text: string | undefined, baseFontSize: number) {
  const isUrdu = isUrduScript(text);
  return {
    ...(isUrdu ? getUrduStyle(baseFontSize) : {}),
  };
}
