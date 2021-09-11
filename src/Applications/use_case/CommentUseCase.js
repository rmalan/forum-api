const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async addComment(useCasePayload, threadId, owner) {
    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment, threadId, owner);
  }

  async deleteComment(commentId, threadId, owner) {
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = CommentUseCase;
