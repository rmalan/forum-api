const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async addThread(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, owner);
  }

  async getThreadById(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentsLikesAndReplies = await Promise.all(comments.map(async (comment) => {
      const likeCount = await this._likeRepository.getLikeCount(comment.id);
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

      return { ...comment, likeCount, replies };
    }));

    return {
      ...thread,
      comments: commentsLikesAndReplies,
    };
  }
}

module.exports = ThreadUseCase;
