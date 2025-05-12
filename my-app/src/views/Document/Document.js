import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowBack from "@material-ui/icons/ArrowBack";

import Submit from "./DocumentLogic";
import "./Document.css";

const useStyles = makeStyles((theme) => ({
  submit: {
    display: "block",
    margin: theme.spacing(8, "auto", 2, "auto"),
    fontSize: "16px",
    width: "220px",
    padding: "10px 0",
  },
  backButton: {
    float: "left",
  },
  deleteButton: {
    margin: theme.spacing(0, 0, 0, 2),
  },
}));

function Documents() {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [noDoc, setNoDoc] = useState(true);

  const {
    open,
    selectedText,
    myArray,
    documentName,
    documentBody,
    setMyArray,
    setDocumentName,
    setDocumentBody,
    handleClose,
    textSelected,
    submitComment,
    deleteComment,
    handleCommentChange,
    goBackToDocumentsList,
    updateDocument,
  } = Submit();

  useEffect(() => {
    const document = JSON.parse(localStorage.getItem("document"));
    if (document) {
      setMyArray(document.comments);
      setDocumentName(document.name);
      setDocumentBody(document.content);
      setNoDoc(false);
    }
  }, [setDocumentBody, setDocumentName, setMyArray]);

  const Highlighter = ({ children }) => {
    const str = myArray.map((item) => item.text).join("|");
    const parts = children.split(new RegExp(`(${str})`, "gi"));

    return (
      <p
        onMouseUp={(e) => textSelected(e)}
        id="interactiveText"
        className="document-content"
      >
        {parts.map((part, i) => {
          const matchedObject = myArray.find((obj) => obj.text === part);
          return (
            <React.Fragment key={i}>
              {i % 2 !== 0 && matchedObject ? (
                <Tooltip
                  interactive
                  title={
                    <React.Fragment>
                      <Typography color="inherit">
                        {matchedObject.comment}
                        <IconButton
                          className={classes.deleteButton}
                          color="secondary"
                          onClick={() => deleteComment(part)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <span style={{ background: "yellow" }}>{part}</span>
                </Tooltip>
              ) : (
                <span>{part}</span>
              )}
            </React.Fragment>
          );
        })}
      </p>
    );
  };

  return (
    <Container component="main" maxWidth="md">
      {!noDoc ? (
        <React.Fragment>
          <CssBaseline />
          <div>
            <IconButton
              onClick={goBackToDocumentsList}
              aria-label="back"
              className={classes.backButton}
              size="small"
            >
              <ArrowBack fontSize="large" />
            </IconButton>
            <h1 className="document-title">{documentName}</h1>
          </div>

          <hr />
          <Highlighter>{documentBody}</Highlighter>

          {myArray.length !== 0 && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={updateDocument}
            >
              Save Document
            </Button>
          )}

          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Add Comment"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{selectedText}</DialogContentText>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="comment"
                label="Add Comment"
                name="comment"
                autoFocus
                onChange={handleCommentChange}
              />
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                Close
              </Button>
              <Button onClick={submitComment} color="primary" autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      ) : (
        <h3 className="document-title">
          No Document Selected. Go back to the Documents List page.
        </h3>
      )}
    </Container>
  );
}

export default Documents;