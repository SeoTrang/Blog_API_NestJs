import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiBearerAuth()
@ApiTags('Post')
export class PostController {

    constructor(private postService: PostService){}

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('post'),
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
    async create(@Req() req:any, @Body() createPostDto:CreatePostDto, @UploadedFile() file: Express.Multer.File):Promise<any>{
        console.log(req['user_data']);
        
        console.log(createPostDto);

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        
        return this.postService.create(req['user_data'].id,{...createPostDto,thumbnail:file.destination+'/'+file.filename})
    }
    
    @Get()
    @UseGuards(AuthGuard)
    @ApiQuery({name:'page'})
    @ApiQuery({name:'items_per_page'})
    @ApiQuery({name:'search'})
    async findAll(@Query() query: FilterPostDto):Promise<any>{
        console.log(query);
        
        return this.postService.findAll(query);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id:string):Promise<PostEntity>{
        console.log('api findOne : ',id);
        
        return this.postService.findOne(Number(id));
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('post'),
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
    async update(@Req() req:any,@Param('id') id: string, @Body() updatePostDto:UpdatePostDto, @UploadedFile() file: Express.Multer.File): Promise<any>{

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(file){
            updatePostDto.thumbnail = file.destination+'/'+file.filename
        }
        return await this.postService.update(Number(id), updatePostDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: number): Promise<any>{
        return await this.postService.delete(Number(id));
    }
}
