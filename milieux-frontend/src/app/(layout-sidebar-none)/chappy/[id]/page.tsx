import ChatBot from "@/components/chappy_chatbot/ChatBot";
import PdfSubmissionField from "@/components/chappy_chatbot/PdfSubmissionField";
import UserSchema from "@/schemas/userSchema";
import { getUserFromAuthToken, getUserById } from "@/services/userService";
import { z } from "zod";

const ChappyPage = async ({ params }: { params: { id: number } }) => {
  let user: z.infer<typeof UserSchema> = {};

  const loggedInUserResponse = await getUserFromAuthToken();
  const loggedInUser: z.infer<typeof UserSchema> = loggedInUserResponse.user;

  if (!params.id && loggedInUserResponse.success) {
    user = loggedInUserResponse.user;
  } else {
    const userResponse = await getUserById(params.id);
    if (userResponse.success) {
      user = userResponse.user;
    }
  }

  return (
    <div className="px-10 py-4 min-h-[94vh]">
      {user.id === loggedInUser.id && user.isBusiness && (
        <div>
          <PdfSubmissionField userId={user.id} />
        </div>
      )}
      {user.isBusiness && (
        <div className="h-[85vh]">
          <ChatBot userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default ChappyPage;