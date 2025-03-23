import { FavoritePairing } from "@/types";

// Generate CSS code
export const generateCssCode = (primary: string, secondary: string) => {
  return `/* Font Import */
    @import url('https://fonts.googleapis.com/css2?family=${primary.replace(
      /\s+/g,
      "+"
    )}:wght@400;700&family=${secondary.replace(
    /\s+/g,
    "+"
  )}:wght@400;700&display=swap');
    
    /* Font Variables */
    :root {
      --font-primary: '${primary}', system-ui, sans-serif;
      --font-secondary: '${secondary}', system-ui, sans-serif;
    }
    
    /* Typography Styles */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-primary);
    }
    
    body, p, div, span, li, input, textarea, button {
      font-family: var(--font-secondary);
    }
    `;
};

// Generate HTML snippet
export const generateHtmlSnippet = (primary: string, secondary: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Font Pairing Example</title>
      
      <!-- Font Import -->
      <link href="https://fonts.googleapis.com/css2?family=${primary.replace(
        /\s+/g,
        "+"
      )}:wght@400;700&family=${secondary.replace(
    /\s+/g,
    "+"
  )}:wght@400;700&display=swap" rel="stylesheet">
      
      <style>
        /* Font Variables */
        :root {
          --font-primary: '${primary}', system-ui, sans-serif;
          --font-secondary: '${secondary}', system-ui, sans-serif;
        }
    
        /* Typography Styles */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-primary);
        }
    
        body, p, div, span, li, input, textarea, button {
          font-family: var(--font-secondary);
        }
    
        /* Example Styles */
        body {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
        }
    
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
    
        h2 {
          font-size: 1.8rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
    
        p {
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <h1>This heading uses ${primary}</h1>
      <p>This paragraph text uses ${secondary}. This demonstrates how the fonts work together in a typical layout with headings and body text.</p>
      
      <h2>Another heading in ${primary}</h2>
      <p>More body text in ${secondary}. The combination creates a balanced visual hierarchy that guides the reader through the content.</p>
    </body>
    </html>`;
};

// Generate React/Next.js snippet
export const generateReactSnippet = (primary: string, secondary: string) => {
  return `// fonts.ts
    import { ${primary.replace(/\s+/g, "_")}, ${secondary.replace(
    /\s+/g,
    "_"
  )} } from 'next/font/google'
    
    export const primaryFont = ${primary.replace(/\s+/g, "_")}({
      subsets: ['latin'],
      weight: ['400', '700'],
      variable: '--font-primary',
      display: 'swap',
    })
    
    export const secondaryFont = ${secondary.replace(/\s+/g, "_")}({
      subsets: ['latin'],
      weight: ['400', '700'],
      variable: '--font-secondary',
      display: 'swap',
    })
    
    // layout.tsx
    import { primaryFont, secondaryFont } from '@/fonts'
    import './globals.css'
    
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="en">
          <body className={\`\${primaryFont.variable} \${secondaryFont.variable}\`}>
            {children}
          </body>
        </html>
      )
    }
    
    // globals.css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    @layer base {
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-primary);
      }
      
      body {
        font-family: var(--font-secondary);
      }
    }
    
    // Example component
    export default function Page() {
      return (
        <div>
          <h1 className="text-3xl font-bold">This heading uses ${primary}</h1>
          <p className="mt-2">This paragraph text uses ${secondary}.</p>
        </div>
      )
    }`;
};
// Generate shareable URL
const generateShareableUrl = (primary: string, secondary: string) => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?primary=${encodeURIComponent(
    primary
  )}&secondary=${encodeURIComponent(secondary)}`;
};
// Share URL
export const shareUrl = (
  primary: string,
  secondary: string,
  toast: any,
  router: any
) => {
  const url = generateShareableUrl(primary, secondary);

  if (navigator.share) {
    navigator
      .share({
        title: `${primary} + ${secondary} Font Pairing`,
        text: `Check out this font pairing: ${primary} with ${secondary}`,
        url: url,
      })
      .catch((err) => {
        // Fallback to copying URL
        handleCopyToClipboard(url, "Shareable link copied to clipboard", toast);
      });
  } else {
    // Fallback for browsers that don't support navigator.share
    handleCopyToClipboard(url, "Shareable link copied to clipboard", toast);
    // Update the URL without refreshing the page
    router.push(url, { scroll: false });
  }
};
export const handleCopyToClipboard = (
  text: string,
  message = "Copied to clipboard",
  toast: any
) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied to clipboard",
    description: message,
    duration: 3000,
  });
};

