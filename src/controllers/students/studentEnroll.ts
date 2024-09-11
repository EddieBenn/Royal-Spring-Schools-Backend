import express, {Request, Response} from 'express';
import Students from '../../models/studentsModel/students';
import {v4} from 'uuid'
import { axiosVerifyStudent, hashPassword, isValidRegistration, passWordGenerator } from '../../utilities/helpers';
import { emailHtml, sendmail } from '../../utilities/notification';


export const registerStudent = async (req:Request, res:Response) => {
    try{
        const {reg_no} = req.body
        if (!isValidRegistration(reg_no)) {
            return res.status(400).json({status: `error`, message: `Invalid Registration Number`})
          }
        const checkStudent = await Students.findOne({where: {reg_no}})
        if(checkStudent) return res.status(400).json({status: `error`, message: `Student ${reg_no} already registered, please login`})
        const confirmStudent = await axiosVerifyStudent(reg_no)
    
    if(confirmStudent === 'not found') return res.status(404).json({status: `error`, message: `${reg_no} does not exist, contact the Student Affairs Unit`})
        const studentData = confirmStudent.data

    let password = passWordGenerator(studentData.lastName)
    let emailData = emailHtml(studentData.reg_no, password)
    await sendmail(studentData.email, emailData)
    let passwordHash = await hashPassword(password)

    const createStudent = await Students.create({
        id: studentData.id,
        reg_no: studentData.reg_no,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        year: studentData.year,
        faculty: studentData.faculty,
        department: studentData.department,
        email: studentData.email,
        password: passwordHash,
        student_image: studentData.student_image
    })

    await createStudent.save()

    const findStudent = await Students.findOne({where: {reg_no}})
    if(!findStudent) return res.status(400).json({status: `error`, message: `Unable to create`})

    return res.status(200).json({status: `success`, data: findStudent, message: `Enrolment Successful, Your login details have been sent to your mail: ${studentData.email}`})
    }catch(error:any){
        console.log(error.message)
        return res.status(500).json({message: `Internal Server Error`})
    }
}