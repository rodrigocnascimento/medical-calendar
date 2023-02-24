import { IconButton, Snackbar } from "@mui/material";
import React, { Fragment, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function SuccessMessage({ message, handlerOnClose }: any) {
  const [open, setOpen] = useState(true);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={6000}
        onClose={handlerOnClose}
        message={message}
        action={action}
      />
    </div>
  );
}
