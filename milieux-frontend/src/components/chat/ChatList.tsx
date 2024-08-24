import { z } from "zod";
import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import UserSchema from "@/schemas/userSchema";
import ChatSchema from "@/schemas/chatSchema";

export const ChatList = ({
  selectedUser,
  chatList,
  loggedInUser,
}: {
  selectedUser: z.infer<typeof UserSchema> | null;
  chatList: z.infer<typeof ChatSchema>[];
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {selectedUser && (
        <div className="flex items-center gap-3 p-3 mb-2 bg-slate-100 rounded-lg shadow hover:bg-indigo-50 cursor-pointer">
          <Avatar className="rounded-full p-1 items-center justify-center cursor-pointer">
            <AvatarImage
              src={selectedUser.dp as string}
              className="rounded-full"
            />
            <AvatarFallback className="text-4xl text-gray-500">
              <AvatarIcon />
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{selectedUser.name}</h4>
            <p className="text-sm text-gray-600">{"last message"}</p>
          </div>
        </div>
      )}

      {chatList &&
        chatList.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-3 p-3 mb-2 bg-slate-100 rounded-lg shadow hover:bg-indigo-50 cursor-pointer"
          >
            <Avatar className="rounded-full p-1 items-center justify-center cursor-pointer">
              <AvatarImage
                src={
                  chat.users?.find((user) => user !== loggedInUser)
                    ?.dp as string
                }
                className="rounded-full"
              />
              <AvatarFallback className="text-4xl text-gray-500">
                <AvatarIcon />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">
                {chat.users?.find((user) => user !== loggedInUser)?.name}
              </h4>
              <p className="text-sm text-gray-600">{chat.lastText}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
