import { JwtPayload } from "jsonwebtoken";
import {Request, Response} from 'express';
import { axiosgetExternalCourseDetails } from "../../utilities/helpers";

export const getExternalCourseDetails = async(req:JwtPayload, res:Response)=>{
    try{
        const course_code = req.params.course_code
        const courseFinder = await axiosgetExternalCourseDetails(course_code)
        if(courseFinder === 'not found') return res.status(404).json({status: `error`, message: `Course not found`})
        const courseData = courseFinder.data
        return res.status(200).json({status: `success`, data: courseData})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message: `Internal Server Error`})
    }
}