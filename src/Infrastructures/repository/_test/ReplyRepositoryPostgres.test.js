const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}); // dummy dependency

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addReply function', () => {
      it('should persist new reply and return added reply correctly', async () => {
        // Arrange
        const newReply = new NewReply({
          content: 'NewReply content',
        });
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        // Action
        const addedReply = await replyRepositoryPostgres.addReply(
          newReply, fakeComment, fakeOwner,
        );

        // Assert
        const reply = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: 'NewReply content',
          owner: fakeOwner,
        }));
        expect(reply).toHaveLength(1);
      });
    });

    describe('verifyReplyOwner function', () => {
      it('should throw NotFoundError when reply not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const verifyReplyOwner = replyRepositoryPostgres.verifyReplyOwner('reply-1234', 'user-123');

        // Assert
        await expect(verifyReplyOwner).rejects.toThrowError(NotFoundError);
      });

      it('should throw AuthorizationError when reply it is not the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeReply = 'reply-123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await RepliesTableTestHelper.addReply({});

        // Action
        const verifyReplyOwner = replyRepositoryPostgres.verifyReplyOwner(fakeReply, 'user-1234');

        // Assert
        await expect(verifyReplyOwner).rejects.toThrowError(AuthorizationError);
      });

      it('should return when reply it is the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeReply = 'reply-123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await RepliesTableTestHelper.addReply({});

        // Action
        const verifyReplyOwner = await replyRepositoryPostgres.verifyReplyOwner(
          fakeReply, fakeOwner,
        );

        // Assert
        expect(verifyReplyOwner).toBe();
      });
    });

    describe('deleteReply function', () => {
      it('should throw NotFoundError when reply not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const deleteReply = replyRepositoryPostgres.deleteReply('reply-1234');

        // Assert
        await expect(deleteReply).rejects.toThrowError(NotFoundError);
      });

      it('should set is_delete true when reply it is the owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeReply = 'reply-123'; // stub!
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await RepliesTableTestHelper.addReply({});

        // Action
        const deleteReply = await replyRepositoryPostgres.deleteReply(fakeReply);

        // Assert
        expect(deleteReply).toBe();
      });
    });

    describe('getRepliesByCommentId function', () => {
      it('should persist get replies by thread id and return detail replies correctly', async () => {
        // Arrange
        const commentId = 'comment-123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({ date: '2021-09-08T07:19:09.775Z' });
        await RepliesTableTestHelper.addReply({ date: '2021-09-08T07:19:09.775Z' });

        // Action
        const detailReplies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

        // Assert
        const replies = await RepliesTableTestHelper.findRepliesByCommentId('comment-123');
        expect(detailReplies).toEqual(
          expect.arrayContaining([
            expect.objectContaining(new DetailReply({
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-09-08T07:19:09.775Z',
              content: 'NewReply content',
              isDelete: false,
            })),
          ]),
        );
        expect(replies).toHaveLength(1);
      });
    });
  });
});
