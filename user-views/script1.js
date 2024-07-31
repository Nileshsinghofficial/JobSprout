document.addEventListener('DOMContentLoaded', () => {
    const userListings = document.getElementById('user-listings');
    const searchInput = document.getElementById('search');

    const users = [
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            resume: 'john_doe_resume.pdf',
            appliedDate: '2024-07-01'
        },
        {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            resume: 'jane_smith_resume.pdf',
            appliedDate: '2024-07-02'
        },
        // Add more users
    ];

    const displayUsers = (users) => {
        userListings.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.innerHTML = `
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Resume:</strong> <a href="${user.resume}" target="_blank">View Resume</a></p>
                <p><strong>Applied Date:</strong> ${new Date(user.appliedDate).toLocaleDateString()}</p>
            `;
            userListings.appendChild(userElement);
        });
    };

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });

    displayUsers(users);
});
