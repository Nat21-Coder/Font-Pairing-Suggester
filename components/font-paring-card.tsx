import { Code, Heart, Info, Share2, Undo } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { shareUrl } from "@/lib/functions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FavoritePairing, Pairing,  } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
interface FontParingCardProps {
  favorites: FavoritePairing[];
  pairing: Pairing;
  fontsLoaded: any;
  selectedFont: any;
  index:number,
  setSelectedPairingIndex: Dispatch<SetStateAction<number | null>>;
  setFavorites: Dispatch<SetStateAction<FavoritePairing[]>>;
  setCodeDialogOpen: Dispatch<SetStateAction<boolean>>;
}
const FontPairingCard = ({
  favorites,
  pairing,
  fontsLoaded,
  selectedFont,
  index,
  setSelectedPairingIndex,
  setFavorites,
  setCodeDialogOpen,
}:FontParingCardProps) => {
  const { toast } = useToast();
  const router = useRouter();
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

    // Check if a pairing is in favorites
    const isFavorite = (primary: string, secondary: string) => {
      return favorites.some(
        (fav) => fav.primary === primary && fav.secondary === secondary
      );
    };
  return (
    <div className="flex flex-col px-4 py-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium truncate">{pairing.secondary}</h3>

          <p className="text-sm text-gray-500 truncate">with {selectedFont}</p>
        </div>
        <div className="flex justify-end gap-2">
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
                    if (isFavorite(selectedFont, pairing.secondary)) {
                      removeFromFavorites(selectedFont, pairing.secondary);
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
                    shareUrl(selectedFont, pairing.secondary, toast, router);
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
            <p
              className="text-md sm:text-2xl truncate font-bold"
              style={{
                fontFamily: `"${selectedFont}", system-ui, sans-serif`,
              }}
            >
              Heading in {selectedFont}
            </p>

            <p
              className="text-base truncate"
              style={{
                fontFamily: `"${pairing.secondary}", system-ui, sans-serif`,
              }}
            >
              Body text in {pairing.secondary}. This demonstrates how the fonts
              work together in a typical layout with headings and body text.
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
  );
};

export default FontPairingCard;
