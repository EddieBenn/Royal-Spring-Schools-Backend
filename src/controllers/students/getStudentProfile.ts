import {JwtPayload} from 'jsonwebtoken';
import {Request, Response} from 'express';
import Students from '../../models/studentsModel/students';

export const getStudentProfile = async(req:JwtPayload, res:Response)=>{
    try{
        const reg_no = req.user.reg_no;
        const findStudent = await Students.findOne({where: {reg_no}})
        if(!findStudent)return res.status(404).json({status: `error`, message: `Student not found`})
        return res.status(200).json({status: `success`, data: findStudent})
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message: `Internal Server Error`})
    }
}