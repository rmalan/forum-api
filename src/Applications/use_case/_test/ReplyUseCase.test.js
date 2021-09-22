const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');

describe('ReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'NewReply content',
    };
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const fakeComment = 'comment-123';
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: fakeOwner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await replyUseCase.addReply(
      useCasePayload, fakeThread, fakeComment, fakeOwner,
    );

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(fakeComment);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
    }), fakeComment, fakeOwner);
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const fakeComment = 'comment-123';
    const fakeReply = 'reply-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await replyUseCase.deleteReply(fakeThread, fakeComment, fakeReply, fakeOwner);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(fakeComment);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(fakeReply, fakeOwner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(fakeReply);
  });
});
