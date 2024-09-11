import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { database } from "./configurations/database";
import { HttpError } from "http-errors";
import studentRouter from "./routes/students/students";
import courseRouter from "./routes/courses/courses";
import Students from "./models/studentsModel/students";
import Courses from "./models/coursesModel/courses";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/students", studentRouter);
app.use("/courses", courseRouter);

database
  .sync({})
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err: HttpError) => {
    console.log(err);
  });

app.get("/", async (req: Request, res: Response) => {
  const allStudents = await Students.findAll({});
  const allCourses = await Courses.findAll({});
  return res.status(200).json({
    message: `All Data Fetched`,
    Students: allStudents,
    Courses: allCourses,
  });
});

app.listen(process.env.PORT || 3005, () => {
  console.log(`App is listening on Port ${process.env.PORT || 3005}`);
});
