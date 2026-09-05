export interface BookContent {
	teacher: {
		name: string;
		honorific: string;
		designation: string;
		department: string;
		institution: string;
		batch: string;
	};
	cover: {
		title: string;
		subtitle: string;
		tagline: string;
		greeting: string;
		imagePath: string;
	};
	dedication: {
		exLibris: string;
		heading: string;
		body: string;
		objectives: Array<{
			number: string;
			title: string;
			description: string;
		}>;
		presentedTo: string;
		presentedBy: string;
	};
	page2: {
		heading: string;
		subheading: string;
		leadQuote: string;
		content: string;
		imagePath: string;
		caption: string;
	};
	page3: {
		heading: string;
		subheading: string;
		intro: string;
		imagePath1: string;
		caption1: string;
		imagePath2: string;
		caption2: string;
	};
	page4: {
		heading: string;
		subheading: string;
		principles: Array<{
			number: string;
			title: string;
			description: string;
		}>;
		accentQuote: string;
	};
	page5: {
		heading: string;
		subheading: string;
		moments: Array<{
			imagePath: string;
			caption: string;
			detail: string;
		}>;
	};
	page6: {
		heading: string;
		subheading: string;
		quotes: Array<{
			quote: string;
			context: string;
		}>;
		attribution: string;
	};
	page7: {
		heading: string;
		subheading: string;
		pillars: Array<{
			trait: string;
			meaning: string;
		}>;
		imagePath1: string;
		caption1: string;
		imagePath2: string;
		caption2: string;
		sideNote: string;
	};
	facultyPage1: {
		heading: string;
		subheading: string;
		members: Array<{
			name: string;
			designation: string;
			department: string;
			imagePath: string;
			quote: string;
		}>;
	};
	facultyPage2: {
		heading: string;
		subheading: string;
		members: Array<{
			name: string;
			designation: string;
			department: string;
			imagePath: string;
			quote: string;
		}>;
	};
	page8: {
		heading: string;
		subheading: string;
		imagePath: string;
		caption: string;
		albumNotes: string[];
	};
	page9: {
		heading: string;
		subheading: string;
		letterParagraphs: string[];
		signatureLabel: string;
		signatories: string;
		footnote: string;
	};
	page10: {
		heading: string;
		greeting: string;
		stanza: string[];
		closing: string;
		imagePath: string;
	};
	insideBackCover: {
		sealTitle: string;
		sealBody: string;
		quote: string;
		attribution: string;
	};
	backCover: {
		title: string;
		subtitle: string;
		institution: string;
		year: string;
	};
}

export const bookContent: BookContent = {
	teacher: {
		name: "OUR BELOVED TEACHERS",
		honorific: "Respected Professors & Mentors",
		designation: "Faculty of Computer Science & Engineering",
		department: "Department of Computer Science & Engineering",
		institution: "CSEA — Computer Science & Engineering Association",
		batch: "TEACHER'S DAY SPECIAL EDITION",
	},
	cover: {
		title: "THE MEMORIES WE KEEP",
		subtitle: "A TEACHER'S DAY TRIBUTE",
		tagline: "Honoring the visionary mentors who light our path.",
		greeting: "HAPPY TEACHER'S DAY",
		imagePath: "/images/teacher/hod.jpg",
	},
	dedication: {
		exLibris: "CSEA CHARTER & COMMEMORATIVE DEDICATION",
		heading: "Core Objectives & Principles",
		body: "Fostering excellence in technical innovation, research, and collaborative learning across Computer Science & Engineering.",
		objectives: [
			{
				number: "01",
				title: "Technical Mastery & Innovation",
				description: "Empowering students with deep algorithmic knowledge, cutting-edge software engineering skills, and research excellence.",
			},
			{
				number: "02",
				title: "Collaborative Learning & Mentorship",
				description: "Bridging academic theory and real-world engineering through active mentorship, team discovery, and continuous guidance.",
			},
			{
				number: "03",
				title: "Ethical Leadership & Social Impact",
				description: "Instilling professional integrity, teamwork, and a passion to build technology that serves humanity.",
			},
		],
		presentedTo: "Dedicated to Our Respected Faculty & Mentors",
		presentedBy: "Presented by Computer Science & Engineering Association (CSEA)",
	},
	page2: {
		heading: "Tribute to Our Visionary HOD",
		subheading: "Head of Department • Computer Science & Engineering",
		leadQuote: "“A great leader and educator does not just teach lessons; they inspire minds to dream big, build fearlessly, and lead with purpose.”",
		content: "With profound gratitude and respect, we honor our Head of Department on Teacher's Day.\n\nUnder your inspiring guidance, CSE has flourished as a center of academic excellence and innovation. Your dedication to student growth and academic integrity guides us every day.",
		imagePath: "/images/teacher/hod.jpg",
		caption: "Head of Department • Department of Computer Science & Engineering",
	},
	page3: {
		heading: "Where Discovery Begins",
		subheading: "Classrooms, Code & Collaboration",
		intro: "The hall where curiosity transforms into understanding. Every sketch, line of code, and debate shaped our journey.",
		imagePath1: "/images/classroom/photo_4.jpg",
		caption1: "Lectures where complex ideas became crystal clear.",
		imagePath2: "/images/classroom/photo_1.jpg",
		caption2: "Mentorship, shared laughter, and constant encouragement.",
	},
	page4: {
		heading: "Lessons Beyond Books",
		subheading: "Pillars of Lifelong Learning",
		principles: [
			{
				number: "01",
				title: "Discipline creates consistency.",
				description: "Motivation sparks the journey; deliberate habit builds true mastery.",
			},
			{
				number: "02",
				title: "Curiosity drives innovation.",
				description: "Never fear the unknown; questions are the seeds of discovery.",
			},
			{
				number: "03",
				title: "Excellence is a daily habit.",
				description: "Do the work with integrity, then push the boundaries further.",
			},
			{
				number: "04",
				title: "Failures are stepping stones.",
				description: "Every setback carries data for your next victory. Calibrate and persevere.",
			},
			{
				number: "05",
				title: "Share your knowledge.",
				description: "True accomplishment is measured by how generously you illuminate others.",
			},
		],
		accentQuote: "“The syllabus ends, but your guidance endures forever.”",
	},
	page5: {
		heading: "Unforgettable Moments",
		subheading: "Memories Lived Between the Lessons",
		moments: [
			{
				imagePath: "/images/memories/photo_2.jpg",
				caption: "Campus Conversations.",
				detail: "Courtyard discussions that guided our biggest choices.",
			},
			{
				imagePath: "/images/memories/photo_3.jpg",
				caption: "Shared Laughter.",
				detail: "Warmth that made demanding code sprints feel effortless.",
			},
			{
				imagePath: "/images/memories/photo_4.jpg",
				caption: "Eureka Breakthroughs.",
				detail: "The thrill when an impossible problem finally clicked.",
			},
		],
	},
	page6: {
		heading: "Words That Inspire",
		subheading: "Echoes of Wisdom in Hallways & Hearts",
		quotes: [
			{
				quote: "“Never settle for good enough when you have the power to create the extraordinary.”",
				context: "Guidance shared during annual project evaluations",
			},
			{
				quote: "“Education is not just learning facts, but cultivating courage to build solutions.”",
				context: "Address to CSEA Students & Innovators",
			},
			{
				quote: "“Be patient with the learning curve, but relentless with your standards.”",
				context: "Classroom reflection before graduation",
			},
		],
		attribution: "— Faculty of CSE",
	},
	page7: {
		heading: "Your Enduring Legacy",
		subheading: "What You Bestowed Upon Us",
		pillars: [
			{
				trait: "Confidence",
				meaning: "To stand firm and articulate our vision with conviction.",
			},
			{
				trait: "Discipline",
				meaning: "The strength to show up and perform when excitement fades.",
			},
			{
				trait: "Innovation",
				meaning: "An unrelenting urge to peer beneath the obvious and build better.",
			},
			{
				trait: "Ethics",
				meaning: "The wisdom to ensure technology always serves humanity.",
			},
			{
				trait: "Belief",
				meaning: "Because you recognized potential in us long before we saw it.",
			},
		],
		imagePath1: "/images/memories/photo_5.jpg",
		caption1: "Mentorship that endures through time.",
		imagePath2: "/images/memories/photo_7.jpg",
		caption2: "Guiding the future with wisdom & dedication.",
		sideNote: "A legacy measured not in grades, but in the character of innovators you molded.",
	},
	facultyPage1: {
		heading: "Our Esteemed Faculty",
		subheading: "Visionaries Shaping the Future",
		members: [
			{
				name: "Professor A",
				designation: "Senior Professor",
				department: "Computer Science",
				imagePath: "/images/faculty/1.jpg",
				quote: "Code with purpose.",
			},
			{
				name: "Professor B",
				designation: "Associate Professor",
				department: "Computer Science",
				imagePath: "/images/faculty/2.jpg",
				quote: "Innovate endlessly.",
			},
			{
				name: "Professor C",
				designation: "Assistant Professor",
				department: "Computer Science",
				imagePath: "/images/faculty/3.jpg",
				quote: "Build for humanity.",
			},
		],
	},
	facultyPage2: {
		heading: "Our Esteemed Faculty",
		subheading: "Mentors of Excellence",
		members: [
			{
				name: "Professor D",
				designation: "Assistant Professor",
				department: "Computer Science",
				imagePath: "/images/faculty/4.jpg",
				quote: "Think deeply.",
			},
			{
				name: "Professor E",
				designation: "Lecturer",
				department: "Computer Science",
				imagePath: "/images/faculty/5.jpg",
				quote: "Learn always.",
			},
			{
				name: "Professor F",
				designation: "Lecturer",
				department: "Computer Science",
				imagePath: "/images/faculty/6.jpg",
				quote: "Lead with integrity.",
			},
		],
	},
	page8: {
		heading: "The CSEA Family",
		subheading: "A Tapestry of Faces & Shared Milestones",
		imagePath: "/images/group/photo_6.jpg",
		caption: "CSEA Class & Faculty • Memories that will last a lifetime.",
		albumNotes: [
			"Late-night hackathons and lab sessions comparing code.",
			"The thrill of project showcases and shared triumphs.",
			"A lifelong bond forged under your guidance and wisdom.",
		],
	},
	page9: {
		heading: "From All of Us",
		subheading: "A Message of Heartfelt Gratitude",
		letterParagraphs: [
			"You taught us syntax, algorithms, and engineering; but far beyond books, you taught us how to think critically, build fearlessly, and lead with honor.",
			"Whenever we solve complex challenges, pioneer new paths, or guide others, we carry your wisdom as our enduring compass.",
			"Thank you for your tireless dedication, endless patience, and unwavering belief in our journey.",
		],
		signatureLabel: "With deepest respect and enduring gratitude,",
		signatories: "Students & Officers • CSEA",
		footnote: "“To teach is to touch a life forever.”",
	},
	page10: {
		heading: "THANK YOU, PROFESSORS!",
		greeting: "HAPPY TEACHER'S DAY • CSEA TRIBUTE",
		stanza: [
			"For every lesson patiently delivered.",
			"For every guidance when code failed to compile.",
			"For every word of encouragement when we doubted.",
			"For believing in our potential to shape the future.",
		],
		closing: "WITH ETERNAL GRATITUDE,\nCSEA & DEPARTMENT STUDENTS",
		imagePath: "/images/teacher/hod.jpg",
	},
	insideBackCover: {
		sealTitle: "COMMEMORATIVE VALEDICTION",
		sealBody: "Dedicated on Teacher's Day by CSEA to mentors whose legacy lives in every student's future.",
		quote: "“An educator's impact extends into eternity; one can never tell where their influence stops.”",
		attribution: "Computer Science & Engineering Association (CSEA)",
	},
	backCover: {
		title: "THE MEMORIES WE KEEP",
		subtitle: "A Teacher's Day Tribute",
		institution: "Computer Science & Engineering Association (CSEA)",
		year: "COMMEMORATIVE EDITION",
	},
};
