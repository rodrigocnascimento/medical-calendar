import { Button, IconButton, Snackbar, Alert, Typography, Box } from "@mui/material";

import React, { Fragment, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export type TDeleteConfirmation = {
  message: string;
  onConfirmation: {
    title: string;
    fn: () => void;
  };
  onCancelation?: {
    title: string;
    fn: () => void;
  };
  onFinally: () => void;
};

/**
 * A component to display a Delete Confirmation Snackbar.
 * The esiaest way is to create a `useState<TDeleteConfirmation>()` on your caller component.
 * A suggestion: `const [deleteConfirmation, setDeleteConfirmation] = useState<TDeleteConfirmation>();`
 *
 * @param {string} message A message to be displayed
 * @param {TDeleteConfirmation['onConfirmation']} onConfirmation.title A message to be displayed on onConfirmation callback button
 * @param {TDeleteConfirmation['onConfirmation']} onConfirmation.fn The callback that will be executed on onConfirmation callback
 * @param {TDeleteConfirmation['onCancelation']} onCancelation.title A message to be displayed on onCancelation callback button
 * @param {TDeleteConfirmation['onCancelation']} onCancelation.fn The callback that will be executed on onCancelation callback
 * @param {TDeleteConfirmation['onFinally']} onFinally The last and mandatory callback. Generally used to clear the `useState<TDeleteConfirmation>()` on the caller compoenent.
 * @returns {JSX.Element} The DeleteConfirmation MUI React component
 */
export function DeleteConfirmation({
  message,
  onConfirmation: { title: onConfirmationTitle, fn: onConfirmationFn },
  onCancelation,
  onFinally,
}: TDeleteConfirmation): JSX.Element {
  const [open, setOpen] = useState(true);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    onFinally();
  };

  const onCloseAction = (
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
        action={onCloseAction}
      >
        <Alert onClose={handleClose} severity="warning">
          <Typography variant="h6">{message}</Typography>
          <div>
            <Box
              m={1}
              display="flex"
              justifyContent={onCancelation ? "space-between" : "flex-end"}
              alignItems={onCancelation ? "center" : "flex-end"}
            >
              {onCancelation && (
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    onCancelation && onCancelation.fn();
                    handleClose(e);
                  }}
                >
                  {onCancelation && onCancelation.title}
                </Button>
              )}
              <Button
                color="warning"
                size="small"
                variant="contained"
                onClick={(e) => {
                  onConfirmationFn();
                  handleClose(e);
                }}
              >
                {onConfirmationTitle}
              </Button>
            </Box>
          </div>
        </Alert>
      </Snackbar>
    </div>
  );
}
