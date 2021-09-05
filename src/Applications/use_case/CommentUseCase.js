const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async addComment(useCasePayload, threadId, owner) {
    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment, threadId, owner);
  }
}

module.exports = CommentUseCase;
