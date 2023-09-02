export interface users {
    id: number;
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    correo: string;
    password: string
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
  }

export interface courses {
    id: number;
    curso: string;
    creditos: number;
    // profesor: number;
  }

export interface enrollments {
    id: number;
    idCurso: number;
    idAlumno: number;
  }