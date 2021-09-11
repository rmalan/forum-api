const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, owner);
  }

  async getThreadById(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsByThread = await this._commentRepository.getCommentsByThreadId(threadId);

    return {
      ...thread,
      comments: commentsByThread,
    };
  }
}

module.exports = ThreadUseCase;
