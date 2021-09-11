const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist new comment and return added comment correctly', async () => {
        // Arrange
        const newComment = new NewComment({
          content: 'NewComment content',
        });
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeThread = 'thread-123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        // Action
        const addedComment = await commentRepositoryPostgres.addComment(
          newComment, fakeThread, fakeOwner,
        );

        // Assert
        const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: 'NewComment content',
          owner: fakeOwner,
        }));
        expect(comments).toHaveLength(1);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should throw NotFoundError when comment not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const verifyCommentOwner = commentRepositoryPostgres.verifyCommentOwner('comment-1234', 'user-123');

        // Assert
        await expect(verifyCommentOwner).rejects.toThrowError(NotFoundError);
      });

      it('should throw AuthorizationError when comment it is not the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        // Action
        const verifyCommentOwner = commentRepositoryPostgres.verifyCommentOwner(fakeComment, 'user-1234');

        // Assert
        await expect(verifyCommentOwner).rejects.toThrowError(AuthorizationError);
      });

      it('should return when comment it is the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        // Action
        const verifyCommentOwner = await commentRepositoryPostgres.verifyCommentOwner(
          fakeComment, fakeOwner,
        );

        // Assert
        expect(verifyCommentOwner).toBe();
      });
    });

    describe('deleteComment function', () => {
      it('should throw NotFoundError when comment not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const deleteComment = commentRepositoryPostgres.deleteComment('comment-1234');

        // Assert
        await expect(deleteComment).rejects.toThrowError(NotFoundError);
      });

      it('should set is_delete true when comment it is the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        // Action
        const deleteComment = await commentRepositoryPostgres.deleteComment(fakeComment);

        // Assert
        expect(deleteComment).toBe();
      });
    });
  });
});
