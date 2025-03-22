import { Link } from 'react-router-dom';
import './Terms.css'
import { LuChevronLeft } from 'react-icons/lu';

const Terms = () => {
	return (
		<div className="terms-page">
			<Link to='/app/settings' className='back-nav'><LuChevronLeft /><h3>Back</h3></Link>
			<h1>Puppr Terms and Conditions</h1>
			<h3>Effective Date: 3/18/2025</h3>

			<ol>
				<li>
					<h2>Acceptance of Terms</h2>
					<p>By accessing or using Puppr (the "App"), you agree to be bound by these Terms and Conditions (the "Terms").</p>
				</li>
				<li>
					<h2>Description of Service</h2>
					<p>
						Puppr is a platform that connects dog owners and dog enthusiasts for social meetups. 
						Users can create profiles, swipe on other profiles, match, and communicate through the app 
						to arrange playdates or social events.
					</p>
				</li>
				<li>
					<h2>User Accounts</h2>
					<ul>
						<li>You must be at least 18 years old to create an account.</li>
						<li>You are responsible for maintaining the confidentiality of your login credentials.</li>
						<li>You agree to provide accurate and truthful information when creating your profile.</li>
					</ul>
				</li>
				<li>
					<h2>Use of the App</h2>
					<ul>
						<li>You agree to use the App only for its intended purpose of connecting with other users and their dogs.</li>
						<li>You will not use the App for commercial purposes, spam, or harassment.</li>
						<li>You agree not to post inappropriate, offensive, or illegal content.</li>
					</ul>
				</li>
				<li>
					<h2>Safety and Responsibility</h2>
					<ul>
						<li>You acknowledge that meetups arranged through the App are at your own risk. Puppr is not responsible for the conduct of users or the behavior of their dogs.</li>
						<li>You agree to take necessary precautions during meetups, including assessing the safety and behavior of other dogs and people.</li>
					</ul>
				</li>
				<li>
					<h2>Privacy and Data Usage</h2>
					<ul>
						<li>We only collect and store the personal information you expressly share with us when you register an account.</li>
						<li>Your profile and messages may be visible to other users as part of the App's matching and communication features.</li>
					</ul>
				</li>
				<li>
					<h2>Termination</h2>
					<ul>
						<li>We reserve the right to suspend or terminate your account if you violate these Terms.</li>
						<li>You may delete your account at any time through the App settings</li>
					</ul>
				</li>
				<li>
					<h2>Limitation of Liability</h2>
					<ul>
						<li>Puppr is not liable for any damages or disputes arising from interactions or meetups arranged through the App.</li>
						<li>Puppr is not responsible for technical issues or service interruptions.</li>
					</ul>
				</li>
				<li>
					<h2>Modification to Terms</h2>
					<ul>
						<li>We reserve the right to modify these Terms at any time. Changes will be posted in the App with the updated effective date.</li>
					</ul>
				</li>
			</ol>
		</div>
	);
}

export default Terms;