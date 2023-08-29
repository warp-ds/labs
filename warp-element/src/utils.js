import { unsafeCSS } from 'lit';

const isServer = () => {
    return !(typeof window !== 'undefined');
};

const parseBrand = (str = '') => {
    if (str.toLocaleLowerCase().includes('blocket')) return { sld: 'blocket', tld: 'se' };
    if (str.toLocaleLowerCase().includes('tori')) return { sld: 'tori', tld: 'fi' };
    if (str.toLocaleLowerCase().includes('finn')) return { sld: 'finn', tld: 'no' };
    if (str.toLocaleLowerCase().includes('dba')) return { sld: 'dba', tld: 'dk' };
    return { sld: 'finn', tld: 'no' };
};


/*
 * @param {string} [brandStr] - a string with brand information
 * @returns {import("./global.js").Brand} brand object
 */
export const getBrand = (brandStr = '') => {
    if (brandStr !== '') return parseBrand(brandStr);
    if (!isServer && window?.location?.host) return parseBrand(window.location.host);
    if (process?.env?.NMP_BRAND) return parseBrand(process.env.NMP_BRAND);
    return parseBrand();
};

const loadStyles = async (urls = []) => {
    const server = isServer();

    if (server) {
        return urls.map((style) => {
            return unsafeCSS(`@import url('${style}');`);
        });
    }

    const requests = await Promise.all(urls.map((url) => {
        return fetch(url);
    }));

    const sheets = await Promise.all(requests.map((response) => {
        return response.text();
    }));

    return sheets.map((style) => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(style);
        return sheet;
    });
};
/**
 *
 * @param {import("./global.js").Brand} brand - target brand
 * @returns {Promise<import("./global.js").Styles>} CSS style information
 */
export const getGlobalStyles = async (brand) => {
    const { sld, tld } = brand;
    const urls = [
        `https://assets.finn.no/pkg/@warp-ds/fonts/v1/${sld}-${tld}.css`,
        `https://assets.finn.no/pkg/@warp-ds/css/v1/tokens/${sld}-${tld}.css`,
        `https://assets.finn.no/pkg/@warp-ds/css/v1/resets.css`,
    ];
    return await loadStyles(urls);
};
