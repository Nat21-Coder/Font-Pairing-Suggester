import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  generateCssCode,
  generateHtmlSnippet,
  generateReactSnippet,
  handleCopyToClipboard,
} from "@/lib/functions";
import { Dispatch, SetStateAction } from "react";
import { Pairing } from "@/types";
interface CodeDialogProps{
codeDialogOpen:boolean;
  setCodeDialogOpen:Dispatch<SetStateAction<boolean>>;
  selectedFont:string
  selectedPairing:Pairing|null;
}
const CodeDialog = ({
  codeDialogOpen,
  setCodeDialogOpen,
  selectedFont,
  selectedPairing
}:CodeDialogProps) => {
  const { toast } = useToast();

  return (
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
                      generateCssCode(selectedFont, selectedPairing.secondary),
                      "CSS code copied to clipboard",
                      toast
                    )
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                </Button>
              </div>
              <div className="text-sm text-gray-500 ">
                <p className="truncate">
                  This CSS imports both fonts from Google Fonts and sets up CSS
                  variables for consistent usage throughout your project.
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
                      "HTML snippet copied to clipboard",
                      toast
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
                      "React code copied to clipboard",
                      toast
                    )
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                <p className="truncate">
                  This React/Next.js implementation uses the Next.js font system
                  for optimal performance and font loading.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CodeDialog;
