export interface TokenPayload {
    userId: string;
    id: string;
    roles: string[];
    country: string;
}
export declare const signAccessToken: (payload: TokenPayload) => string;
export declare const signRefreshToken: (payload: TokenPayload) => string;
export declare const verifyAccessToken: (token: string) => TokenPayload;
export declare const verifyRefreshToken: (token: string) => TokenPayload;
//# sourceMappingURL=token.d.ts.map