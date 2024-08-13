import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../ui/Dialog";
import { ScrollArea } from "../ui/ScrollArea";

const TidbitsDialog = ({
  dialogButton,
  tidbits,
}: {
  dialogButton: JSX.Element;
  tidbits: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent className="min-w-fit min-h-36">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <DialogTitle className="text-md text-gray-500 font-normal">
              Did you know?
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-3">
          <div className="flex flex-col justify-center">
            {tidbits && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col w-[30rem] bg-muted p-3 rounded-lg">
                  <p>{tidbits}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TidbitsDialog;
