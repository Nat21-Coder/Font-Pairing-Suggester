"use client";

import { useState, useEffect, useRef, SetStateAction } from "react";
import { ChevronDown, Info, Share2, Code, Heart, Undo } from "lucide-react";
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

import { useToast } from "@/hooks/use-toast";

import CodeDialog from "./code-dialog";
import { FavoritePairing, Paring } from "@/types";
import FavoritesList from "./favorites-list";
import FontPairingCard from "./font-paring-card";

export function FontPairingSuggester() {
  const [open, setOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("");
  const [selectedPairingIndex, setSelectedPairingIndex] = useState<
    number | null
  >(null);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoritePairing[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadedFontsRef = useRef<Set<string>>(new Set());

  const selectedPairings = selectedFont
    ? fontPairings.find((font) => font.primary === selectedFont)?.pairings || []
    : [];

  const selectedPairing: Paring | null =
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
    };
  }, []);

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

            {/*  */}
            <FavoritesList
              favoritesOpen={favoritesOpen}
              fontPairings={fontPairings}
              setFavorites={setFavorites}
              setFavoritesOpen={setFavoritesOpen}
              favorites={favorites}
              setSelectedFont={setSelectedFont}
              setSelectedPairingIndex={setSelectedPairingIndex}
            />
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
                {/* font paring card*/}
                <FontPairingCard
                  favorites={favorites}
                  pairing={pairing}
                  fontsLoaded={fontsLoaded}
                  selectedFont={selectedFont}
                  index={index}
                  setSelectedPairingIndex={setSelectedPairingIndex}
                  setFavorites={setFavorites}
                  setCodeDialogOpen={setCodeDialogOpen}
                />
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

      {/* code  */}
      <CodeDialog
        codeDialogOpen={codeDialogOpen}
        setCodeDialogOpen={setCodeDialogOpen}
        selectedFont={selectedFont}
        selectedPairing={selectedPairing}
      />
    </div>
  );
}
