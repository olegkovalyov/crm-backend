import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

export function IsEventDateCorrect(property: string, validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsEventDateCorrect',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          let startDate = null;
          let endDate = null;
          if (relatedPropertyName === 'endDate') {
            endDate = new Date((args.object as any)[relatedPropertyName]).getTime();
            startDate = new Date((args.object as any)['startDate']).getTime();
          } else {
            startDate = new Date((args.object as any)[relatedPropertyName]).getTime();
            endDate = new Date((args.object as any)['endDate']).getTime();
          }
          return startDate < endDate;
        },
      },
    });
  };
}