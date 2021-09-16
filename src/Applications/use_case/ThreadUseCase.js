const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addThread(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, owner);
  }

  async getThreadById(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentsAndReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      return { ...comment, replies };
    }));

    return {
      ...thread,
      comments: commentsAndReplies,
    };
  }
}

module.exports = ThreadUseCase;
