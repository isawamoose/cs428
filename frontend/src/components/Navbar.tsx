import { LuHouse, LuBone, LuUser, LuSettings } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

	const navigate = useNavigate();

	return (
		<nav className='app-navbar'>
			<LuHouse onClick={() => navigate('/app')}/>
			<LuBone onClick={() => navigate('/app/matches')}/>
			<LuUser onClick={() => navigate('/app/profile')}/>
			<LuSettings onClick={() => navigate('/app/settings')}/>
		</nav>
	)
}

export default Navbar;