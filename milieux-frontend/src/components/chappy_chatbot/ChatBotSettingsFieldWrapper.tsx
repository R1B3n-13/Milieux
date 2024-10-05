import { ChatBotContextProvider } from "./ChatBotContextProvider";
import PdfSubmissionField from "./PdfSubmissionField";

const ChatBotSettingsFieldWrapper = ({
  userId,
}: {
  userId: number | null | undefined;
}) => {
  return (
    <ChatBotContextProvider>
      <PdfSubmissionField userId={userId} />
    </ChatBotContextProvider>
  );
};

export default ChatBotSettingsFieldWrapper;
