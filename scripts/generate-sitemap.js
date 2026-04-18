import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { Readable } from 'stream';

const domain = 'https://goodecompaniesflorida.com';
const distPath = resolve('dist');

function getHtmlPages(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    let pages = [];

    files.forEach((file) => {
        const fullPath = join(dir, file.name);
        if (file.isDirectory()) {
            pages = [...pages, ...getHtmlPages(fullPath)];
        } else if (file.name.endsWith('.html')) {
            const relativePath = fullPath
                .replace(distPath, '')
                .replace(/\\/g, '/')
                .replace('/index.html', '/')
                .replace('.html', '');

            pages.push({
                url: relativePath || '/',
                changefreq: 'monthly',
                priority: relativePath === '/' ? 1.0 : 0.7,
            });
        }
    });

    return pages;
}

async function buildSitemap() {
    const pages = getHtmlPages(distPath);
    const sitemapStream = new SitemapStream({ hostname: domain });
    const writeStream = createWriteStream(join(distPath, 'sitemap.xml'));

    const stream = Readable.from(pages).pipe(sitemapStream).pipe(writeStream);

    await streamToPromise(sitemapStream);
    console.log(`✅ Sitemap successfully created with ${pages.length} pages at dist/sitemap.xml`);
}

buildSitemap().catch((err) => {
    console.error('❌ Error creating sitemap:', err);
});
