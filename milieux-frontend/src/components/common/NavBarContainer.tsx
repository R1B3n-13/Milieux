import React from "react";
import NavBar from "./NavBar";
import { getUserFromAuthToken } from "@/services/userService";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";

const NavBarContainer = async () => {
  const loggedInUserResponse = await getUserFromAuthToken();

  let loggedInUser: z.infer<typeof UserSchema> = {};

  if (loggedInUserResponse.success) {
    loggedInUser = loggedInUserResponse.user;
  }

  return <NavBar loggedInUser={loggedInUser} />;
};

export default NavBarContainer;
