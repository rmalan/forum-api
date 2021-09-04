const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const injections = require('../../injections');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should response 401 when no credentials', async () => {
    // Arrange
    const requestPayload = {
      title: 'NewThread Title',
      body: 'NewThread body',
    };
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
    });

    // Assert
    expect(response.statusCode).toEqual(401);
  });

  it('should handle jwt correctly', async () => {
    // Arrange
    const payload = {
      title: 'NewThread Title',
      body: 'NewThread body',
    };
    const accessToken = await ServerTestHelper.getAccessToken();
    const server = await createServer(injections);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    expect(accessToken).toBeDefined();
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
    expect(responseJson.data.addedThread.title).toEqual(payload.title);
  });
});
