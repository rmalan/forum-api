class LikesHandler {
  constructor({ likeUseCase }) {
    this._likeUseCase = likeUseCase;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._likeUseCase.likeComment(threadId, commentId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
