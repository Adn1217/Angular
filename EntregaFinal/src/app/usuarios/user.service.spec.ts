import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './user.service';
import { teachers, users } from './modelos';
import { env } from '../envs/env';
import { Observable } from 'rxjs';
import { NotifierService } from '../core/services/notifier.service';
import { MockProvider } from 'ng-mocks';
// import { NotifierMock } from '../core/mocks/notifier.mock';

describe('userService', () => {
    let service: UserService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                // {
                //     provide: NotifierService,
                //     useClass: NotifierMock
                // }
                MockProvider(NotifierService) 
            ]
        })
    
        service = TestBed.inject(UserService);
        httpController = TestBed.inject(HttpTestingController);
    })


    it('Get User method has to return an array of Users', (done) => {
        const  mockListOfUsers: users[] = [
            {
              "id": 1,
              "nombres": "Adrian Alberto1",
              "apellidos": "Fernández Cabrera",
              "usuario": "adn1217",
              "edad": 32,
              "correo": "adn1217@hotmail.com",
              "password": "12345678",
              "role": "user"
            },
            {
              "id": 2,
              "nombres": "Alejandra Paola",
              "apellidos": "Fernández Castro",
              "usuario": "alu2110",
              "edad": 31,
              "correo": "alufndz_@gmail.com",
              "password": "12345678",
              "role": "user"
            }
        ]

        const mockResponse: users[] = mockListOfUsers;
        let realResponse: users[] = [];
        const usersObservable: Observable<users[]> = service.getUsers()
        usersObservable.subscribe({
            next: (usersList) => {
                realResponse = usersList;
                console.log('Userlist: ', realResponse)
                expect(typeof usersList).toEqual(typeof mockResponse)
                done();
            },
            complete: () => {
                const req = httpController.expectOne({
                    method: 'GET',
                    url: `${env.baseApiUrl}/users`
                })
                req.flush(realResponse);
            }

        })
    })
    
    it('isTeacher method returns true for a teacher and false for a student', () => {
        const  mockTeacher: teachers = {
            "id": 1,
            "nombres": "Sebastián Andrés2",
            "apellidos": "Castañeda Rosales",
            "usuario": "scastaneda",
            "edad": 58,
            "nivelAcademico": "Maestría",
            "materias": [
              "Cálculo I",
              "Cálculo II",
              "Cálculo III"
            ],
            "correo": "scastaneda@hotmail.com",
            "password": "12345678",
            "role": "user"
          };
        
        const mockUser: users = {
            "id": 2,
            "nombres": "Alejandra Paola",
            "apellidos": "Fernández Castro",
            "usuario": "alu2110",
            "edad": 31,
            "correo": "alufndz_@gmail.com",
            "password": "12345678",
            "role": "user"
          };

        let realResponse: boolean = service.isTeacher(mockTeacher);
        expect(realResponse).toEqual(true)
        
        realResponse = service.isTeacher(mockUser);
        expect(realResponse).toEqual(false)
    })
    
    it('Get Teachers method has to return an array of Teachers', () => {
        const  mockListOfTeachers: teachers[] = [
            {
              "id": 1,
              "nombres": "Sebastián Andrés2",
              "apellidos": "Castañeda Rosales",
              "usuario": "scastaneda",
              "edad": 58,
              "nivelAcademico": "Maestría",
              "materias": [
                "Cálculo I",
                "Cálculo II",
                "Cálculo III"
              ],
              "correo": "scastaneda@hotmail.com",
              "password": "12345678",
              "role": "user"
            },
            {
              "id": 2,
              "nombres": "Eric Danilo",
              "apellidos": "Vallejo Fontanarrosa",
              "usuario": "alu2110",
              "edad": 47,
              "nivelAcademico": "Doctorado",
              "materias": [
                "Máquinas Eléctricas I",
                "Máquinas Eléctricas II"
              ],
              "correo": "evftrsa_@gmail.com",
              "password": "12345678",
              "role": "user"
            }
        ]

        const mockResponse: users[] = mockListOfTeachers;
        let realResponse: users[] = [];
        const teachersObservable: Observable<users[]> = service.getUsers()
        teachersObservable.subscribe({
            next: (teachersList) => {
                realResponse = teachersList;
                expect(typeof teachersList).toEqual(typeof mockResponse)
            },
            complete: () => {
                const req = httpController.expectOne({
                    method: 'GET',
                    url: `${env.baseApiUrl}/teachers`
                })
                req.flush(realResponse);
            }

        })
    })
    
    it('Get teacherById method has to return a Teacher or undefined', () => {
        const  mockTeacher: teachers = 
            {
              "id": 1,
              "nombres": "Sebastián Andrés2",
              "apellidos": "Castañeda Rosales",
              "usuario": "scastaneda",
              "edad": 58,
              "nivelAcademico": "Maestría",
              "materias": [
                "Cálculo I",
                "Cálculo II",
                "Cálculo III"
              ],
              "correo": "scastaneda@hotmail.com",
              "password": "12345678",
              "role": "admin"
            }

        const mockResponse: teachers = mockTeacher;
        const id = '1';
        let realResponse: teachers | undefined = undefined;
        const teacherObservable: Observable<teachers | undefined> = service.getTeacherById(id);
        teacherObservable.subscribe({
            next: (teacher) => {
                realResponse = teacher;
                console.log('Teacher ', teacher);
                let isTeacher = typeof teacher === typeof mockResponse;
                let isUndefined = teacher === undefined;
                expect(isTeacher || isUndefined).toBe(true);
            },
            complete: () => {
                const req = httpController.expectOne({
                    method: 'GET',
                    url: `${env.baseApiUrl}/teachers/${id}`
                })
                const body = req.request.body;
                if(realResponse){
                    req.flush(realResponse);
                }else{
                    req.flush({});
                }
            }

        })
    })
    
    it('Get userById method has to return an user or undefined', () => {
        const mockUser: users = {
            "id": 2,
            "nombres": "Alejandra Paola",
            "apellidos": "Fernández Castro",
            "usuario": "alu2110",
            "edad": 31,
            "correo": "alufndz_@gmail.com",
            "password": "12345678",
            "role": "admin"
          }

        const mockResponse: users = mockUser;
        const id = '2';
        let realResponse: users | undefined = undefined;
        const userObservable: Observable<users | undefined> = service.getUserById(id);
        userObservable.subscribe({
            next: (user) => {
                realResponse = user;
                console.log(JSON.stringify(user));
                let isUser = typeof user === typeof mockResponse;
                let isUndefined = user === undefined;
                expect(isUser || isUndefined).toBe(true);
            },
            complete: () => {
                const req = httpController.expectOne({
                    method: 'GET',
                    url: `${env.baseApiUrl}/users`
                })
                const body = req.request.body;
                if(realResponse){
                    req.flush(realResponse);
                }else{
                    req.flush({});
                }
            }
        })
    })
})