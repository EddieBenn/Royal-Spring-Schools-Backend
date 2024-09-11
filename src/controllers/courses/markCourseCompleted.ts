import {Request, Response} from 'express';
import {JwtPayload} from 'jsonwebtoken';
import { axiosgetAllCourses } from '../../utilities/helpers';
import Courses, { CourseAttributes } from '../../models/coursesModel/courses';

export const markAsCompleted = async(req:JwtPayload, res:Response)=>{
    try{
        const reg_no = req.user.reg_no
        const course_code = req.params.course_code
        const courseFinder = await Courses.findOne({where: {course_code, student_regNo:reg_no}}) as unknown as CourseAttributes
        if(!courseFinder) return res.status(404).json({status: `error`, message: `Course not found`})
        if(courseFinder.isCompleted === true) return res.status(400).json({status: `error`, message: `You have already completed this course`})
        await Courses.update(
            { isCompleted: true },
            {
              where: { course_code, student_regNo: reg_no },
            }
          );
          const updatedCourse = await Courses.findOne({
            where: { course_code, student_regNo: reg_no },
          }) as unknown as CourseAttributes;
        return res.status(200).json({status: `success`, data: updatedCourse, message: `Successfully Completed`})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message: `Internal Server Error`})
    }
}