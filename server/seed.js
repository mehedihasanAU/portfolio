const bcrypt = require('bcryptjs');
const { db_helpers } = require('./database');

async function seedDatabase() {
    console.log('Seeding database with initial data...');

    // Create admin user (username: admin, password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    try {
        db_helpers.createUser('admin', hashedPassword);
        console.log('✓ Admin user created (username: admin, password: admin123)');
    } catch (error) {
        console.log('Admin user already exists');
    }

    // Seed About section
    db_helpers.updateAbout({
        title: 'Program Director (IT/Academic), Lecturer & Researcher',
        subtitle: 'Australian Institute of Higher Education',
        description: `Hello, I'm A B M Mehedi Hasan. I am an experienced Academic Leader and Lecturer with a demonstrated history of working in the higher education industry. Currently, I serve as the Program Director at the Australian Institute of Higher Education and am pursuing a PhD at the University of New England.

I am skilled in Blockchain, Edge Computing, Deep Learning, and Academic Leadership. My passion lies in bridging the gap between complex technology and practical education.`,
        image_url: '/images/profile_pic.webp'
    });
    console.log('✓ About section seeded');

    // Seed Work Experience
    const workExperiences = [
        {
            title: 'Program Director - IT and Systems',
            company: 'Australian Institute of Higher Education',
            period: 'Jul 2025 - Present',
            description: 'Leading the IT and Systems program at the Australian Institute of Higher Education. Responsible for curriculum development, academic leadership, and student success. Previously served as Program Manager and Lecturer.',
            skills: 'Academic Leadership, Curriculum Development, Lecturing, Student Success, IT Management',
            image_url: '/images/community.webp',
            display_order: 1
        },
        {
            title: 'PhD Research - Cyber Security',
            company: 'University of New England',
            period: 'Current',
            description: 'My research focuses on Blockchain, Edge Computing, and Cybersecurity. I am currently pursuing a Doctor of Philosophy (PhD) at the University of New England (AU). My work aims to address security and privacy limitations in Edge Computing using Blockchain technology.',
            skills: 'Blockchain, Edge Computing, Cybersecurity, Research, Academic Writing, Distributed Ledger Technology',
            image_url: '/images/computer.webp',
            display_order: 2
        },
        {
            title: 'Publications & Projects',
            company: 'Various',
            period: '2022 - Present',
            description: 'I have published several papers and book chapters, including "Improving Weeds Identification with a Repository of Agricultural Pre-trained Deep Neural Networks" (IEEE, 2022) and "Usage of Blockchain for Edge Computing" (CRC Press). My work explores secure financial transactions and enhancing farming productivity using deep neural networks.',
            skills: 'Deep Learning, Neural Networks, Blockchain, Edge Computing, Academic Publishing, Technical Writing',
            image_url: '/images/piano.webp',
            display_order: 3
        }
    ];

    workExperiences.forEach(work => {
        db_helpers.createWork(work);
    });
    console.log('✓ Work experiences seeded');

    // Seed Publications
    const publications = [
        {
            title: 'Improving Weeds Identification with a Repository of Agricultural Pre-trained Deep Neural Networks',
            publisher: 'IEEE',
            year: 2022,
            description: 'Aims to increase farmers\' income and enhance farming productivity using deep neural networks for weed identification.',
            url: 'https://ieeexplore.ieee.org/document/9719936',
            image_url: '',
            display_order: 1
        },
        {
            title: 'Ledger Technology of Blockchain and its Impact on Operational Performance of Banks: A Review',
            publisher: 'IEEE',
            year: 2022,
            description: 'Incorporates distributed ledger technology and Blockchain for secure financial transactions, eliminating third-party providers.',
            url: 'https://ieeexplore.ieee.org/document/9719886',
            image_url: '',
            display_order: 2
        },
        {
            title: 'Usage of Blockchain for Edge Computing - Book Chapter',
            publisher: 'CRC Press',
            year: 2023,
            description: 'Explores how Blockchain can address security and privacy limitations in Edge Computing.',
            url: 'https://www.taylorfrancis.com/chapters/edit/10.1201/9781003028635-19/usage-blockchain-edge-computing-mehedi-hasan-md-shamsur-rahim-sabbir-ahmed-andrew-levula',
            image_url: '',
            display_order: 3
        }
    ];

    publications.forEach(pub => {
        db_helpers.createPublication(pub);
    });
    console.log('✓ Publications seeded');

    // Seed Contact info
    db_helpers.updateContact({
        email: '[email protected]',
        github: 'https://github.com/mehedihasanAU/portfolio',
        linkedin: 'https://www.linkedin.com/',
        instagram: ''
    });
    console.log('✓ Contact info seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🚀 You can now start the server with: node server/server.js');
}

// Run seed if this file is executed directly
if (require.main === module) {
    seedDatabase().catch(console.error);
}

module.exports = seedDatabase;
