import { Controller, Get, Req, Post, Put, Delete, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  folders = [];
  tasks = [];
  constructor(private readonly appService: AppService) {}

  @Put('updatePosition')
  updateFolderPosition(@Req() request: Request): object {
    let targetFolder = this.folders.find((folder) => folder.id == request.body['id']);
    targetFolder.position = request.body['position'];
    
    return {message: "positon updated"};
  }

  @Put()
  updateElement(@Req() request: Request): object {
    if(request.body['type'] == "folder"){
      let updated = request.body['data'];
      let folder = this.folders.find((folder) => folder.id == updated.id);
      this.folders.splice(this.folders.indexOf(folder), 1, updated);
      
    }else if(request.body['type'] == "task"){
      let updated = request.body['data'];
      let task = this.tasks.find((task) => task.id == updated.id);
      this.tasks.splice(this.tasks.indexOf(task), 1, updated);
    }
    return {message: "updated"};
  }

  @Delete()
  deleteElement(@Req() request: Request): object {
    
    return {message: "deleted"};
  }

  @Post()
  postElement(@Req() request: Request): object {
    if(request.body['type'] == "folder"){
      this.folders.push(request.body['data']);
    }else if(request.body['type'] == "task"){
      this.tasks.push(request.body['data']);
    }
    
    return {message: "saved"};
  }

  @Get()
  getHello(): object {
    let data = {
      folders: [...this.folders],
      tasks: [...this.tasks]
    }
    return data;
  }
}
