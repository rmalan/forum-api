class CommentsHandler {
  constructor({ commentUseCase }) {
    this._commentUseCase = commentUseCase;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedComment = await this._commentUseCase.addComment(
      request.payload, threadId, credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
