import { CircularProgress, makeStyles } from "@material-ui/core";
import { userIsElevated } from "api";
import NavBar from "components/nav-bar";
import SessionContext from "context/session";
import { useContext } from "react";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  container: {
    flexGrow: 1,
  },
  appBar: {
    height: "10%",
    top: "auto",
    bottom: 0,
  },
  progress: {
    marginLeft: "50%",
  },
  paging: {
    position: "absolute",
    right: theme.spacing(1),
  },
}));


function TrainDefaultPage(props: { path: string }): JSX.Element {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);

  if (typeof window !== "undefined" && !cookies.accessToken) {
    return <div>Please login to view users.</div>;
  }
  if (!context.user) {
    return <CircularProgress />;
  }
  if (!userIsElevated(context.user)) {
    return (
      <div>You must be an admin or content manager to view this page.</div>
    );
  }

  return (
    <div>
      <NavBar title="Train Default Model" />
    </div>
  );
}

export default TrainDefaultPage;