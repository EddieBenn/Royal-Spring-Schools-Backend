import {Model, DataTypes} from 'sequelize';
import {database} from '../../configurations/database'

interface syll {
    week: string;
    topic: string;
    content: string;
}

interface student {
    reg_no: string;
    firstName: string;
    lastName: string;
    email: string
}

export interface CourseAttributes {
    id: string;
    student_regNo: string;
    course_code: string;
    name_of_course: string;
    name_of_instructor: string;
    description: string;
    enrollment_status: string;
    course_image?:string;
    duration: string;
    schedule: string;
    location: string;
    isRegistered: boolean;
    isCompleted: boolean;
    perequisites: string[];
    syllabus: syll[];
    students: student[]
}

class Courses extends Model<CourseAttributes>{}

Courses.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: false
    },
    student_regNo: {
        type: DataTypes.STRING
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
    },
    name_of_course: {
        type: DataTypes.STRING,
    },
    name_of_instructor: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    enrollment_status: {
        type: DataTypes.STRING,
    },
    course_image: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.STRING,
    },
    schedule: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    perequisites: {
        type: DataTypes.JSON//ARRAY(DataTypes.STRING),
    },
    syllabus: {
        type: DataTypes.JSON,
    },
    students: {
        type: DataTypes.JSON,
    },
    course_code: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
   }
},
{
    sequelize: database,
    modelName: "Courses",
    schema: 'school_service',
    timestamps: true
}
)

export default Courses