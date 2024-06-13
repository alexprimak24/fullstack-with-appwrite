import React, { useEffect, useState } from "react";
import { UseSelector, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { ButtonSpinner } from "../shared/Spinner";

interface ProtectedProps {
  children?: React.ReactNode;
  authentication: boolean;
}

function Protected({ children, authentication = true }: ProtectedProps) {
  const authStatus = useSelector((state: RootState) => state.auth.status);

  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    //page authentication - require authentication,
    //but you are not authenticated authStatus !== authentication
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    }
    //in case you are logged in, logically you don't need to see
    //login and signup page
    //page !authentication - doesn't require authentication,
    //but you are authenticated authStatus !== authentication
    else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, authentication, navigate]);

  return loader ? <ButtonSpinner /> : <>{children}</>;
}

export default Protected;

//page require auth but you are not auth, logically you should go to login
// if (true) {
//   if (false) {
//     navigator("/login");
//   }
// }
