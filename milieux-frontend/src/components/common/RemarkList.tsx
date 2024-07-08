// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogHeader,
// } from "../ui/Dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
// import AvatarIcon from "../icons/AvatarIcon";
// import { z } from "zod";
// import UserSchema from "@/schemas/userSchema";

// const RemarkList = ({
//   dialogButton,
//   postId,
// }: {
//   dialogButton: JSX.Element;
//   postId: number;
// }) => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>{dialogButton}</DialogTrigger>
//       <DialogContent className="w-full min-h-36">
//         <DialogHeader>
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <DialogTitle className="text-sm text-gray-500 font-normal">
//               See the remarks of the post
//             </DialogTitle>
//           </div>
//         </DialogHeader>
//         <div className="flex flex-col">
//           {comments &&
//             comments.map((user: z.infer<typeof UserSchema>) => (
//               <div key={user.id}>
//                 <div className="flex items-center gap-3">
//                   <div className="cursor-pointer">
//                     <Avatar>
//                       <AvatarImage />
//                       <AvatarFallback className="text-3xl text-gray-500">
//                         <AvatarIcon />
//                       </AvatarFallback>
//                     </Avatar>
//                   </div>
//                   <p className="cursor-pointer">{user.name}</p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RemarkList;
