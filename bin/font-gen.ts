#!/usr/bin/env ts-node

import * as fs from 'fs';

const ROOT = `${process.argv.slice(-1)[0]}/packages/material-ui-icons/src/`;

const files = fs.readdirSync(ROOT)
  .filter(x => fs.statSync(`${ROOT}/${x}`).isFile())
  .map(file => ({
    file, svg: fs.readFileSync(`${ROOT}/${file}`)
      .toString()
      .split(/\n/)
      .filter(y => y.includes('<path'))[0]
  })
  )
  .filter(x => !!x.svg);

const ew = (k: string) => (f: string) => f.endsWith(k);
const tt = ew('TwoTone.js');
const ol = ew('Outlined.js');
const rd = ew('Rounded.js');
const sp = ew('Sharp.js');
const none = (f: string) => !tt(f) && !ol(f) && !rd(f) && !sp(f);

const mapping = {
  'TwoTone': tt,
  'Outlined': ol,
  'Rounded': rd,
  'Sharp': sp,
  'Filled': none
};

function template(glyphs: string[]) {
  return `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
<defs>
  ${glyphs.join('\n    ')}
</defs></svg>`;
}

for (const [key, fn] of Object.entries(mapping)) {
  const matched = files.filter(x => fn(x.file));
  const glyphs = matched.map(x => {
    const svg = x.svg.replace(/<\/?React.Fragment[^>]*>/g, '');
    const code = x.file.replace(`${key}.js`, '')
      .replace(/.js$/, '')
      .replace(/([a-z])([A-Z])/g, (_, a: string, b: string) => `${a}_${b.toLowerCase()}`)
      .toLowerCase();
    return `<svg id="${code}">${svg.replace(/<path/g, a => `${a} transform="translate(-2.3, 0)"`)}</svg>`;
  });
  const file = template(glyphs);
  fs.writeFileSync(`${__dirname}/../src/assets/material-icons-${key}.svg`, file);
}
