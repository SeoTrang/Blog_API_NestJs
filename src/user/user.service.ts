import { Injectable, Query } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}
    async findAll(@Query() query:FilterUserDto):Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const skip = (page-1)*items_per_page ;


        const [res,total] =  await this.userRepository.findAndCount({
            where:[
                {
                    first_name:Like('%'+search+'%')
                },
                {
                    last_name:Like('%'+search+'%')
                },
                {
                    email:Like('%'+search+'%')
                }
            ],
            order: {created_at: "DESC"},
            take:items_per_page,
            skip:skip,
            select: ['id','first_name', 'last_name', 'email','created_at', 'updated_at']
        });

        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page+1 > lastPage ? null : page+1
        const prevPage = page-1 < 1 ? null : page-1
        return {
            data: res,
            total: total,
            currentPage: page,
            nextPage: nextPage,
            prevPage: prevPage,
            lastPage: lastPage
        }
    }
    async findOne(id:number):Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id: id
            }
        })
    }
    async create(createUserDto: CreateUserDto):Promise<User>{
        const hashPassword = await bcrypt.hash(createUserDto.password,10);
        return await this.userRepository.save({...createUserDto,password:hashPassword,refresh_token:'refresh_token_string'});
    }

    async update(id:number, updateUserDto: UpdateUserDto):Promise<UpdateResult>{
        return await this.userRepository.update(id,updateUserDto)
    }

    async delete(id:number):Promise<DeleteResult>{
        return await this.userRepository.delete(id);
    }

    async updateAvatar(id:number, avatar: string): Promise<UpdateResult>{
        return await this.userRepository.update(id,{avatar});
    }
}
