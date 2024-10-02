import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/AlertDialog";

const ConfirmationDialog = ({
  onConfirm,
  confirmationText,
  dialogButton,
}: {
  onConfirm: () => void;
  confirmationText: string;
  dialogButton: JSX.Element;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{dialogButton}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-center justify-center">
            {confirmationText}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Confirm
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
