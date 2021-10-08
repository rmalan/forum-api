const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const injections = require('../../injections');
const createServer = require('../createServer');
const LikesTableHelper = require('../../../../tests/LikesTableHelper');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(injections);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-1234/comments/comment-123/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(injections);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-1234/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 200 and like comment', async () => {
      // Arrange
      const server = await createServer(injections);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and unlike comment', async () => {
      // Arrange
      const server = await createServer(injections);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableHelper.addLike({});

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          strategy: 'forumapi_jwt',
          credentials: {
            id: 'user-123',
          },
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
