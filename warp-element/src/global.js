import { getBrand, getGlobalStyles } from './utils.js';

const brand = getBrand();
export const styles = await getGlobalStyles(brand);
