import { NextResponse } from 'next/server';

export const POST = () => {
    const headers = new Headers();
    headers.append(
        'Set-Cookie',
        'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;'
    );

    return new NextResponse('Logged out successfully', {
        status: 200,
        headers,
    });
};
