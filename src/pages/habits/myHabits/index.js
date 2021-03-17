import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHabitsThunk } from "../../../store/modules/getHabits/thunk";
import { StyledContainer, StyledContentBox } from "./styles";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HabitCard from "../../../components/HabitCard";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";

const useStyles = makeStyles({
  root: {
    background: "#23B5B5",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
    color: "black",
    padding: "0 30px",
    width: "250px",
    height: "62px",
    display: "block",
    margin: "0 auto",
    gridColumnStart: "1",
    gridColumnEnd: "3",
  },
});

const MyHabits = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [token, setToken] = useState(() => {
    return JSON.parse(localStorage.getItem("token")) || "";
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const getHabits = useSelector((state) => state.getHabits);

  useEffect(() => {
    dispatch(getHabitsThunk(token));
  }, []);

  const handleCategoryFilter = (elem, value) => {
    if (value !== "all") {
      return elem.category === value;
    } else {
      return elem;
    }
  };

  const handleStatusFilter = (elem, value) => {
    if (value === "all") {
      return elem;
    } else if (value === "in progress") {
      return elem.achieved === false;
    } else {
      return elem.achieved === true;
    }
  };

  const isUpgradeableFunction = (arr) => {
    const today = format(new Date(), "dd/MM/yyyy");

    const isUpdate = arr.filter((elem) => elem === today).length > 0;

    if (isUpdate) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <StyledContainer>
      <StyledContentBox>
        <header>
          <p>Habits Panel</p>
          <select
            name="status"
            id="level"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="Category"
            id="level"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option selected value="all">
              All
            </option>
            <option value="career">Career</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="study">Study</option>
          </select>
        </header>
        <main>
          {getHabits &&
            getHabits
              .sort(function (a, b) {
                return a.updates.length < b.updates.length
                  ? -1
                  : a.updates.length > b.updates.length
                  ? 1
                  : 0;
              })
              .filter(
                (elem) =>
                  handleCategoryFilter(elem, filterCategory) &&
                  handleStatusFilter(elem, filterStatus)
              )
              .map((elem, index) => (
                <HabitCard
                  key={index}
                  habit={elem}
                  token={token}
                  updates={isUpgradeableFunction(elem.updates)}
                />
              ))}
        </main>
      </StyledContentBox>

      <Button
        onClick={() => history.push("/register-habit")}
        className={classes.root}
        color="primary"
        variant="contained"
      >
        Create Habit
      </Button>
    </StyledContainer>
  );
};

export default MyHabits;
