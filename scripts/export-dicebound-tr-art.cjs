// Recompose the approved feature artwork with authentic Turkish gameplay captures.
// Usage: NODE_PATH=<sharp package parent> node scripts/export-dicebound-tr-art.cjs <Dicebound repo>
// This is an authoring tool only; the website build uses the committed WebP files.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const game = path.resolve(process.argv[2] || '');
if (!process.argv[2]) throw Error('Pass the original Dicebound repository path');
const repo = path.resolve(__dirname, '..');
const web = path.join(repo, 'public/_sites/dicebound');
const source = {
  town: ['AppStoreTownV07/town-en.svg', 'ReadoutLegibilityRuntimeV01/R03/2400x1080/town-level7-tr.png'],
  hunt: ['AppStoreSetV06/hunt-en.svg', 'I18nV01/Native12/2400x1080/hunt-tr.png'],
  adventure: ['AppStoreSetV06/adventure-en.svg', 'I18nV01/Native12/2400x1080/frost-map-tr.png'],
  crafting: ['AppStoreSetV06/crafting-en.svg', 'ReadoutLegibilityRuntimeV01/R03/2400x1080/mastery-family0-level10-tr.png'],
  gathering: ['AppStoreSetV06/gathering-en.svg', 'I18nV01/Native12/2400x1080/gathering-tr.png'],
};
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function main() {
  const provenanceFile = path.join(repo, 'sites/dicebound/asset-provenance.json');
  const provenance = JSON.parse(fs.readFileSync(provenanceFile));
  for (const [id, [composition, capture]] of Object.entries(source)) {
    const svgFile = path.join(game, 'ArtSource/Marketing', composition);
    const captureFile = path.join(game, 'Evidence/Presentation', capture);
    const meta = await sharp(captureFile).metadata();
    if (meta.width !== 2400 || meta.height !== 1080) throw Error(`Unexpected capture size: ${capture}`);
    let headlines = 0, gameplay = 0;
    const inputs = [];
    const svg = fs.readFileSync(svgFile, 'utf8')
      .replace(/<g aria-label="[^"]*"[^>]*><g[^>]*>[\s\S]*?<\/g><\/g>/g, () => { headlines++; return ''; })
      .replace(/href="([^"]+\.png)"/g, (_, href) => {
        let file = path.resolve(path.dirname(svgFile), href.replace(/&amp;/g, '&'));
        if (file.includes('/Evidence/Presentation/')) { file = captureFile; gameplay++; }
        inputs.push({ path: path.relative(game, file), sha256: digest(file) });
        return `href="data:image/png;base64,${fs.readFileSync(file).toString('base64')}"`;
      });
    if (headlines !== 2 || gameplay !== 1) throw Error(`Unexpected composition structure: ${id}`);
    for (const width of [640, 1600]) {
      const file = `assets/${id}-tr-v1-${width}.webp`;
      const output = path.join(web, file);
      await sharp(Buffer.from(svg)).resize(width).flatten({ background: '#0b1110' }).webp({ quality: 88, effort: 6 }).toFile(output);
      provenance.images = provenance.images.filter(item => item.file !== file);
      provenance.images.push({ file, language: 'tr', source: path.relative(game, svgFile), sourceSha256: digest(svgFile), inputs, sha256: digest(output), processing: 'Approved SVG geometry, foreground artwork and masks preserved. Two promotional headline groups omitted as on EN. Only the entire gameplay image is replaced with an unretouched authentic Turkish capture; no labels reconstructed.' });
    }
  }
  fs.writeFileSync(provenanceFile, JSON.stringify(provenance, null, 2) + '\n');
  const htmlFile = path.join(web, 'tr/index.html');
  let html = fs.readFileSync(htmlFile, 'utf8');
  for (const id of Object.keys(source)) html = html.replace(new RegExp(`assets/${id}-(?:tr-v1-)?(640|1600)\\.webp`, 'g'), `assets/${id}-tr-v1-$1.webp`);
  fs.writeFileSync(htmlFile, html);
  const manifestFile = path.join(repo, 'sites/dicebound/package-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile));
  const changed = ['public/tr/index.html', ...Object.keys(source).flatMap(id => [640, 1600].map(w => `public/assets/${id}-tr-v1-${w}.webp`))];
  for (const entry of changed) {
    const disk = path.join(web, entry.slice(7));
    const value = { path: entry, bytes: fs.statSync(disk).size, sha256: digest(disk) };
    const index = manifest.files.findIndex(f => f.path === entry);
    if (index < 0) manifest.files.push(value); else manifest.files[index] = value;
  }
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Exported five authentic TR feature compositions at 640/1600px; EN and hero unchanged.');
}
main().catch(error => { console.error(error); process.exit(1); });
