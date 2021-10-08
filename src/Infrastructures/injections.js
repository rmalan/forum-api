/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres');
const BcryptEncryptionHelper = require('./security/BcryptEncryptionHelper');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const ThreadUseCase = require('../Applications/use_case/ThreadUseCase');
const CommentUseCase = require('../Applications/use_case/CommentUseCase');
const ReplyUseCase = require('../Applications/use_case/ReplyUseCase');
const LikeUseCase = require('../Applications/use_case/LikeUseCase');

const serviceInstanceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  threadRepository: new ThreadRepositoryPostgres(pool, nanoid),
  commentRepository: new CommentRepositoryPostgres(pool, nanoid),
  replyRepository: new ReplyRepositoryPostgres(pool, nanoid),
  likeRepository: new LikeRepositoryPostgres(pool, nanoid),
  encryptionHelper: new BcryptEncryptionHelper(bcrypt),
  authenticationTokenManager: new JwtTokenManager(Jwt.token),
};

const useCaseInstanceContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  loginUserUseCase: new LoginUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  logoutUserUseCase: new LogoutUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
  }),
  threadUseCase: new ThreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
  }),
  commentUseCase: new CommentUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
  }),
  replyUseCase: new ReplyUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
  }),
  likeUseCase: new LikeUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    likeRepository: serviceInstanceContainer.likeRepository,
  }),
};

// export all instance
module.exports = {
  ...serviceInstanceContainer,
  ...useCaseInstanceContainer,
};
