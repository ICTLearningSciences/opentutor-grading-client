import React from "react";
import { Link } from "@reach/router";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Button,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "styles/layout.css";
import withLocation from "wrap-with-location";
import { Lesson } from "types";
import { fetchLesson, updateLesson } from "api";
import LessonsPage from "./lessons";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "100ch",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  container: {
    maxHeight: 440,
  },
});

const LessonEdit = ({ search }: { search: any }) => {
  const { lessonId } = search;
  const classes = useStyles();
  const inititialLesson = {
    id: "",
    lessonId: "",
    name: "",
    intro: "",
    question: "",
    conclusion: "",
    expectations: [
      {
        expectation: "",
        hints: [{ text: "" }],
      },
    ],
    createdAt: 0,
    updatedAt: 0,
  };

  const [lesson, setLesson] = React.useState<Lesson>(inititialLesson);
  const [updated, setUpdated] = React.useState<Lesson>(inititialLesson);
  const [copyLesson, setCopyLesson] = React.useState<Lesson>(inititialLesson);
  const [change, setChange] = React.useState(false);

  React.useEffect(() => {
    fetchLesson(lessonId)
      .then((lesson: Lesson) => {
        console.log("fetchLesson got", lesson);
        if (lesson !== undefined) {
          setCopyLesson(lesson);
          setLesson(lesson);
        }
      })
      .catch((err: any) => console.error(err));
    return;
  }, []);

  function handleLessonNameChange(name: string) {
    setChange(true);
    setLesson({ ...lesson, name: name });
  }

  function handleIntroChange(intro: string) {
    setChange(true);
    setLesson({ ...lesson, intro: intro });
  }

  function handleQuestionChange(question: string) {
    setChange(true);
    setLesson({ ...lesson, question: question });
  }

  function handleConclusionChange(conclusion: string) {
    setChange(true);
    setLesson({ ...lesson, conclusion: conclusion });
  }

  function handleExpectationChange(exp: string, index: number) {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    let newExpectation = { ...copyExpectations[index] };
    newExpectation.expectation = exp;
    copyExpectations[index] = newExpectation;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleHintChange(hnt: string, eIndex: number, hIndex: number) {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    const copyHints = [...copyExpectations[eIndex].hints] as Array<any>;
    let newHint = { ...copyHints[hIndex] };
    newHint.text = hnt;
    copyHints[hIndex] = newHint;
    copyExpectations[eIndex].hints[hIndex] = newHint;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRevert() {
    setChange(false);
    setLesson(copyLesson);
  }

  function handleSave() {
    const converted = encodeURI(JSON.stringify(lesson));
    console.log("converted", converted);
    updateLesson(lesson.lessonId, converted)
      .then((updated) => {
        console.log(`fetchUpdateLesson got`, updated);
        if (updated !== undefined) {
          setUpdated(updated);
        }
        setCopyLesson(updated);
        setLesson(updated);
      })
      .catch((err) => console.error(err));
  }

  function handleAddExpectation() {
    setChange(true);
    const copyLesson = { ...lesson };
    const copyExpectations = [...copyLesson.expectations] as Array<any>;
    copyExpectations.push({
      expectation: "",
      hints: [{ text: "" }],
    });
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRemoveExpectation(exp: string) {
    setChange(true);
    const copyLesson = { ...lesson };
    let copyExpectations = [...copyLesson.expectations] as Array<any>;
    copyExpectations = copyExpectations.filter(
      (expectations) => expectations.expectation !== exp
    );
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleAddHint(index: number) {
    setChange(true);
    console.log("Add Hint");
    const copyLesson = { ...lesson };
    let copyExpectations = [...copyLesson.expectations] as Array<any>;
    let copyHints = [...copyLesson.expectations[index].hints] as Array<any>;
    copyHints.push({ text: "" });
    copyExpectations[index].hints = copyHints;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  function handleRemoveHint(eIdx: number, hint: string) {
    setChange(true);
    console.log("Remove Hint");
    const copyLesson = { ...lesson };
    let copyExpectations = [...copyLesson.expectations] as Array<any>;
    let copyHints = [...copyLesson.expectations[eIdx].hints] as Array<any>;
    copyHints = copyHints.filter((hints) => hints.text !== hint);
    copyExpectations[eIdx].hints = copyHints;
    setLesson({ ...lesson, expectations: copyExpectations });
  }

  return (
    <div>
      <div id="header">Edit</div>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="lesson-name"
            key="lesson-name"
            label="Lesson Name"
            value={lesson.name ? lesson.name : ""}
            onChange={(e) => {
              handleLessonNameChange(e.target.value);
            }}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            id="intro"
            key="intro"
            label="Intro"
            value={lesson.intro ? lesson.intro : ""}
            onChange={(e) => {
              handleIntroChange(e.target.value);
            }}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            id="question"
            key="question"
            label="Question"
            value={lesson.question ? lesson.question : ""}
            onChange={(e) => {
              handleQuestionChange(e.target.value);
            }}
            variant="outlined"
          />
        </div>
        <div className={classes.root}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>Expectations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div id="add-expectaion">
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    // startIcon={<RemoveIcon />}
                    onClick={handleAddExpectation}
                  >
                    Add Expectation
                  </Button>
                </div>
                {lesson?.expectations.map((expecation, i) => {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <div>
                          <TextField
                            margin="normal"
                            name="expectations"
                            id={`expectation-${i}`}
                            key={`expectation-${i}`}
                            label={`Expectation ${i + 1}`}
                            value={
                              expecation.expectation
                                ? expecation.expectation
                                : ""
                            }
                            onChange={(e) => {
                              handleExpectationChange(e.target.value, i);
                            }}
                            variant="outlined"
                            fullWidth
                          />
                          <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            // startIcon={<RemoveIcon />}
                            onClick={(e) => {
                              handleRemoveExpectation(expecation.expectation);
                            }}
                          >
                            Remove Expectation
                          </Button>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                          >
                            <Typography className={classes.heading}>
                              Hints
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div>
                              <div id="add-hint">
                                <Button
                                  variant="contained"
                                  color="default"
                                  className={classes.button}
                                  // startIcon={<AddIcon />}
                                  onClick={(e) => {
                                    handleAddHint(i);
                                  }}
                                >
                                  Add Hint
                                </Button>
                              </div>
                              {expecation.hints.map((hint, j) => {
                                return (
                                  <div>
                                    <TextField
                                      margin="normal"
                                      id={`hint-${j}`}
                                      key={`hint-${j}`}
                                      label={`Hint ${j + 1}`}
                                      value={hint.text ? hint.text : ""}
                                      onChange={(e) => {
                                        handleHintChange(e.target.value, i, j);
                                      }}
                                      variant="outlined"
                                    />
                                    <Button
                                      variant="contained"
                                      color="default"
                                      className={classes.button}
                                      // startIcon={<AddIcon />}
                                      onClick={(e) => {
                                        handleRemoveHint(i, hint.text);
                                      }}
                                    >
                                      Remove Hint
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <TextField
            id="conclusion"
            key="conclusion"
            label="Conclusion"
            value={lesson.conclusion ? lesson.conclusion : ""}
            onChange={(e) => {
              handleConclusionChange(e.target.value);
            }}
            variant="outlined"
          />
        </div>
      </form>

      <div id="save-button">
        {change ? <Button onClick={handleSave}>Save</Button> : null}
      </div>
      <div id="save-button">
        {/* {change ? <Button onClick={handleRevert}>Revert</Button> : null} */}
      </div>
    </div>
  );
};

const EditPage = ({ path, search }: { path: string; search: any }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <LessonEdit search={search} />
    </MuiThemeProvider>
  );
};

export default withLocation(EditPage);