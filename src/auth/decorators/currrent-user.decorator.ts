import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';


export const CurrentUser = createParamDecorator(
    (roles: ValidRoles[] = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req?.user;

        if (!user) {
            throw new InternalServerErrorException('No user inside the request, make sure you are using the AuthGuard');
        }

        if (roles.length > 0) {
            const hasRole = () => roles.some((role) => user.roles?.includes(role));

            if (!hasRole()) {
                throw new InternalServerErrorException(`User does not have the required roles: ${roles}`);
            }
        }

        return user;
    }
) 