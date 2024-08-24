import AvatarIcon from "../icons/AvatarIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

type Message = {
  id: number;
  sender: "user" | "recipient";
  text: string;
};

const mockMessages: Message[] = [
  { id: 1, sender: "recipient", text: "Hello there!" },
  { id: 2, sender: "user", text: "Hi, how are you?" },
];

export const MessageBox = () => {
  return (
    <>
      <div className="flex items-center justify-start gap-3 p-4 border-b border-indigo-200 bg-indigo-100 mb-2">
        <Avatar className="rounded-full bg-gray-200 p-1 items-center justify-center cursor-pointer">
          <AvatarImage />
          <AvatarFallback className="text-5xl text-gray-500">
            <AvatarIcon />
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-slate-800 cursor-pointer">User Name</p>
      </div>

      <div className="p-4 flex-grow bg-indigo-50 overflow-y-auto">
        {mockMessages.map((message) => (
          <div className="flex items-center gap-3" key={message.id}>
            {message.sender === "recipient" && (
              <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                <AvatarImage />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`mb-2 p-2 max-w-xs ${
                message.sender === "user"
                  ? "bg-indigo-500 text-white ml-auto rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              } rounded-lg`}
            >
              {message.text}
            </div>
            {message.sender === "user" && (
              <Avatar className="rounded-full bg-gray-200 w-8 h-8 items-center justify-center cursor-pointer">
                <AvatarImage />
                <AvatarFallback className="text-4xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
