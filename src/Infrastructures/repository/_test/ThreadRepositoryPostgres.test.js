const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}); // dummy dependency

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'NewThread Title',
          body: 'NewThread body',
        });
        const fakeIdGenerator = () => '123'; // stub!
        const fakeOwner = 'user-123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        await UsersTableTestHelper.addUser({});

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(newThread, fakeOwner);

        // Assert
        const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          title: 'NewThread Title',
          owner: fakeOwner,
        }));
        expect(threads).toHaveLength(1);
      });
    });

    describe('getThreadById function', () => {
      it('should throw NotFoundError when thread not exist', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const detailThread = threadRepositoryPostgres.getThreadById('thread-1234');

        // Assert
        await expect(detailThread).rejects.toThrowError(NotFoundError);
      });

      it('should persist get thread by id and return detail thread correctly', async () => {
        // Arrange
        const threadId = 'thread-123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({ date: '2021-09-08T07:19:09.775Z' });

        // Action
        const detailThread = await threadRepositoryPostgres.getThreadById(threadId);

        // Assert
        const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
        expect(detailThread).toStrictEqual(new DetailThread({
          id: threadId,
          title: 'NewThread Title',
          body: 'NewThread body',
          date: '2021-09-08T07:19:09.775Z',
          username: 'dicoding',
        }));
        expect(threads).toHaveLength(1);
      });
    });
  });
});
