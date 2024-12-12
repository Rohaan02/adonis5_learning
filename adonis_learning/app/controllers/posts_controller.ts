import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'
import { createPostValidator } from '#validators/post'

export default class PostsController {
  public async store({ request, response, auth }: HttpContext) {
    try {
      const { content } = await createPostValidator.validate(request.body())
      const post = await Post.create({ content, userId: auth.user?.id })
      return response.status(201).json(post)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async index({ response, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const posts = await Post.query().preload('User')

      if (posts.length === 0) {
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
      if (!auth.user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const postId = params.id

      const post = await Post.query().where('id', postId).preload('User').first()

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
      if (!auth.user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const postId = params.id
      const post = await Post.find(postId)

      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      if (post.userId !== auth.user.id) {
        return response
          .status(403)
          .json({ message: 'Forbidden: You are not the author of this post' })
      }

      const data = request.only(['content'])
      post.merge(data)
      await post.save()

      return response.ok(post)
    } catch (error) {
      console.error(error)
      return response.badRequest('Error updating the post')
    }
  }

  public async destroy({ response, params, auth }: HttpContext) {
    try {
      if (!auth.user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const postId = params.id

      const post = await Post.query().where('id', postId).first()

      if (!post) {
        return response.status(404).json({ message: 'Post not found' })
      }

      if (post.userId !== auth.user.id) {
        return response.status(403).json({ message: 'You are not authorized to delete this post' })
      }

      await post.delete()

      return response.ok({ message: 'Post deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.badRequest('Error deleting the post')
    }
  }
}
