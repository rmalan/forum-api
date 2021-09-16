const NewReply = require('../../Domains/replies/entities/NewReply');

class ReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(useCasePayload, threadId, commentId, owner) {
    const newReply = new NewReply(useCasePayload);

    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);

    return this._replyRepository.addReply(newReply, commentId, owner);
  }

  async deleteReply(threadId, commentId, replyId, owner) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = ReplyUseCase;
