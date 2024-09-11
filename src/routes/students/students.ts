import { Router } from "express";
import { registerStudent } from "../../controllers/students/studentEnroll";
import { studentLogin } from "../../controllers/students/studentLogin";
import { authoriser } from "../../middlewares/authorization";
import { getStudentProfile } from "../../controllers/students/getStudentProfile";


const router = Router()

router.post('/enroll', registerStudent)
router.post('/login', studentLogin)
router.get('/profile', authoriser, getStudentProfile)

export default router