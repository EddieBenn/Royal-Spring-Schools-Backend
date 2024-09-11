import express, {Request, Response} from 'express';
import Students, { StudentAttributes } from '../../models/studentsModel/students';
import { GenerateSignature, axiosVerifyStudent, checkPassword, hashPassword, isValidRegistration, passWordGenerator } from '../../utilities/helpers';
import { emailHtml, sendmail } from '../../utilities/notification';
import jwt from 'jsonwebtoken';

export const studentLogin = async (req:Request, res:Response) => {
    try{
        const {reg_no, password} = req.body
        if (!isValidRegistration(reg_no)) {
          return res.status(400).json({status: `error`, message: `Invalid Registration Number`})
        }
        const findStudent:any = await Students.findOne({where: {reg_no}}) as unknown as StudentAttributes
        if(!findStudent) return res.status(404).json({status: `error`, message: `Student not added to the portal, please register`})
        const validated = await checkPassword(password, findStudent.password);
      if (!validated) {
        return res.status(401).send({
          status: "error",
          message: "Password is incorrect",
        });
      }
      const payload = {
        id: findStudent.id,
        reg_no: findStudent.reg_no,
        email:findStudent.email
      }
      const token = await GenerateSignature(payload)
      return res.status(200).json({
        status: "success",
        message: "Login Successful",
        data: findStudent,
        token,
      });
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({status: `error`, message:`Internl Server Error`})
    }
}