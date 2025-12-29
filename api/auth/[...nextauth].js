import NextAuth from 'next-auth';
import { authOptions } from '../../../src/lib/auth/nextauth.config';

export default NextAuth(authOptions);
