import api from './../api.js';

describe('getInfo()', () => {
  let registryInfo;
  beforeAll(async () => {
    registryInfo = await api.getInfo();
  });

  test('contains the correct keys', () => {
    expect(registryInfo).toEqual(
      expect.objectContaining({
        nbDocs: expect.any(Number),
        seq: expect.any(Number),
      })
    );
  });
});
