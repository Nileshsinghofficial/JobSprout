document.addEventListener('DOMContentLoaded', () => {
    const jobListings = document.getElementById('job-listings');
    const searchInput = document.getElementById('search');

    // sample object of jobs
    const jobs = [
        {
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'New York, NY',
            description: 'Develop and maintain web applications.'
        },
        {
            title: 'Data Scientist',
            company: 'Data Inc.',
            location: 'San Francisco, CA',
            description: 'Analyze and interpret complex data sets.'
        },
        {
            title: 'Software Engineer',
            company: 'Tata Consultancy Service',
            location: 'Bengaluru,Karnatka, India',
            description: 'Develop and maintain software and applications.'
        },
        {
            title: 'Web Developer',
            company: 'Infosys',
            location: 'Mumbai, Maharastra, India',
            description: 'Develop dynamic and responsive websites.'
        },
        {
            title: 'Android Application Developer',
            company: 'Orange',
            location: 'New York, NY',
            description: 'Develop and maintain android applications for mobile deevice.'
        },
        {
            title: 'Machine Learning',
            company: 'Microsoft',
            location: 'America',
            description: 'Analyze and interpret complex data sets. for AI.'
        },
        {
            title: 'Python Developer',
            company: 'Google',
            location: 'New York, NY',
            description: 'Build websites and software, automate tasks.'
        },
        {
            title: 'Java Developer',
            company: 'IBM',
            location: 'Armonk, NY',
            description: 'Scientific and mathematical computing application and Enterprises applications'
        },
        // Add more jobs --------
    ];

    const displayJobs = (jobs) => {
        jobListings.innerHTML = '';
        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.classList.add('job');
            jobElement.innerHTML = `
                <h2>${job.title}</h2>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
            `;
            jobListings.appendChild(jobElement);
        });
    };

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm)
        );
        displayJobs(filteredJobs);
    });

    displayJobs(jobs);
});
