// app/sitemap.js — Dynamic sitemap.xml
export default function sitemap() {
  return [
    {
      url: 'https://thebhtlabs.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
