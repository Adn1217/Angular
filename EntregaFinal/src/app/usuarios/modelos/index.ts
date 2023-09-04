
export type userRol = 'user' | 'admin' | null
export interface users {
    id: number;
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    correo: string;
    password: string;
    role: userRol
  }

export interface teachers {
    id: number;
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    nivelAcademico: string
    correo: string;
    password: string;
    materias: string[];
    role: userRol 
  }

export interface courses {
    id: number;
    curso: string;
    creditos: number;
    // profesor: number;
  }

export interface enrollments {
    id: number;
    courseId: number;
    userId: number;
  }