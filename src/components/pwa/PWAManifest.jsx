// PWA Manifest Configuration
// Add this to your index.html head section

export const PWA_MANIFEST = {
  name: "Groupy Loopy",
  short_name: "Groupy Loopy",
  description: "Find trip partners and organize group hiking trips",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#10b981",
  orientation: "portrait-primary",
  scope: "/",
  icons: [
    {
      src: "/icon-72x72.png",
      sizes: "72x72",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-96x96.png",
      sizes: "96x96",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-128x128.png",
      sizes: "128x128",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-144x144.png",
      sizes: "144x144",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-152x152.png",
      sizes: "152x152",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-384x384.png",
      sizes: "384x384",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ],
  categories: ["travel", "lifestyle", "social"],
  screenshots: [
    {
      src: "/screenshot-wide.png",
      sizes: "1280x720",
      type: "image/png",
      form_factor: "wide"
    },
    {
      src: "/screenshot-narrow.png",
      sizes: "720x1280",
      type: "image/png",
      form_factor: "narrow"
    }
  ],
  shortcuts: [
    {
      name: "Create Trip",
      short_name: "Create",
      description: "Create a new trip",
      url: "/CreateTrip",
      icons: [{ src: "/icon-96x96.png", sizes: "96x96" }]
    },
    {
      name: "My Trips",
      short_name: "My Trips",
      description: "View your trips",
      url: "/MyTrips",
      icons: [{ src: "/icon-96x96.png", sizes: "96x96" }]
    }
  ]
};

// HTML meta tags for PWA and iOS support
export const PWA_META_TAGS = `
<!-- PWA Meta Tags -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#10b981">
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="Groupy Loopy">

<!-- iOS Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Groupy Loopy">
<link rel="apple-touch-icon" href="/icon-152x152.png">
<link rel="apple-touch-icon" sizes="72x72" href="/icon-72x72.png">
<link rel="apple-touch-icon" sizes="96x96" href="/icon-96x96.png">
<link rel="apple-touch-icon" sizes="128x128" href="/icon-128x128.png">
<link rel="apple-touch-icon" sizes="144x144" href="/icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png">
<link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png">
<link rel="apple-touch-icon" sizes="384x384" href="/icon-384x384.png">
<link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png">

<!-- iOS Splash Screens -->
<link rel="apple-touch-startup-image" href="/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" href="/splash-1668x2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" href="/splash-1536x2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" href="/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)">
<link rel="apple-touch-startup-image" href="/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">
<link rel="apple-touch-startup-image" href="/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)">
`;

export function injectPWAMetaTags() {
  // This function can be called to inject meta tags dynamically
  const head = document.head;
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = '/manifest.json';
  head.appendChild(manifestLink);

  // Theme color
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#10b981';
  head.appendChild(themeColor);

  // iOS specific
  const iosCapable = document.createElement('meta');
  iosCapable.name = 'apple-mobile-web-app-capable';
  iosCapable.content = 'yes';
  head.appendChild(iosCapable);

  const iosStatusBar = document.createElement('meta');
  iosStatusBar.name = 'apple-mobile-web-app-status-bar-style';
  iosStatusBar.content = 'default';
  head.appendChild(iosStatusBar);

  const iosTitle = document.createElement('meta');
  iosTitle.name = 'apple-mobile-web-app-title';
  iosTitle.content = 'Groupy Loopy';
  head.appendChild(iosTitle);
}