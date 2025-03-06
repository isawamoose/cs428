import { Routes, Route, useNavigate } from "react-router-dom"
 import Home from "../pages/Home";
import { useEffect, useState } from "react";
import { LoginService } from "../services/LoginService";
import { UserInfoContext } from "../components/UserInfoProvider";
import { useContext } from "react";
import Navbar from "./Navbar";

const AuthRouter = () => {

	const [loginService] = useState(new LoginService());
	const {setCurrentUser} = useContext(UserInfoContext)
	const navigate = useNavigate();

	async function getCurrentUser() {
		const profile = await loginService.getProfile();
		if (profile) {
			setCurrentUser(profile)
		}
		else {
			navigate('/')
		}
	}

	useEffect(() => {
		getCurrentUser()
	}, [])

	return (
		<div className="authenticated">
			<Routes>
				<Route path='/' element={<Home />}/>
			</Routes>
			<Navbar />
		</div>
	);
} 

export default AuthRouter;