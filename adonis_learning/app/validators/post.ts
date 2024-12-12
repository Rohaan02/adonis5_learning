import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(3).maxLength(64),
  })
)
