class LikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async likeComment(threadId, commentId, owner) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);

    const liked = await this._likeRepository.verifyLike(commentId, owner);

    if (!liked) {
      await this._likeRepository.addLike(commentId, owner);
    } else {
      await this._likeRepository.removeLike(commentId, owner);
    }
  }
}

module.exports = LikeUseCase;
