const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
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
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await commentUseCase.addComment(useCasePayload, fakeThread, fakeOwner);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
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
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await commentUseCase.deleteComment(fakeComment, fakeThread, fakeOwner);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(fakeComment, fakeOwner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(fakeComment);
  });
});
