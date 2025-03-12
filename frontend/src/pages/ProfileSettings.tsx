import { Profile } from "@shared/Profile";
import './ProfileSettings.css'
import { Link, useNavigate } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { useState } from "react";
import { LoginService } from "../services/LoginService";

interface Props {
	user: Profile | null
}

const ProfileSettings = (props: Props) => {

	const [service] = useState(new LoginService());
	const navigate = useNavigate();

	const logout = async () => {
		await service.logout()
		navigate('/')
	}

	const deleteAccount = async () => {
		await service.deleteAccount()
		navigate('/')
	}

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
				<button className='btn-yellow' onClick={logout}>Log Out</button>
				<button className='btn-red' onClick={deleteAccount}>Delete Account</button>
			</div>
		</div>
	);
}

export default ProfileSettings;