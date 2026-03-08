export const cleanJson = (input) => {
  const cleaned = input
    .replace(/^[\s]*```[\w]*\s*/gm, '')
    .replace(/```[\s]*$/gm, '')
    .trim();

  // Extract just the JSON object/array, ignoring anything after it
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!jsonMatch) {
    console.error("No JSON found in content:", cleaned);
    throw new Error("No JSON object or array found in input");
  }

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    console.log("Successfully parsed JSON:", parsed);
    return parsed;
  } catch (e) {
    console.error("Failed to parse JSON. Raw content:", jsonMatch[1]);
    throw e;
  }
}