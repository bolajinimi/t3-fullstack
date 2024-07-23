/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { todoInput } from "~/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { create } from "domain";


export const todoRouter = createTRPCRouter({

    all: protectedProcedure.query(async ({ctx}) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const todos = await ctx.db.todo.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        console.log("todos from prisma", todos.map(({id, text, done}) => ({id,text,done})));
        return[
            {
                id: 'fake',
                text: "fake text",
                done: false
            },
            {
                id: 'fake2',
                title: "fake test2",
                done: true
            },
           
        ]
    }),

    create: protectedProcedure.input(todoInput).mutation(async ({ctx, input}) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return  ctx.db.todo.create({
            data: {
                text: input,
                user: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                },
            },
            }
        );
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return  ctx.db.todo.delete({
            where: {
                id: input,
            },
            }
        );
    }),
    toggle: protectedProcedure.input(z.object({
        id: z.string(),
        done: z.boolean(),
      })).mutation(async ({ ctx, input: { id, done } }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return ctx.db.todo.update({
          where: {
            id,
          },
          data: {
            done: done,
          },
        });
      })
      
    // hello: publicProcedure
    //   .input(z.object({ text: z.string() }))
    //   .query(({ input }) => {
    //     return {
    //       greeting: `Hello ${input.text}`,
    //     };
    //   }),
  
    // create: protectedProcedure
    //   .input(z.object({ name: z.string().min(1) }))
    //   .mutation(async ({ ctx, input }) => {
    //     return ctx.db.post.create({
    //       data: {
    //         name: input.name,
    //         createdBy: { connect: { id: ctx.session.user.id } },
    //       },
    //     });
    //   }),
  
    // getLatest: protectedProcedure.query(async ({ ctx }) => {
    //   const post = await ctx.db.post.findFirst({
    //     orderBy: { createdAt: "desc" },
    //     where: { createdBy: { id: ctx.session.user.id } },
    //   });
  
    //   return post ?? null;
    // }),
  
    // getSecretMessage: protectedProcedure.query(() => {
    //   return "you can now see this secret message!";
    // }),
});