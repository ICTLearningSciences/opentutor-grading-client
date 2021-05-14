/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { useCookies } from "react-cookie";
import { login } from "api";
import { User, UserAccessToken } from "types";

type ContextType = {
  user: User | undefined;
  showGraded: boolean;
  onlyCreator: boolean;
  toggleGraded: () => void;
  toggleCreator: () => void;
};

const SessionContext = React.createContext<ContextType>({
  user: undefined,
  showGraded: false,
  onlyCreator: false,
  // eslint-disable-next-line
  toggleGraded: () => {},
  // eslint-disable-next-line
  toggleCreator: () => {},
});

function SessionProvider(props: { children?: React.ReactNode }): JSX.Element {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [user, setUser] = React.useState<User>();
  const [showGraded, setShowGraded] = React.useState(false);
  const [onlyCreator, setOnlyCreator] = React.useState(
    cookies.accessToken || cookies.user ? true : false
  );

  React.useEffect(() => {
    if (!cookies.accessToken) {
      setUser(undefined);
    } else if (!user) {
      login(cookies.accessToken)
        .then((token: UserAccessToken) => {
          setUser(token.user);
          setCookie("accessToken", token.accessToken, { path: "/" });
        })
        .catch((err) => {
          console.error(err);
          removeCookie("accessToken", { path: "/" });
        });
    }
  }, [cookies]);

  function toggleGraded(): void {
    setShowGraded(!showGraded);
  }

  function toggleCreator(): void {
    setOnlyCreator(!onlyCreator);
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        showGraded,
        toggleGraded,
        onlyCreator,
        toggleCreator,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export default SessionContext;
export { SessionProvider };
