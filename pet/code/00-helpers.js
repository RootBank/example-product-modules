/**
 * Converts a string like this
 * ```
 * age,low_risk,high_risk
 * 0,0.10,0.20
 * 1,0.14,0.25
 * ```
 * into an object like this
 * ```
 * {
 *   0: {
 *     low_risk: 0.10
 *     high_risk: 0.20
 *   },
 *   1: {
 *     low_risk: 0.14
 *     high_risk: 0.25
 *   }
 * }
 * ```
 * String values are converted to numbers where possible.
 * @param {string} csv Raw comma-separated values
 * @returns {Record<string, any>} Data represented as an object
 */
const getObjectFromCsv = (csv) => {
  const allRows = csv.split('\n').map((row) =>
    row
      .trim()
      .split(/[,\s]+/g)
      .map((cell) => (isNaN(Number(cell)) ? cell : Number(cell))),
  );
  const headings = allRows[0];
  const rows = allRows.slice(1);
  const data = rows.map((row) =>
    row.reduce((acc, cur, i) => {
      acc[headings[i]] = cur;
      return acc;
    }, {}),
  );
  return data;
};
