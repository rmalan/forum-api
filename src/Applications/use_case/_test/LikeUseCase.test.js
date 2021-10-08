const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const fakeComment = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLike = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUseCase.likeComment(fakeThread, fakeComment, fakeOwner);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(fakeComment);
    expect(mockLikeRepository.verifyLike).toBeCalledWith(fakeComment, fakeOwner);
    expect(mockLikeRepository.addLike).toBeCalledWith(fakeComment, fakeOwner);
  });

  it('should orchestrating unlike comment action correctly', async () => {
    // Arrange
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const fakeComment = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLike = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUseCase.likeComment(fakeThread, fakeComment, fakeOwner);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(fakeComment);
    expect(mockLikeRepository.verifyLike).toBeCalledWith(fakeComment, fakeOwner);
    expect(mockLikeRepository.removeLike).toBeCalledWith(fakeComment, fakeOwner);
  });
});
