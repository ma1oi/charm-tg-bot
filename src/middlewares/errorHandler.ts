import { Middleware } from 'telegraf';
import { ValidationError } from '@utils/validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { startSceneId } from '@scenes/customer/startScene';
import { MyContext } from '@myContext/myContext';

const ERROR_MESSAGES = {
  VALIDATION: 'Пожалуйста, проверьте правильность введенных данных.',
  DATABASE: 'Произошла ошибка при работе с базой данных. Пожалуйста, попробуйте позже.',
  UNAUTHORIZED: 'У вас нет доступа к этой функции.',
  PROMOCODE_NOT_FOUND: 'Промокод не найден.',
  PROMOCODE_EXPIRED: 'Промокод больше не действителен.',
  GENERAL: 'Произошла ошибка. Пожалуйста, попробуйте позже или обратитесь в поддержку.',
  UNKNOWN: 'Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.'
};

export const errorHandler: Middleware<MyContext> = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Bot error:', {
      error,
      update: ctx.update,
      user: ctx.from
    });

    let errorMessage = ERROR_MESSAGES.UNKNOWN;

    if (error instanceof ValidationError) {
      errorMessage = error.message;
    } else if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          errorMessage = 'Этот элемент уже существует в базе данных.';
          break;
        case 'P2025':
          errorMessage = 'Запрашиваемый элемент не найден.';
          break;
        default:
          errorMessage = ERROR_MESSAGES.DATABASE;
      }
    } else if (error instanceof Error) {
      if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
      } else if (error.message.includes('promocode')) {
        if (error.message.includes('not found')) {
          errorMessage = ERROR_MESSAGES.PROMOCODE_NOT_FOUND;
        } else if (error.message.includes('expired')) {
          errorMessage = ERROR_MESSAGES.PROMOCODE_EXPIRED;
        }
      } else {
        errorMessage = ERROR_MESSAGES.GENERAL;
      }
    }

    try {
      await ctx.reply(errorMessage, { parse_mode: 'HTML' });
    } catch (replyError) {
      console.error('Failed to send error message:', replyError);
      try {
        await ctx.reply(ERROR_MESSAGES.GENERAL);
      } catch (fallbackError) {
        console.error('Failed to send fallback error message:', fallbackError);
      }
    }

    await ctx.scene.enter(startSceneId)

  }
}; 