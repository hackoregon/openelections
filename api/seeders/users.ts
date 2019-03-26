import User from '../models/User'
(async () => {
    await User.create({
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        password: 'lksafdljksd',
        email: 'test@email.com',
        woot: 'love',
        createdAt : new Date(),
        updatedAt : new Date()
    });
    const allUsers = await User.findAll();
    console.log(allUsers.map(u => u.firstName));
})();


