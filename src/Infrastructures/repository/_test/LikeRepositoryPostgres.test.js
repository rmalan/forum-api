const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableHelper = require('../../../../tests/LikesTableHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {}); // dummy dependency

    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await LikesTableHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('verifyLike function', () => {
      it('should return false when the comment has not been liked', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-1234'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const like = await likeRepositoryPostgres.verifyLike(fakeComment, fakeOwner);

        // Assert
        expect(like).toBeFalsy();
      });

      it('should return true when a comment is liked', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await LikesTableHelper.addLike({});

        // Action
        const like = await likeRepositoryPostgres.verifyLike(fakeComment, fakeOwner);

        // Assert
        expect(like).toBeTruthy();
      });
    });

    describe('addLike function', () => {
      it('should persist like comment', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        // Action
        await likeRepositoryPostgres.addLike(fakeComment, fakeOwner);

        // Assert
        const like = await LikesTableHelper.findLikeById('like-123');
        expect(like).toHaveLength(1);
      });
    });

    describe('removeLike function', () => {
      it('should unlike the comment', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const fakeComment = 'comment-123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await LikesTableHelper.addLike({});

        // Action
        const removeLike = await likeRepositoryPostgres.removeLike(fakeComment, fakeOwner);

        // Assert
        expect(removeLike).toBe();
      });
    });
  });
});
