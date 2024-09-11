import { JwtPayload } from "jsonwebtoken";
import {Request, Response} from 'express';
import Courses, { CourseAttributes } from "../../models/coursesModel/courses";

export const getStudentUncompletedCourses = async(req:JwtPayload, res:Response)=>{
    try{
        const page = Number.parseInt(req.query.page) - 1 || 0;
        const limit = Number.parseInt(req.query.limit) || 5;

        const reg_no = req.user.reg_no;

        const offset = page * limit;

        const courseFinder:any = await Courses.findAndCountAll({
            where: {
                student_regNo: reg_no,
                isCompleted: false,
            },
            limit: limit,
            offset: offset
        }) as unknown as CourseAttributes;
   
        if(!courseFinder) return res.status(404).json({status: `error`, message: `No courses found`})
        if(courseFinder.length===0)return res.status(200).json({status: `success`, message: `No uncompleted courses`})
        return res.status(200).json({status: `success`, data: courseFinder})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message: `Internal Server Error`})
    }
}