import { Strategy } from 'passport-jwt';
import { UserPayload } from './types';
import { Role } from '@prisma/client';
interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): UserPayload;
}
export {};
