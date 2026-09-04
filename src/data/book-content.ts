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
		imagePath: string;
		sideNote: string;
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
		name: "[TEACHER NAME]",
		honorific: "Professor",
		designation: "[DESIGNATION]",
		department: "[DEPARTMENT]",
		institution: "[INSTITUTION]",
		batch: "[BATCH / YEAR]",
	},
	cover: {
		title: "THE MEMORIES WE KEEP",
		subtitle: "A TEACHER'S DAY TRIBUTE",
		tagline: "Celebrating the teacher who made a difference.",
		greeting: "HAPPY TEACHER'S DAY",
		imagePath: "/images/teacher/portrait.jpg",
	},
	dedication: {
		exLibris: "EX LIBRIS • COMMEMORATIVE EDITION",
		heading: "In Grateful Dedication",
		body: "Presented with the deepest admiration and enduring respect on the occasion of Teacher's Day.\n\nFor the countless hours invested, the quiet patience extended, and the unwavering conviction that every student could reach beyond their perceived limits.",
		presentedTo: "Presented to [TEACHER NAME]",
		presentedBy: "From the Grateful Students of [BATCH / YEAR]",
	},
	page2: {
		heading: "More Than a Teacher",
		subheading: "The Person Behind the Lessons",
		leadQuote: "“Behind every lesson was patience. Behind every correction was care. And behind every achievement was someone who believed we could do better.”",
		content: "To the world outside these halls, you hold the title of teacher. But to those of us fortunate enough to learn under your wing, you have been an architect of our curiosity, a reassuring guide through complexity, and a constant example of quiet integrity.\n\nYou reminded us that scholarship without empathy is barren, and that diligence outlasts fleeting talent. In honoring you today, we celebrate a lifetime of genuine influence.",
		imagePath: "/images/teacher/portrait.jpg",
		caption: "[TEACHER PORTRAIT] • A mentor whose wisdom guides generations",
	},
	page3: {
		heading: "Where It All Happened",
		subheading: "Lectures, Discussions & Everyday Campus Life",
		intro: "The room where uncertainty turned into understanding. Every chalkboard sketch, lively question, and animated debate became an indelible chapter of our education.",
		imagePath1: "/images/classroom/lecture.jpg",
		caption1: "The morning lectures where challenging ideas transformed into sudden, unforgettable clarity.",
		imagePath2: "/images/memories/mentorship.jpg",
		caption2: "Small-group discussions: patient feedback, shared laughter, and genuine encouragement.",
	},
	page4: {
		heading: "Lessons We Will Carry",
		subheading: "Principles That Outlive The Syllabus",
		principles: [
			{
				number: "01",
				title: "Discipline creates consistency.",
				description: "Motivation sparks the journey, but deliberate habit and steady resolve build lasting mastery.",
			},
			{
				number: "02",
				title: "Questions lead to understanding.",
				description: "Never hesitate before what is unfamiliar; curiosity and honest inquiry are the true roots of insight.",
			},
			{
				number: "03",
				title: "Do the work. Then do it better.",
				description: "Excellence is never an accident; it is the daily craft of refusing to settle for merely good enough.",
			},
			{
				number: "04",
				title: "Mistakes are data for the next attempt.",
				description: "Every setback teaches what books cannot. Examine without fear, calibrate, and keep moving forward.",
			},
			{
				number: "05",
				title: "Knowledge is a responsibility to share.",
				description: "True accomplishment is measured not by personal acclaim, but by how generously you illuminate others.",
			},
		],
		accentQuote: "“The syllabus had a final page. Your guidance does not.”",
	},
	page5: {
		heading: "Moments We Remember",
		subheading: "The Memories Lived Between the Lessons",
		moments: [
			{
				imagePath: "/images/memories/campus.jpg",
				caption: "The Conversations.",
				detail: "Courtyard walks and informal chats that untangled our biggest dilemmas.",
			},
			{
				imagePath: "/images/memories/mentorship.jpg",
				caption: "The Laughter.",
				detail: "Moments of warmth that made demanding semesters feel joyful and human.",
			},
			{
				imagePath: "/images/classroom/lecture.jpg",
				caption: "The Breakthroughs.",
				detail: "When an impossible concept finally clicked under your watchful patience.",
			},
		],
	},
	page6: {
		heading: "Words That Stayed With Us",
		subheading: "Echoes of Wisdom in Hallways and Hearts",
		quotes: [
			{
				quote: "[QUOTE FROM TEACHER 1: “Never settle for good enough when you possess the capacity for the extraordinary.”]",
				context: "Advice shared during annual project evaluations",
			},
			{
				quote: "[QUOTE FROM TEACHER 2: “The purpose of education is not merely to memorize facts, but to cultivate the courage to seek truth.”]",
				context: "Commencement address to incoming students",
			},
			{
				quote: "[QUOTE FROM TEACHER 3: “Be patient with the learning curve, but relentless with your personal standards.”]",
				context: "Classroom reflection before final examinations",
			},
		],
		attribution: "— [TEACHER NAME]",
	},
	page7: {
		heading: "What You Left With Us",
		subheading: "The Enduring Pillars of Your Mentorship",
		pillars: [
			{
				trait: "Confidence.",
				meaning: "To stand firm and voice our reasoning even when our convictions were young.",
			},
			{
				trait: "Discipline.",
				meaning: "The inner strength to show up and perform when initial excitement had faded.",
			},
			{
				trait: "Curiosity.",
				meaning: "An unrelenting urge to peer beneath the obvious and interrogate the foundations.",
			},
			{
				trait: "Perspective.",
				meaning: "The wisdom to see that intellect must always serve humanity and compassion.",
			},
			{
				trait: "Belief.",
				meaning: "Because you recognized potential in each of us long before we dared see it in ourselves.",
			},
		],
		imagePath: "/images/memories/campus.jpg",
		sideNote: "A legacy measured not in test scores, but in the character of those you guided.",
	},
	page8: {
		heading: "The People & The Memories",
		subheading: "A Tapestry of Faces, Milestones, and Shared Years",
		imagePath: "/images/group/class-photo.jpg",
		caption: "[CLASS PHOTO] • Moments we will remember. People who shared them. Memories that remain.",
		albumNotes: [
			"Late afternoons in the laboratory comparing notes.",
			"The nervous energy before presentations and the relief afterward.",
			"A shared brotherhood and sisterhood forged under your encouragement.",
		],
	},
	page9: {
		heading: "From All of Us",
		subheading: "A Message of Everlasting Appreciation",
		letterParagraphs: [
			"You taught us subjects, but you also taught us how to approach challenges, how to keep learning, and how to keep moving forward.",
			"The lessons may belong to the classroom, but their impact will travel far beyond it. Whenever we face complex problems, step into unfamiliar rooms, or take our turn to mentor others, we will carry a part of your wisdom with us.",
			"Thank you for being a teacher we will remember for the rest of our days.",
		],
		signatureLabel: "With deepest respect and heartfelt appreciation,",
		signatories: "Your Students • Department of [DEPARTMENT]",
		footnote: "“To teach is to touch a life forever.”",
	},
	page10: {
		heading: "THANK YOU, PROFESSOR.",
		greeting: "HAPPY TEACHER'S DAY",
		stanza: [
			"For every lesson patiently delivered.",
			"For every correction given with care.",
			"For every word of encouragement when we doubted.",
			"For every moment you believed in our potential.",
		],
		closing: "With eternal gratitude,\nYour Students",
		imagePath: "/images/teacher/portrait.jpg",
	},
	insideBackCover: {
		sealTitle: "COMMEMORATIVE VALEDICTION",
		sealBody: "Dedicated on Teacher's Day to a mentor whose legacy lives in every student's future.",
		quote: "“An educator's impact extends into eternity; one can never tell where their influence stops.”",
		attribution: "Henry Adams",
	},
	backCover: {
		title: "THE MEMORIES WE KEEP",
		subtitle: "A Teacher's Day Tribute Edition",
		institution: "[INSTITUTION] • [DEPARTMENT]",
		year: "COMMEMORATIVE MONOGRAPH",
	},
};
