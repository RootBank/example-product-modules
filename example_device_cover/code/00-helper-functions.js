// 00-helper-functions

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
      .split(/[,]+/g)
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

const joiValidMake = [
  'Apple',
  'Samsung',
  'Hauweii',
  'Oppo',
  'Google',
  'Xiaomi',
  'Sony',
];

/**
 * Checks which environment is being used for the API request
 * @returns {[string, 'sandbox' | 'api']} The API key and host for the relevant environment
 */
const checkEnvironment = () => {
  if (process.env.ENVIRONMENT === 'sandbox') {
    const apiKey = API_KEY_SANDBOX;
    const host = 'sandbox';
    return [apiKey, host];
  }

  if (process.env.ENVIRONMENT === 'production') {
    const apiKey = API_KEY_PRODUCTION;
    const host = 'api';
    return [apiKey, host];
  }
};

/**
 * Makes an API request to the root platform
 * @param {object} params
 * @param {'api' | 'sandbox'} params.host The environment where the request will be made
 * @param {string} params.method The type of request ['PUT','PATCH','GET', 'POST']
 * @param {any} params.data The request body
 * @param {string} params.apiKey The apiKey for the relevant environment
 * @param {string} params.path The path for the request
 */
const mainRootAPIRequest = async ({ host, method, data, apiKey, path }) => {
  try {
    const response = await fetch(
      `https://${host}.rootplatform.com/v1/insurance${path}`,
      {
        method: `${method}`,
        body: method === 'GET' ? undefined : JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`API request failed with error code: ${response}`);
    }
    let json = await response.json();
    return json;
  } catch (error) {
    //catch API errors
    console.log(error.toString());
  }
};
