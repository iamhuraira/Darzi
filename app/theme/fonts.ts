/**
 * Font families. Use Jameel Noori Nastaleeq for Urdu text when language is Urdu.
 * Urdu text is 4pt larger than English for readability.
 */
export const URDU_FONT_FAMILY = "JameelNooriNastaleeq";
export const URDU_FONT_SIZE_DELTA = 4;

/** Use when language === "urdu" for a Text with the given English base fontSize. */
export function getUrduStyle(baseFontSize: number) {
  return {
    fontFamily: "JameelNooriNastaleeq",
    fontSize: baseFontSize + URDU_FONT_SIZE_DELTA,
  };
}
