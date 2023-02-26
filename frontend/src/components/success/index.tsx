import { IconButton, Snackbar } from "@mui/material";
import React, { Fragment, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export type TSuccessMessageProps = {
  message: string;
  handlerOnClose?: () => void;
  duration?: number;
};

export default function SuccessMessage({
  message,
  handlerOnClose,
  duration,
}: TSuccessMessageProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    handlerOnClose && handlerOnClose();
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
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
        autoHideDuration={duration || 2000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}
