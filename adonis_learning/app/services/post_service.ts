import Post from '../models/post.js'
import User from '#models/user'

export default class PostService {
  public static async createPost(content: string, userId: number) {
    return await Post.create({ content, userId })
  }

  public static async getAllPosts() {
    return await User.query().preload('Post')
  }

  // loggedinUserPost
  public static async getUserPosts(userId: number) {
    return await User.query().where('id', userId).preload('Post')
  }

  public static async getPostById(userId: number, postId: number) {
    return await User.query()
      .where('id', userId)
      .preload('Post', (query) => query.where('id', postId))
      .first()
  }

  public static async updatePost(userId: number, postId: number, content: string) {
    return await Post.query().where('id', postId).andWhere('user_id', userId).update({ content })
  }

  public static async deletePost(userId: number, postId: number) {
    const post = await Post.query().where('id', postId).andWhere('userId', userId).first()
    if (post) {
      await post.delete()
      return true
    }
    return false
  }

  public static async paginatePosts(userId: number, pageNumber: number, limit: number) {
    return await Post.query()
      .where('user_id', userId)
      .orderBy('id', 'desc')
      .paginate(pageNumber, limit)
  }
}
