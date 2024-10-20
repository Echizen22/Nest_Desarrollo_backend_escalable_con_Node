import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProducImage( imageName );

    res.sendFile( path );
  }



  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File,
  ) {

    if( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    

    // const secureUrl = `${ file.fieldname }`;
    const secureUrl = `http://localhost:3000/api/files/product/31a1ea72-1357-482e-a676-ac0fe86855d4.png`;

    return { secureUrl };
  }

}
