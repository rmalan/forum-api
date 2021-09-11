const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addComment(useCasePayload, threadId, owner) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.getThreadById(threadId);

    return this._commentRepository.addComment(newComment, threadId, owner);
  }

  async deleteComment(commentId, threadId, owner) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = CommentUseCase;
