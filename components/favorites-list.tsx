import { ArrowRight, Heart, Share2, Trash2, Undo } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { shareUrl } from "@/lib/functions";
import { useToast } from "@/hooks/use-toast";
import { FavoritePairing, FontPairing } from "@/types";
import { useRouter } from "next/navigation";
interface FavoriteListProps{
    favoritesOpen:boolean
    fontPairings:FontPairing[];
    setFavorites:Dispatch<SetStateAction<FavoritePairing[]>>
    setFavoritesOpen:Dispatch<SetStateAction<boolean>>
    favorites:FavoritePairing[];
    setSelectedFont:Dispatch<SetStateAction<string>>;
    setSelectedPairingIndex:Dispatch<SetStateAction<number|null>>;
}
const FavoritesList = ({
  favoritesOpen,
  fontPairings,
  setFavorites,
  setFavoritesOpen,
  favorites,
  setSelectedFont,
  setSelectedPairingIndex,
}:FavoriteListProps) => {
  const { toast } = useToast();
  const router = useRouter();
  // Remove a pairing from favorites
  const removeFromFavorites = (primary: string, secondary: string) => {
    const currentFavorites = [...favorites];

    // Remove the item
    const newFavorites:FavoritePairing[] = favorites.filter(
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
  return (
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
                Click the heart icon on any font pairing to save it here.
              </p>
            </div>
          ) : (
            favorites.map((favorite, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white ">
                <div className="flex justify-between items-start px-4 ">
                  <div className="w-full">
                    <h3 className="font-medium truncate">
                      {favorite.primary} + {favorite.secondary}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // Set the selected font and find the pairing
                              setSelectedFont(favorite.primary);
                              const fontObj = fontPairings?.find(
                                (f) => f.primary === favorite.primary
                              );
                              if (fontObj) {
                                const pairingIndex = fontObj.pairings.findIndex(
                                  (p) => p.secondary === favorite.secondary
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
                            <span className="sr-only">View pairing</span>
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
                                favorite.secondary,
                                toast,
                                router
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
                    Body text in {favorite.secondary}. This demonstrates how the
                    fonts work together.
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {favorite.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full truncate"
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
  );
};


export default FavoritesList;