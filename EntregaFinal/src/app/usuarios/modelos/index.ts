
export type userRol = 'user' | 'admin' | null
export interface users {
    id: string;
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    correo: string;
    password: string;
    role: userRol
  }

export interface teachers {
    id: string;
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    nivelAcademico: string
    materias: string[];
    correo: string;
    password: string;
    role: userRol 
  }

export interface courses {
    id: string;
    curso: string;
    creditos: number;
  }

export interface enrollments {
    id: string;
    courseId: string;
    userId: string;
  }

export interface enrollmentsWithCourseAndUser extends enrollments {
    course: courses;
    user: users;
  }

export interface courseUpdate {
  course: courses;
  selectedId: string | null;
}