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
<<<<<<< Updated upstream
}).prefix('/user')
=======
})

router
  .group(() => {
    router.post('/store', [PostsController, 'store'])
    router.get('/index', [PostsController, 'index']) //All user's posts
    router.get('/loggedinUserPost', [PostsController, 'loggedinUserPost']) //Posts of loggedin user only.
    router.get('/show/:id', [PostsController, 'show']) //All user's posts with the id
    router.get('/pagination', [PostsController, 'pagination']) //Posts sorted with pagination.
    router.put('/update/:id', [PostsController, 'update'])
    router.delete('/destroy/:id', [PostsController, 'destroy'])
  })
  .use(middleware.auth())
  .prefix('/post')
>>>>>>> Stashed changes

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