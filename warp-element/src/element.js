import { PodiumElement } from '@podium/element';
import { getBrand, getGlobalStyles } from './utils.js';

const brandInfo = getBrand();
const globalCss = await getGlobalStyles(brandInfo);

export default class WarpElement extends PodiumElement {    
    static styles = [
        ...globalCss,
    ];

    constructor() {
        super();
    }
}
