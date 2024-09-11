import {JwtPayload} from 'jsonwebtoken';
import {Request, Response} from 'express';
import { axiosgetExternalCourseDetails } from '../../utilities/helpers';
import Courses, { CourseAttributes } from '../../models/coursesModel/courses';
import { Op } from 'sequelize';
import Students, { StudentAttributes } from '../../models/studentsModel/students';

export const registerACourse = async (req: JwtPayload, res: Response) => {
    try {
        const studentRegNo = req.user.reg_no
        const course_code = req.params.course_code
        const student = await Students.findOne({where: {reg_no:studentRegNo}}) as unknown as StudentAttributes
        const courseFinder = await axiosgetExternalCourseDetails(course_code)
        if (courseFinder === 'not found') {
            return res.status(404).json({ status: 'error', message: 'Course not found' });
        }
        if(courseFinder.enrollment_status==='closed') return res.status(400).json({status: `error`, message: `Enrollment has closed`})
        
        const enrolledCourse = await Courses.findOne({
            where: {
                course_code: course_code,
                student_regNo: studentRegNo
            }
        }) as unknown as CourseAttributes;
        
        if (enrolledCourse) return res.status(404).json({ status: 'error', message: 'You are already enrolled for this course' });
        const studentDetails = {
            reg_no: studentRegNo,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email
        }
  courseFinder.data.students.push(studentDetails)
  const newCourse = await Courses.create({
    ...courseFinder.data,
    student_regNo: studentRegNo,
    isRegistered: true,
    isCompleted: false
  })
  
  await newCourse.save()

  const confirmRegistration = await Courses.findOne({where: {course_code, student_regNo:studentRegNo}}) as unknown as CourseAttributes
  if(!confirmRegistration) return res.status(400).json({status: `error`, message: `Unable to register`})
  return res.status(200).json({ status: 'success', data: newCourse, message: `You have successfully enrolled for this course` });
} catch (err:any) {
  console.log(err.message);
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
}
};