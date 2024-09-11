import { JwtPayload } from "jsonwebtoken";
import {Request, Response} from 'express';
import { axiosgetExternalCourseDetails } from "../../utilities/helpers";
import Courses from "../../models/coursesModel/courses";

export const getStudentCourseDetails = async(req:JwtPayload, res:Response)=>{
    try{
        const reg_no = req.user.reg_no
        const course_code = req.params.course_code
        const courseFinder = await Courses.findOne({where: {course_code, student_regNo:reg_no}})
        if(!courseFinder) return res.status(404).json({status: `error`, message: `Course not found`})
        return res.status(200).json({status: `success`, data: courseFinder})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message: `Internal Server Error`})
    }
}