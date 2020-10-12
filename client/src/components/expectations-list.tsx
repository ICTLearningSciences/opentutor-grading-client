/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import Ajv from "ajv";
import clsx from "clsx";
import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { JsonEditor } from "jsoneditor-react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HintsList from "components/hints-list";
import { LessonExpectation, Hint } from "types";
import "styles/layout.css";
import "jsoneditor-react/es/editor.min.css";

const ExpectationCard = (props: {
  classes: any;
  expectation: LessonExpectation;
  expIdx: number;
  canDelete: boolean;
  handleExpectationChange: (val: string) => void;
  handleRemoveExpectation: () => void;
  handleHintChange: (val: Hint[]) => void;
  handleAdditionalFeaturesChange: (val: any) => void;
}) => {
  const {
    classes,
    expectation,
    expIdx,
    canDelete,
    handleExpectationChange,
    handleRemoveExpectation,
    handleHintChange,
    handleAdditionalFeaturesChange,
  } = props;
  const [expanded, setExpanded] = React.useState(true);
  const editorRef = React.useRef();

  const ajv = new Ajv({ allErrors: true, verbose: true });
  const expFeatures = expectation.additionalFeatures
    ? typeof expectation.additionalFeatures == "string"
      ? JSON.parse(expectation.additionalFeatures)
      : expectation.additionalFeatures
    : {};
  console.log(`exp features: `, expFeatures);
  const json = {
    ideal: expectation.expectation,
    bad_regex: [],
    good_regex: [],
    ...expFeatures,
  };

  if (editorRef !== undefined && editorRef.current !== undefined) {
    editorRef.current.jsonEditor.set(json);
  }

  return (
    <Card id={`expectation-${expIdx}`}>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CardActions>
            <DragHandleIcon />
          </CardActions>
          <TextField
            id="edit-expectation"
            margin="normal"
            name="expectations"
            label={`Expectation ${expIdx + 1}`}
            placeholder="Add a short ideal answer for an expectation, e.g. 'Red'"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={expectation.expectation || ""}
            onChange={(e) => {
              handleExpectationChange(e.target.value);
            }}
          />
          <CardActions>
            {canDelete ? (
              <IconButton
                id="delete"
                aria-label="remove expectation"
                size="small"
                onClick={handleRemoveExpectation}
              >
                <ClearOutlinedIcon />
              </IconButton>
            ) : null}
            <IconButton
              id="expand"
              aria-label="expand expectation"
              size="small"
              aria-expanded={expanded}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
        </div>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
          <HintsList
            classes={classes}
            hints={expectation.hints}
            updateHints={handleHintChange}
          />
          <Typography variant="body2" style={{ padding: 5 }}>
            Additional Features
          </Typography>
          <JsonEditor
            ref={editorRef}
            value={json}
            ajv={ajv}
            onChange={handleAdditionalFeaturesChange}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};

const ExpectationsList = (props: {
  classes: any;
  expectations: LessonExpectation[];
  updateExpectations: (val: LessonExpectation[]) => void;
}) => {
  const { classes, expectations, updateExpectations } = props;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const startIdx = result.source.index;
    const endIdx = result.destination.index;
    const [removed] = expectations.splice(startIdx, 1);
    expectations.splice(endIdx, 0, removed);
    updateExpectations([...expectations]);
  };

  const handleExpectationChange = (val: string, idx: number) => {
    expectations[idx].expectation = val;
    updateExpectations([...expectations]);
  };

  const handleAdditionalFeaturesChange = (val: any, idx: number) => {
    expectations[idx].additionalFeatures = val;
    updateExpectations([...expectations]);
  };

  const handleAddExpectation = () => {
    expectations.push({
      expectation: "Add a short ideal answer for an expectation, e.g. 'Red'",
      hints: [
        {
          text:
            "Add a hint to help for the expectation, e.g. 'One of them starts with R'",
        },
      ],
      additionalFeatures: {},
    });
    updateExpectations([...expectations]);
  };

  const handleRemoveExpectation = (idx: number) => {
    expectations.splice(idx, 1);
    updateExpectations([...expectations]);
  };

  const handleHintChange = (val: Hint[], eIdx: number) => {
    expectations[eIdx].hints = val;
    updateExpectations([...expectations]);
  };

  return (
    <Paper elevation={0} style={{ textAlign: "left" }}>
      <Typography variant="body2" style={{ padding: 15 }}>
        Expectations
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              id="expectations"
              ref={provided.innerRef}
              className={
                snapshot.isDraggingOver ? classes.listDragging : classes.list
              }
            >
              {expectations.map((exp, i) => (
                <Draggable
                  key={`expectation-${i}`}
                  draggableId={`expectation-${i}`}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ExpectationCard
                        classes={classes}
                        expectation={exp}
                        expIdx={i}
                        canDelete={expectations.length > 1}
                        handleExpectationChange={(val: string) => {
                          handleExpectationChange(val, i);
                        }}
                        handleRemoveExpectation={() => {
                          handleRemoveExpectation(i);
                        }}
                        handleHintChange={(val: Hint[]) => {
                          handleHintChange(val, i);
                        }}
                        handleAdditionalFeaturesChange={(val: any) => {
                          handleAdditionalFeaturesChange(val, i);
                        }}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        id="add-expectation"
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleAddExpectation}
      >
        Add Expectation
      </Button>
    </Paper>
  );
};

export default ExpectationsList;
