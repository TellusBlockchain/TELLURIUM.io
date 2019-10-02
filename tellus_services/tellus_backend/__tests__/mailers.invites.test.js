const send_invitation = require('../mailers/invites').send_invitation;

describe('Invites mailer', function() {
  beforeEach( async () => {
  });

  afterAll( () => {
  });

  it('should invoke method send_invitation without errors', async function(done) {
    await send_invitation("tester_name", "test@mail.net");
    done()
  });

});