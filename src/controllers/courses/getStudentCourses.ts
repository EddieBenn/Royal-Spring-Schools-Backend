import {Request, Response} from 'express';
import {JwtPayload} from 'jsonwebtoken';
import { axiosgetAllCourses } from '../../utilities/helpers';
import Courses, { CourseAttributes } from '../../models/coursesModel/courses';
import { Op } from 'sequelize';

// export const getStudentEnrolledCourses = async (req: JwtPayload, res: Response) => {
//     try {
//         const search = req.query.search
//         const reg_no = req.user.reg_no;
//         if(!search || search === ""){
//             const Finder:any = await Courses.findAll({
//                 where: {
//                     student_regNo: reg_no,
//                 },
//             }) as unknown as CourseAttributes;
    
//             if (!Finder) {
//                 return res.status(404).json({ status: `error`, message: `No courses found` });
//             }
//             return res.status(200).json({ status: `success`, data: Finder });
//         }else{
//             const Finder:any = await Courses.findAndCountAll({
//                 where: {
//                     student_regNo: reg_no, course_code: search || name_of_course: search || name_of_instructor: search
//                 },
//             }) as unknown as CourseAttributes;
    
//             if (!Finder || Finder.count === 0) {
//                 return res.status(404).json({ status: `error`, message: `No courses found` });
//             }
//             return res.status(200).json({ status: `success`, data: Finder});
//         }
//     } catch (err: any) {
//         console.log(err.message);
//         return res.status(500).json({ status: `error`, message: `Internal Server Error` });
//     }
// };

export const getStudentEnrolledCourses = async (req: JwtPayload, res: Response) => {
    try {
        const search = req.query.search;
        const reg_no = req.user.reg_no;

        if (!search || search === "") {
            const courses = await Courses.findAll({
                where: {
                    student_regNo: reg_no,
                },
            });

            if (!courses || courses.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No courses found' });
            }

            return res.status(200).json({ status: 'success', data: courses });
        } else {
            const coursesAndCount = await Courses.findAndCountAll({
                where: {
                    student_regNo: reg_no,
                    [Op.or]: [
                        { course_code: { [Op.iLike]: `%${search}%` } },
                        { name_of_course: { [Op.iLike]: `%${search}%` } },
                        { name_of_instructor: { [Op.iLike]: `%${search}%` } },
                    ],
                },
            });

            const courses = coursesAndCount.rows;
            const count = coursesAndCount.count;

            if (!courses || count === 0) {
                return res.status(404).json({ status: 'error', message: 'No courses found' });
            }

            return res.status(200).json({ status: 'success', data: { courses, count } });
        }
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
