import { Router } from "express";
import { registerStudent } from "../../controllers/students/studentEnroll";
import { studentLogin } from "../../controllers/students/studentLogin";
import { authoriser } from "../../middlewares/authorization";
import { getAllCourses } from "../../controllers/courses/getAllCourses";
import { getExternalCourseDetails } from "../../controllers/courses/getExternalCourseDetails";
import { registerACourse } from "../../controllers/courses/registerACourse";
import { getStudentEnrolledCourses } from "../../controllers/courses/getStudentCourses";
import { getStudentCourseDetails } from "../../controllers/courses/getStudentCourseDetails";
import { markAsCompleted } from "../../controllers/courses/markCourseCompleted";
import { getStudentCompletedCourses } from "../../controllers/courses/getCompletedCourses";
import { getStudentUncompletedCourses } from "../../controllers/courses/getUncompletedCourses";


const router = Router()

router.get('/all_courses', authoriser, getAllCourses)
router.get('/single_course/:course_code', authoriser, getExternalCourseDetails)
router.post('/register_course/:course_code', authoriser, registerACourse)
router.get('/student_courses', authoriser, getStudentEnrolledCourses)
router.get('/single_student_course/:course_code', authoriser, getStudentCourseDetails)
router.patch('/mark_completed/:course_code', authoriser, markAsCompleted)
router.get('/completed_courses', authoriser, getStudentCompletedCourses)
router.get('/uncompleted_courses', authoriser, getStudentUncompletedCourses)


export default router