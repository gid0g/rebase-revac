import React from 'react';
import TopMenuNav from './top-menu-nav.jsx';

class TopMenu extends React.Component {
	render() {
		return (
			<div id="top-menu" className="app-top-menu">
				<TopMenuNav />
			</div>
		)
	}
}

export default TopMenu;