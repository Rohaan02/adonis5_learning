/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')


// ** previous by default router starts here
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
// previous by default router ends here **

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
}).prefix('/user')

// add this route
router.get('me', async ({ auth, response }) => {
  try {
    const user = auth.getUserOrFail()
    return response.ok(user)
  } catch (error) {
    return response.unauthorized({ error: 'User not found' })
  }
})
.use(middleware.auth())