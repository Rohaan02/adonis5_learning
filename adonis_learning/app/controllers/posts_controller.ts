import type { HttpContext } from '@adonisjs/core/http'
import { createPostValidator } from '#validators/post'
import PostService from '#services/post_service'
export default class PostsController {
  public async store({ request, response, auth }: HttpContext) {
    try {
      const { content } = await createPostValidator.validate(request.body())
      const post = await PostService.createPost(content, auth.user?.id!)
      return response.status(201).json(post)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const posts = await PostService.getAllPosts()

      if (!posts.length) {
        return response.status(404).json({ message: 'No posts found' })
      }

      return response.ok(posts)
    } catch (error) {
      console.error(error)
      return response.badRequest('Error fetching posts')
    }
  }

  public async loggedinUserPost({ response, auth }: HttpContext) {
    try {
      //when we use ! before any variable it will be as not, but when we use at the end it will count as notnull.
      const userId = auth.user?.id!
      const posts = await PostService.getUserPosts(userId)

      if (!posts.length) {
        return response.status(404).json({ message: 'No posts found' })
      }

      return response.ok(posts)
    } catch (error) {
      console.error(error)
      return response.badRequest('Error fetching posts')
    }
  }

  public async show({ response, params, auth }: HttpContext) {
    try {
      const post = await PostService.getPostById(auth.user?.id!, params.id)

      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      return response.ok(post)
    } catch (error) {
      console.error(error)
      return response.badRequest('Error fetching the post')
    }
  }

  public async update({ response, params, request, auth }: HttpContext) {
    try {
      const affectedRows = await PostService.updatePost(
        auth.user?.id!,
        params.id,
        request.input('content')
      )

      if (!affectedRows.length) {
        return response.status(404).json({
          message: 'Post not found or you are not authorized to update it',
        })
      }

      return response.ok({ message: 'Post updated successfully' })
    } catch (error) {
      console.error(error)
      return response.badRequest('Error updating the post')
    }
  }

  public async destroy({ response, params, auth }: HttpContext) {
    try {
      const postId = params.id
      const userId = auth.user?.id!

      const post = await PostService.deletePost(userId, postId)

      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      return response.ok({ message: 'Post deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.badRequest('Error deleting the post')
    }
  }

  public async pagination({ request, response, auth }: HttpContext) {
    try {
      const userId = auth.user?.id!
      const pageNumber = request.input('page', 1)
      const limit = 10

      const posts = await PostService.paginatePosts(userId, pageNumber, limit)

      if (!posts.length) {
        return response.status(404).json({ message: 'No posts found' })
      }
      return response.json(posts)
    } catch (error) {
      console.log(error)
      return response.badRequest('Error while Paginating')
    }
  }
}
