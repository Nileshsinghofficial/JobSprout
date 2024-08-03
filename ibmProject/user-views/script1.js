document.addEventListener('DOMContentLoaded', () => {
    const userListings = document.getElementById('user-listings');
    const searchInput = document.getElementById('search');

    const users = [
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            resume: 'john_doe_resume.pdf',
            appliedDate: '2024-08-02'
        },
        {
            name: 'Ved Prakash',
            email: 'ved@example.com',
            resume: 'prakash_resume.pdf',
            appliedDate: '2024-06-25'
        },
        {
            name: 'Rakesh Vishwakarma',
            email: 'rakesh@example.com',
            resume: 'rakesh_m_resume.pdf',
            appliedDate: '2024-03-15'
        },
        {
            name: 'Sonu Nigam',
            email: 'sonu11@example.com',
            resume: 'sonu_resume.pdf',
            appliedDate: '2024-03-02'
        },
        {
            name: 'Pankaj Jaiseal',
            email: 'jaiswal@example.com',
            resume: 'pankaj_resume.pdf',
            appliedDate: '2023-11-31'
        },
        {
            name: 'Avneet tripathi',
            email: 'avnee.tri@example.com',
            resume: 'tri_resume.pdf',
            appliedDate: '2024-01-11'
        },
        {
            name: 'Rahul Kumar',
            email: 'rahul@example.com',
            resume: 'rahul_resume.pdf',
            appliedDate: '2024-07-01'
        },
        {
            name: 'Kane Smith',
            email: 'Kane.smith@example.com',
            resume: 'kane_smith_resume.pdf',
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
