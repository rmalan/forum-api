const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'NewComment content',
    };
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: fakeOwner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await commentUseCase.addComment(useCasePayload, fakeThread, fakeOwner);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
    }), fakeThread, fakeOwner);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const fakeOwner = 'user-123';
    const fakeThread = 'thread-123';
    const fakeComment = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await commentUseCase.deleteComment(fakeComment, fakeThread, fakeOwner);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(fakeComment, fakeOwner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(fakeComment);
  });
});
