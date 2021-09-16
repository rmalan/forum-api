class RepliesHandler {
  constructor({ replyUseCase }) {
    this._replyUseCase = replyUseCase;

    this.postReplyHandler = this.postReplyHandler.bind(this);
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
}

module.exports = RepliesHandler;
