import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// import { Client } from 'postmark'

// import { env } from '@/env.mjs'
import db from './db'

// const postmarkClient = new Client(env.POSTMARK_API_TOKEN)

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null

          const { username, password } = credentials

          const user = await db.user.findUnique({ where: { username } })

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // Return an object that will pass error information through to the client-side.
            throw new Error(JSON.stringify({ errors: { message: 'user not found.' }, status: false }))
          }

          return user
        } catch (error) {
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   // console.log('🚀 -> redirect -> baseUrl:', baseUrl)
    //   // console.log('🚀 -> redirect -> url:', url)
    //   return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
    // },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email
        }
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username
      }
    }
  }
}
