import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const ButtonSpinner = () => (
  <CircularProgress
    style={{
      margin: "2px",
      height: "14px",
      width: "14px",
      color: "#50C878",
    }}
  />
);
