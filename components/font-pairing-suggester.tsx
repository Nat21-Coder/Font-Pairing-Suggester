"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Info,
  Share2,
  Code,
  Heart,
  Trash2,
  ArrowRight,
  Undo,
  X,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { fontPairings } from "@/lib/font-pairings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Type for favorite font pairings
type FavoritePairing = {
  primary: string;
  secondary: string;
  tags: string[];
};

export function FontPairingSuggester() {
  const [open, setOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("");
  const [selectedPairingIndex, setSelectedPairingIndex] = useState<
    number | null
  >(null);
  const { toast } = useToast();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoritePairing[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadedFontsRef = useRef<Set<string>>(new Set());
  const handleCopyToClipboard = (
    text: string,
    message = "Copied to clipboard"
  ) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: message,
      duration: 3000,
    });
  };

  const selectedPairings = selectedFont
    ? fontPairings.find((font) => font.primary === selectedFont)?.pairings || []
    : [];

  const selectedPairing =
    selectedPairingIndex !== null
      ? selectedPairings[selectedPairingIndex]
      : null;

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem("fontPairingFavorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error parsing favorites from localStorage", e);
        // If there's an error parsing, start with empty favorites
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fontPairingFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Parse URL parameters on initial load
  useEffect(() => {
    const primary = searchParams.get("primary");
    const secondary = searchParams.get("secondary");

    if (primary) {
      setSelectedFont(primary);

      if (secondary) {
        // Find the index of the secondary font in the pairings
        const fontPairingObj = fontPairings.find(
          (font) => font.primary === primary
        );
        if (fontPairingObj) {
          const pairingIndex = fontPairingObj.pairings.findIndex(
            (pairing) => pairing.secondary === secondary
          );
          if (pairingIndex !== -1) {
            setSelectedPairingIndex(pairingIndex);
          }
        }
      }
    }
  }, [searchParams]);

  // Load fonts only once on initial render and when new fonts need to be loaded
  useEffect(() => {
    // Set loading state
    setFontsLoaded(false);

    // Collect all fonts that need to be loaded
    const fontsToLoad = new Set<string>();

    // Add all primary fonts
    fontPairings.forEach((font) => {
      fontsToLoad.add(font.primary);
      // Add all secondary fonts
      font.pairings.forEach((pairing) => {
        fontsToLoad.add(pairing.secondary);
      });
    });

    // Also load fonts from favorites
    favorites.forEach((favorite) => {
      fontsToLoad.add(favorite.primary);
      fontsToLoad.add(favorite.secondary);
    });

    // Filter out fonts that are already loaded
    const newFontsToLoad = Array.from(fontsToLoad).filter(
      (font) => !loadedFontsRef.current.has(font)
    );

    if (newFontsToLoad.length === 0) {
      // If all fonts are already loaded, just set the state
      setFontsLoaded(true);
      return;
    }

    // Load each new font using Google Fonts
    const links: HTMLLinkElement[] = [];
    newFontsToLoad.forEach((font) => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        /\s+/g,
        "+"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      links.push(link);

      // Add to loaded fonts set
      loadedFontsRef.current.add(font);
    });

    // Set a timeout to assume fonts are loaded after 2 seconds
    // This is a fallback in case the font loading events don't fire correctly
    const timeoutId = setTimeout(() => {
      setFontsLoaded(true);
    }, 2000);

    // Try to detect when fonts are loaded
    document.fonts.ready.then(() => {
      clearTimeout(timeoutId);
      setFontsLoaded(true);
    });

    return () => {
      clearTimeout(timeoutId);
      // We don't remove the links since we want to keep the fonts loaded
    };
  }, []); // Only run on initial render

  // Check if a pairing is in favorites
  const isFavorite = (primary: string, secondary: string) => {
    return favorites.some(
      (fav) => fav.primary === primary && fav.secondary === secondary
    );
  };

  // Add a pairing to favorites
  const addToFavorites = (
    primary: string,
    secondary: string,
    tags: string[]
  ) => {
    if (!isFavorite(primary, secondary)) {
      const newFavorite: FavoritePairing = {
        primary,
        secondary,
        tags,
      };
      setFavorites([...favorites, newFavorite]);
      toast({
        title: "Added to favorites",
        description: `${primary} + ${secondary} has been added to your favorites`,
        duration: 3000,
      });
    }
  };

  // Remove a pairing from favorites
  const removeFromFavorites = (primary: string, secondary: string) => {
    const currentFavorites = [...favorites];

    // Remove the item
    const newFavorites = favorites.filter(
      (fav) => !(fav.primary === primary && fav.secondary === secondary)
    );
    setFavorites(newFavorites);
    toast({
      title: "Removed from favorites",
      description: `${primary} + ${secondary} has been removed`,
      duration: 5000,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFavorites(currentFavorites)}
          className="gap-1"
        >
          <Undo className="h-3 w-3" />
          Undo
        </Button>
      ),
    });
  };

  // Generate shareable URL
  const generateShareableUrl = (primary: string, secondary: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?primary=${encodeURIComponent(
      primary
    )}&secondary=${encodeURIComponent(secondary)}`;
  };

  // Share URL
  const shareUrl = (primary: string, secondary: string) => {
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
          handleCopyToClipboard(url, "Shareable link copied to clipboard");
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyToClipboard(url, "Shareable link copied to clipboard");

      // Update the URL without refreshing the page
      router.push(url, { scroll: false });
    }
  };

  // Generate CSS code
  const generateCssCode = (primary: string, secondary: string) => {
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
  const generateHtmlSnippet = (primary: string, secondary: string) => {
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
  const generateReactSnippet = (primary: string, secondary: string) => {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-sm">
          <div className="flex sm:flex-row flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {selectedFont ? selectedFont : "Select a primary font..."}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-sm p-0">
                <Command>
                  <CommandInput placeholder="Search fonts..." />
                  <CommandList>
                    <CommandEmpty>No font found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {fontPairings.map((font) => (
                        <CommandItem
                          key={font.primary}
                          value={font.primary}
                          onSelect={(currentValue) => {
                            setSelectedFont(currentValue);
                            setSelectedPairingIndex(null);
                            setOpen(false);
                          }}
                        >
                          {selectedFont === font.primary ? (
                            <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-primary-foreground">
                              <span className="h-2 w-2 rounded-full bg-current" />
                            </span>
                          ) : (
                            <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary/20" />
                          )}
                          {font.primary}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Sheet open={favoritesOpen} onOpenChange={setFavoritesOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-shrink-0 relative">
                  <Heart className="h-4 w-4" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-gray-300 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                  <span className="sr-only truncate">Favorites</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="truncate">
                    Your Favorite Font Pairings
                  </SheetTitle>
                  <SheetDescription className="truncate">
                    {favorites.length > 0
                      ? "Your saved font combinations for quick access."
                      : "You haven't saved any favorites yet."}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {favorites.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 truncate">
                        Click the heart icon on any font pairing to save it
                        here.
                      </p>
                    </div>
                  ) : (
                    favorites.map((favorite, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div className="w-full">
                            <h3 className="font-medium truncate">
                              {favorite.primary} + {favorite.secondary}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 px-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      // Set the selected font and find the pairing
                                      setSelectedFont(favorite.primary);
                                      const fontObj = fontPairings.find(
                                        (f) => f.primary === favorite.primary
                                      );
                                      if (fontObj) {
                                        const pairingIndex =
                                          fontObj.pairings.findIndex(
                                            (p) =>
                                              p.secondary === favorite.secondary
                                          );
                                        if (pairingIndex !== -1) {
                                          setSelectedPairingIndex(pairingIndex);
                                        }
                                      }
                                      // Close the favorites sheet
                                      setFavoritesOpen(false);
                                    }}
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="sr-only">
                                      View pairing
                                    </span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View this pairing</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      shareUrl(
                                        favorite.primary,
                                        favorite.secondary
                                      )
                                    }
                                  >
                                    <Share2 className="h-4 w-4" />
                                    <span className="sr-only">Share</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Share pairing</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeFromFavorites(
                                        favorite.primary,
                                        favorite.secondary
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove from favorites</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p
                            className="text-xl font-bold truncate"
                            style={{
                              fontFamily: `"${favorite.primary}", system-ui, sans-serif`,
                            }}
                          >
                            Heading in {favorite.primary}
                          </p>
                          <p
                            className="text-sm truncate"
                            style={{
                              fontFamily: `"${favorite.secondary}", system-ui, sans-serif`,
                            }}
                          >
                            Body text in {favorite.secondary}. This demonstrates
                            how the fonts work together.
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {favorite.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {selectedFont && (
        <div className="space-y-6">
          <h2 className="text-md sm:text-xl truncate font-semibold text-center">
            Complementary fonts for{" "}
            <span className="text-gray-400">{selectedFont}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPairings.map((pairing, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow",
                  selectedPairingIndex === index && "ring-2 ring-primary"
                )}
              >
                <div className="flex flex-col px-2 py-6">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="flex flex-col w-full">
                      {/* HERE TRUNCATE DOEN'T WORK */}
                      <h3 className="text-lg font-medium truncate">
                        {pairing.secondary}
                      </h3>
                      {/* HERE TRUNCATE DOESN"T WORK */}
                      <p className="text-sm text-gray-500 truncate">
                        with {selectedFont}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 px-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={
                                isFavorite(selectedFont, pairing.secondary)
                                  ? "text-red-500 hover:text-red-600"
                                  : ""
                              }
                              onClick={() => {
                                if (
                                  isFavorite(selectedFont, pairing.secondary)
                                ) {
                                  removeFromFavorites(
                                    selectedFont,
                                    pairing.secondary
                                  );
                                } else {
                                  addToFavorites(
                                    selectedFont,
                                    pairing.secondary,
                                    pairing.tags
                                  );
                                }
                              }}
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4",
                                  isFavorite(selectedFont, pairing.secondary)
                                    ? "fill-red-500"
                                    : ""
                                )}
                              />
                              <span className="sr-only">
                                {isFavorite(selectedFont, pairing.secondary)
                                  ? "Remove from favorites"
                                  : "Add to favorites"}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {isFavorite(selectedFont, pairing.secondary)
                                ? "Remove from favorites"
                                : "Add to favorites"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPairingIndex(index);
                                setCodeDialogOpen(true);
                              }}
                            >
                              <Code className="h-4 w-4" />
                              <span className="sr-only">Get code</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Get code</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPairingIndex(index);
                                shareUrl(selectedFont, pairing.secondary);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only">Share pairing</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share pairing</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                toast({
                                  title: "Pairing Info",
                                  description: pairing.reason,
                                  duration: 5000,
                                })
                              }
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Why this works</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Why this works</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      {!fontsLoaded && (
                        <div className="h-20 flex items-center justify-center">
                          <div className="animate-pulse text-gray-400 truncate">
                            Loading fonts...
                          </div>
                        </div>
                      )}
                      <div
                        className={
                          !fontsLoaded
                            ? "opacity-0"
                            : "opacity-100 transition-opacity duration-300"
                        }
                      >
                        {/* HERE TRUNCATE WORK */}
                        <p
                          className="text-md sm:text-2xl truncate font-bold"
                          style={{
                            fontFamily: `"${selectedFont}", system-ui, sans-serif`,
                          }}
                        >
                          Heading in {selectedFont}
                        </p>
                        {/* HERE TRUNCATE WORKS */}
                        <p
                          className="text-base truncate"
                          style={{
                            fontFamily: `"${pairing.secondary}", system-ui, sans-serif`,
                          }}
                        >
                          Body text in {pairing.secondary}. This demonstrates
                          how the fonts work together in a typical layout with
                          headings and body text.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {pairing.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full truncate"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedFont && (
        <div className="text-center p-12 border border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 truncate">
            Select a primary font to see complementary pairings
          </p>
        </div>
      )}

      {/* Code Dialog */}
      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <DialogTitle className="truncate max-w-[90vw]">
                {selectedFont && selectedPairing ? (
                  <>
                    Implementation Code for {selectedFont} +{" "}
                    {selectedPairing.secondary}
                  </>
                ) : (
                  "Font Pairing Code"
                )}
              </DialogTitle>
              <DialogDescription>
                Copy the code snippets below to implement this font pairing in
                your project.
              </DialogDescription>
            </div>

           
          </DialogHeader>

          {selectedFont && selectedPairing && (
            <Tabs className="mt-4 max-h-[80vh] overflow-y-auto flex flex-col gap-10 px-4">
              <div className="flex w-full flex-col gap-2 ">
                <TabsList>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                </TabsList>
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                <TabsList>
                  <TabsTrigger value="react">React/Next.js</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="css" className="mt-4 space-y-4">
                <div className="relative">
                  <pre className="p-4 rounded-md bg-gray-100 text-sm  overflow-auto w-full md:max-w-[40vw] max-h-[50vh]">
                    <code>
                      {generateCssCode(selectedFont, selectedPairing.secondary)}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-400"
                    onClick={() =>
                      handleCopyToClipboard(
                        generateCssCode(
                          selectedFont,
                          selectedPairing.secondary
                        ),
                        "CSS code copied to clipboard"
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500 ">
                  <p className="truncate">
                    This CSS imports both fonts from Google Fonts and sets up
                    CSS variables for consistent usage throughout your project.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="html" className="mt-4 space-y-4">
                <div className="relative">
                  <pre className="p-4 rounded-md bg-gray-100 text-sm overflow-auto w-full md:max-w-3xl  max-h-[50vh]">
                    <code>
                      {generateHtmlSnippet(
                        selectedFont,
                        selectedPairing.secondary
                      )}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-400"
                    onClick={() =>
                      handleCopyToClipboard(
                        generateHtmlSnippet(
                          selectedFont,
                          selectedPairing.secondary
                        ),
                        "HTML snippet copied to clipboard"
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="truncate">
                    This HTML snippet includes everything you need to implement
                    the font pairing in a simple HTML page.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="react" className="mt-4 space-y-4">
                <div className="relative">
                  <pre className="p-4 rounded-md bg-gray-100 text-sm overflow-auto max-w-3xl max-h-[50vh]">
                    <code>
                      {generateReactSnippet(
                        selectedFont,
                        selectedPairing.secondary
                      )}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-400 "
                    onClick={() =>
                      handleCopyToClipboard(
                        generateReactSnippet(
                          selectedFont,
                          selectedPairing.secondary
                        ),
                        "React code copied to clipboard"
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="truncate">
                    This React/Next.js implementation uses the Next.js font
                    system for optimal performance and font loading.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
