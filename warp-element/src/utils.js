export const isServer = () => {
  return !(typeof window !== "undefined");
};

const parseBrand = (str = "") => {
  if (str.toLocaleLowerCase().includes("blocket"))
    return { sld: "blocket", tld: "se" };
  if (str.toLocaleLowerCase().includes("tori"))
    return { sld: "tori", tld: "fi" };
  if (str.toLocaleLowerCase().includes("finn"))
    return { sld: "finn", tld: "no" };
  if (str.toLocaleLowerCase().includes("dba")) return { sld: "dba", tld: "dk" };
  return { sld: "finn", tld: "no" };
};

/**
 * @param {string} [brandStr] - a string with brand information
 * @returns {import("./global.js").Brand} brand object
 */
export const getBrand = (brandStr = "") => {
  if (brandStr !== "") return parseBrand(brandStr);
  if (!isServer() && window?.location?.host)
    return parseBrand(window.location.host);
  if (isServer() && process?.env?.NMP_BRAND)
    return parseBrand(process.env.NMP_BRAND);
  return parseBrand();
};

class StyleLoadResult {
  isServer = false;
  css = "";
}

const loadStylesSync = (urls = []) => {
  const loadResult = new StyleLoadResult();
  const server = isServer();

  if (server) {
    for (const url of urls) {
      loadResult.css += `@import url('${url}');`;
    }
    loadResult.isServer = true;
    return loadResult;
  }

  for (const url of urls) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url, false);
    xhr.send();
    loadResult.css += xhr.responseText;
  }

  return loadResult;
};
/**
 *
 * @param {import("./global.js").Brand} brand - target brand
 * @returns {StyleLoadResult} CSS stylesheets as strings
 */
export const getGlobalStylesSync = (brand) => {
  const { sld, tld } = brand;
  const urls = [
    `https://assets.finn.no/pkg/@warp-ds/fonts/v1/${sld}-${tld}.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/tokens/${sld}-${tld}.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/resets.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/components.css`,
  ];
  return loadStylesSync(urls);
};


const loadStyles = async (urls = []) => {
  const loadResult = new StyleLoadResult();
  const server = isServer();

  if (server) {
    for (const url of urls) {
      loadResult.css += `@import url('${url}');`;
    }
    loadResult.isServer = true;
    return loadResult;
  }

  const requests = await Promise.all(
      urls.map((url) => {
        return fetch(url);
      })
  );

  const cssResult = await Promise.all(
      requests.map((response) => {
        return response.text();
      })
  );

  for (const sheet of cssResult) {
    loadResult.css += sheet;
  }

  return loadResult;
};
/**
 *
 * @param {import("./global.js").Brand} brand - target brand
 * @returns {Promise<StyleLoadResult>} CSS stylesheets as strings
 */
export const getGlobalStyles = async (brand) => {
  const { sld, tld } = brand;
  const urls = [
    `https://assets.finn.no/pkg/@warp-ds/fonts/v1/${sld}-${tld}.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/tokens/${sld}-${tld}.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/resets.css`,
    `https://assets.finn.no/pkg/@warp-ds/css/v1/components.css`,
  ];
  return await loadStyles(urls);
};
