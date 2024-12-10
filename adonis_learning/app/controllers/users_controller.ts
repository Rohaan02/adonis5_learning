import type { HttpContext } from '@adonisjs/core/http'
import {registerValidator,loginValidator} from "../validators/user.js"
import User from '../models/user.js'

export default class UsersController {
  /** Login user */
  async login({ request, response }: HttpContext) {
      const { email, password } = await request.validateUsing(loginValidator)
      
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      
      return response.ok({
          token: token,
          ...user.serialize(),
        })
    }
    /** Register a new user */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
  }
}