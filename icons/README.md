# Icon render service prototype

This is a small prototype for server side scaling and manipulating SVGs.

There is tree folders of interest:

 * `/packages/icons/` - a set of svg icons / icon library
 * `/packages/service/` - a icon service to optimize, apply tokens and serve ths icons in the icon library
 * `/packages/app/` - an example app using icons from the icon service

## /packages/icons/

Tree structure of icons as SVG plus a set of tokens for each brand which the icons use.

## /packages/service/

Small node.js server massaging and serving icons.

Install dependencies:

```sh
npm install
```

Start service:

```sh
npm start
```

Icons are now ex available on: http://localhost:5000/api/tori/circle/200/200/icon.svg

## /packages/app/

Small node.js server illustrating a user of icons from a icon library

Install dependencies:

```sh
npm install
```

Start service:

```sh
npm start
```

Icons are now ex available on: http://localhost:5100/app/blocket