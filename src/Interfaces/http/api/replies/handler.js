class RepliesHandler {
  constructor({ replyUseCase }) {
    this._replyUseCase = replyUseCase;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedReply = await this._replyUseCase.addReply(
      request.payload, threadId, commentId, credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._replyUseCase.deleteReply(threadId, commentId, replyId, credentialId);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
