import { Profile } from "@shared/Profile";
import './ProfileSettings.css'
import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";

interface Props {
	user: Profile | null
}

const ProfileSettings = (props: Props) => {
	return (
		<div className='settings-page'>
			<div className='settings-header'>
				<img src={props.user?.imageLink} alt={props.user?.dogName} />
				<h1>{props.user?.dogName}</h1>
				<hr />
			</div>

			<div className='settings-links'>
				<Link to={'/'}><p>Edit Profile</p><LuChevronRight /></Link>
				<Link to={'/'}><p>Display</p><LuChevronRight /></Link>
				<Link to={'/'}><p>Notifications</p><LuChevronRight /></Link>
				<Link to={'/'}><p>Privacy</p><LuChevronRight /></Link>
				<Link to={'/'}><p>Report an Issue</p><LuChevronRight /></Link>
				<Link to={'/'}><p>Terms and Conditions</p><LuChevronRight /></Link>
			</div>

			<div className='settings-buttons'>
				<button className='btn-yellow'>Log Out</button>
				<button className='btn-red'>Delete Account</button>
			</div>
		</div>
	);
}

export default ProfileSettings;