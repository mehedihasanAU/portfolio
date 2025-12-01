// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Cache for portfolio data
let portfolioCache = null;

/**
 * Fetch all portfolio data from the API
 * @returns {Promise<Object>} Portfolio data
 */
export async function fetchPortfolioData() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/all`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        portfolioCache = data;
        return data;
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Return fallback data if API is not available
        return getFallbackData();
    }
}

/**
 * Get cached portfolio data or fetch if not available
 * @returns {Promise<Object>} Portfolio data
 */
export async function getPortfolioData() {
    if (portfolioCache) {
        return portfolioCache;
    }
    return await fetchPortfolioData();
}

/**
 * Fallback data when API is not available
 * @returns {Object} Default portfolio data
 */
function getFallbackData() {
    return {
        about: {
            title: 'Program Director (IT/Academic), Lecturer & Researcher',
            subtitle: 'Australian Institute of Higher Education',
            description: `Hello, I'm A B M Mehedi Hasan. I am an experienced Academic Leader and Lecturer with a demonstrated history of working in the higher education industry. Currently, I serve as the Program Director at the Australian Institute of Higher Education and am pursuing a PhD at the University of New England.

I am skilled in Blockchain, Edge Computing, Deep Learning, and Academic Leadership. My passion lies in bridging the gap between complex technology and practical education.`,
            image_url: '/images/profile_pic.webp'
        },
        work: [
            {
                id: 1,
                title: 'Program Director - IT and Systems',
                company: 'Australian Institute of Higher Education',
                period: 'Jul 2025 - Present',
                description: 'Leading the IT and Systems program at the Australian Institute of Higher Education. Responsible for curriculum development, academic leadership, and student success.',
                skills: 'Academic Leadership, Curriculum Development, Lecturing, Student Success, IT Management',
                image_url: '/images/community.webp'
            },
            {
                id: 2,
                title: 'PhD Research - Cyber Security',
                company: 'University of New England',
                period: 'Current',
                description: 'My research focuses on Blockchain, Edge Computing, and Cybersecurity. I am currently pursuing a Doctor of Philosophy (PhD) at the University of New England (AU).',
                skills: 'Blockchain, Edge Computing, Cybersecurity, Research, Academic Writing',
                image_url: '/images/computer.webp'
            },
            {
                id: 3,
                title: 'Publications & Projects',
                company: 'Various',
                period: '2022 - Present',
                description: 'I have published several papers and book chapters, including work on deep neural networks and blockchain technology.',
                skills: 'Deep Learning, Neural Networks, Blockchain, Academic Publishing',
                image_url: '/images/piano.webp'
            }
        ],
        publications: [
            {
                id: 1,
                title: 'Improving Weeds Identification with a Repository of Agricultural Pre-trained Deep Neural Networks',
                publisher: 'IEEE',
                year: 2022,
                url: 'https://ieeexplore.ieee.org/document/9719936'
            },
            {
                id: 2,
                title: 'Ledger Technology of Blockchain and its Impact on Operational Performance of Banks',
                publisher: 'IEEE',
                year: 2022,
                url: 'https://ieeexplore.ieee.org/document/9719886'
            },
            {
                id: 3,
                title: 'Usage of Blockchain for Edge Computing - Book Chapter',
                publisher: 'CRC Press',
                year: 2023,
                url: 'https://www.taylorfrancis.com/chapters/edit/10.1201/9781003028635-19/'
            }
        ],
        contact: {
            email: '[email protected]',
            github: 'https://github.com/mehedihasanAU/portfolio',
            linkedin: 'https://www.linkedin.com/',
            instagram: ''
        }
    };
}

/**
 * Update DOM with portfolio data
 * @param {Object} data Portfolio data
 */
export function updatePortfolioDOM(data) {
    // Update About section
    if (data.about) {
        const aboutTitle = document.querySelector('.about .modal-paragraph-header');
        const aboutText = document.querySelectorAll('.about .modal-paragraph-text');

        if (aboutTitle) {
            aboutTitle.textContent = data.about.title;
        }

        if (aboutText.length > 0) {
            aboutText[0].textContent = data.about.description;
        }
    }

    // Update Work section
    if (data.work && data.work.length > 0) {
        const workProjects = document.querySelectorAll('.work-project');

        data.work.forEach((work, index) => {
            if (workProjects[index]) {
                const title = workProjects[index].querySelector('.modal-paragraph-header');
                const description = workProjects[index].querySelector('.modal-paragraph-text');
                const skills = workProjects[index].querySelectorAll('.modal-paragraph-text')[1];

                if (title) title.textContent = work.title;
                if (description) description.textContent = work.description;
                if (skills && work.skills) skills.textContent = `Skills: ${work.skills}`;
            }
        });
    }

    // Update Contact section
    if (data.contact) {
        const emailLink = document.querySelector('.contact-link[href^="mailto"]');
        const githubLink = document.querySelector('.contact-link .github')?.parentElement;
        const linkedinLink = document.querySelector('.contact-link .linkedin')?.parentElement;
        const instagramLink = document.querySelector('.contact-link .instagram')?.parentElement;

        if (emailLink && data.contact.email) {
            emailLink.href = `mailto:${data.contact.email}`;
        }

        if (githubLink && data.contact.github) {
            githubLink.href = data.contact.github;
        }

        if (linkedinLink && data.contact.linkedin) {
            linkedinLink.href = data.contact.linkedin;
        }

        if (instagramLink) {
            if (data.contact.instagram) {
                instagramLink.href = data.contact.instagram;
                instagramLink.style.display = '';
            } else {
                instagramLink.style.display = 'none';
            }
        }
    }

    // Update page title and meta
    if (data.about) {
        document.title = `${data.about.title.split(',')[0]} - Portfolio`;
    }
}
