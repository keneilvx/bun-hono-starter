export const PROMPT  = `You will be provided with an image containing one or more hymns, either as full sheet music with lyrics or as a lyrics-only page. Your task is to analyze the image and convert the information and lyrics of the hymn with the **lowest hymn number** into a specific JSON format. If the image contains only one hymn, process that one.

**Input:**

1.  An original image of the hymn(s).
2.  Optionally, several cropped versions of the image may be provided as hints to help clarify details. Use these hints only if needed to see specific parts of the original image better.

**Output Requirements:**

Produce a single JSON object following the structure and rules outlined below. Do **not** include any explanatory text before or after the JSON object itself. Only output the JSON for the single hymn selected based on the lowest hymn number.

**JSON Structure:**

\`\`\`json
{
  "hymns": {
    "title": "Extracted Title",
    "author": "Extracted Author(s) / Source(s)", // Use null if not present
    "composer": "Extracted Composer(s) / Tune Name / Source(s)", // Use null if not present
    "hymn_number": "Extracted Hymn Number", // The main, prominent number for the selected hymn
    "year": 1998, // Optional: Extracted Year. Use null if not present.
    "key": "Extracted Key", // Optional: Use null if not present.
    "meter": "Extracted Meter", // Optional: Use null if not present.
    "scripture_reference": "Extracted Scripture Reference", // Optional: Use null if not present.
    "category": "Extracted Category", // Optional: Use null if not present.
    "included_verses": [1, 2, ..., n], // An array listing numbers from 1 up to the total count of lyrical blocks (verses + refrains)
    "hymnal_id": null // Use the key "hymnal_id" and set the value to null
  },
  "lyrics": [
    {
      "verse_number": 1, // Sequential number for the lyrical block (1st block = 1, 2nd block = 2, etc.)
      "verse_type": "verse | refrain", // Identify if the block is a standard 'verse' or a 'refrain'/'chorus'. Use 'refrain' for choruses.
      "verse_text": "Line 1 of the block text\\nLine 2 of the block text\\n..." // The full text of the block, with newline characters '\\n' inserted EXACTLY where line breaks occur in the image.
    },
    {
      "verse_number": 2,
      "verse_type": "...",
      "verse_text": "..."
    }
    // ... additional lyrical blocks
  ]
}
\`\`\`

**Specific Instructions:**

1.  **Hymn Selection:** If the image contains multiple hymns (identifiable by distinct large hymn numbers), select ONLY the hymn with the lowest number for processing. Ignore all other hymns on the page.
2.  **Extraction:** Carefully extract the \`title\`, \`author\`, \`composer\`, \`hymn_number\`, \`year\`, \`key\`, \`meter\`, \`scripture_reference\`, and \`category\` for the *selected* hymn. If any of the optional fields are missing, use \`null\`.
3.  **Lyrics Array:**
    *   Identify each distinct lyrical section in the selected hymn, such as numbered verses or labeled sections like "Chorus" or "Refrain." If a section follows a Chorus or Refrain and appears to be part of it—based on formatting, indentation, or repetition—include it as part of the same Chorus/Refrain block.
    *   For **each** block, create an object in the \`lyrics\` array.
    *   **\`verse_number\`:** Assign sequential numbers starting from 1 for *every* lyrical block encountered in the selected hymn, regardless of its \`verse_type\` or any numbering present in the image *within* the verses (e.g., the small numbers on lyrics-only pages are visual cues, not the \`verse_number\` for the JSON).
    *   **\`verse_type\`:** Determine if the block is a \`verse\` or a \`refrain\`. Use \`refrain\` for parts explicitly labeled "Chorus" or "Refrain", or parts that clearly function as such.
    *   **\`verse_text\`:** Transcribe the text for the block accurately. **Crucially, insert the newline character \`\\n\` into the string precisely where line breaks appear in the image.** Do not include verse numbers from the image in the \`verse_text\`. Do not add extra spaces around the \`\\n\`.
4.  **\`included_verses\`:** The array in \`hymns.included_verses\` should contain a sequence of numbers from 1 up to the *total number* of objects you created in the \`lyrics\` array for the selected hymn.
5.  **\`hymnal_id\`:** Ensure this key is named exactly \`hymnal_id\` and its value is set to \`null\`.
6.  **Format Variations:**
    *   **Sheet Music:** Extract info as usual. Verses are typically numbered under the staff. Choruses/refrains might be separate sections.
    *   **Lyrics-Only Pages:** The large number at the top/side is the \`hymn_number\`. The smaller numbers next to stanzas are *visual cues* for verse beginnings but do *not* directly map to the JSON \`verse_number\`. Identify verses and potential refrains, (often indented or separated) and assign sequential \`verse_number\` values to each block. Use the first line as the \`title\` if no other title is present. Author/Composer and other optional fields might be missing (\`null\`).
`;