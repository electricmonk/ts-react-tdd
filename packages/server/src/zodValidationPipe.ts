import {ArgumentMetadata, BadRequestException, PipeTransform} from "@nestjs/common";
import {ZodSchema} from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {
    }

    transform(value: unknown, {type}: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            throw new BadRequestException(`failed parsing value ${value} into type ${type} with ${error}`);
        }
    }
}