import { Profile } from "@shared/Profile";
import './ProfileSettings.css'
import { Link, useNavigate } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { useRef, useState } from "react";
import { LoginService } from "../services/LoginService";

interface Props {
	user: Profile | null
}

const ProfileSettings = (props: Props) => {

	const [service] = useState(new LoginService());
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const navigate = useNavigate();

	const logout = async () => {
		await service.logout();
		navigate('/');
	}

	const deleteAccount = async () => {
		await service.deleteAccount();
		navigate('/');
	}

	return (
		<div className='settings-page'>
			
			<dialog ref={dialogRef}>
				<h2>Are you sure you want to delete your account?</h2>
				<p>
					Doing so will delete all of your account data including <b>previous matches, login information, 
					and account settings</b> as well.
				</p>
				<button className="big-text" onClick={() => dialogRef.current?.close()}>Do Not Delete My Account</button>
				<button onClick={deleteAccount}>Delete My Account</button>
			</dialog>

			<div className='settings-header'>
				<img src={props.user?.imageLink} alt={props.user?.dogName} />
				<h1>{props.user?.dogName}</h1>
				<hr />
			</div>

			<div className='settings-links'>
				<Link to={'/app'}><p>Edit Profile</p><LuChevronRight /></Link>
				<Link to={'/app'}><p>Display</p><LuChevronRight /></Link>
				<Link to={'/app'}><p>Notifications</p><LuChevronRight /></Link>
				<Link to={'/app'}><p>Privacy</p><LuChevronRight /></Link>
				<Link to={'/app'}><p>Report an Issue</p><LuChevronRight /></Link>
				<Link to={'/app'}><p>Terms and Conditions</p><LuChevronRight /></Link>
			</div>

			<div className='settings-buttons'>
				<button className='btn-yellow' onClick={logout}>Log Out</button>
				<button className='btn-red' onClick={() => dialogRef.current?.showModal()}>Delete Account</button>
			</div>
		</div>
	);
}

export default ProfileSettings;