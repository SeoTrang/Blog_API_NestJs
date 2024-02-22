import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    
    @UseGuards(AuthGuard)
    @ApiQuery({name:'page'})
    @ApiQuery({name:'items_per_page'})
    @ApiQuery({name:'search'})
    @Get()
    async findAll(@Query() query:FilterUserDto):Promise<User[]>{
        console.log(query);
        
        return await this.userService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id:string):Promise<User>{
        return await this.userService.findOne(Number(id));
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createUserDto:CreateUserDto):Promise<User>{

        return await this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto ){
        return await this.userService.update(Number(id),updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id:string){
        return await this.userService.delete(Number(id));
    }


    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar',{storage: storageConfig('avatar'),
    fileFilter: (req,file,cb)=>{
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.gif']
        if(!allowedExtArr.includes(ext)){
            req.fileValidationError = 'Wrong file extension type. accepted file extensions: ' + allowedExtArr.toString();
            cb(null,false)
        }else{
            const fileSize = parseInt(req.headers['Content-Length']);
            if(fileSize > 1024 * 1024 * 5){
                req.fileValidationError = 'File size is too large. File size must be less than 5MB';
                cb(null,false)
            }else{
                cb(null,true)
            }
        }

    }
    }))
    async uploadAvatar(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        console.log("api upload avatar");
        console.log('user-data',req.user_data);
        
        // console.log(req.fileValidationError);
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        await this.userService.updateAvatar(Number(req.user_data.id),file.destination + '/' + file.filename)
        
    }
}
