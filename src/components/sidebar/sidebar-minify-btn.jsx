import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

class SidebarMinifyBtn extends React.Component {
	render() {
		return (
			<AppSettings.Consumer>
				{({toggleAppSidebarMinify, toggleAppSidebarMobile, appSidebarTransparent, appSidebarGrid}) => (
					<div className="menu">
						<div className="menu-item d-flex">
							<Link to="/" className="app-sidebar-minify-btn ms-auto" onClick={toggleAppSidebarMinify}>
								<i className="fa fa-angle-double-left"></i>
							</Link>
						</div>
					</div>
				)}
			</AppSettings.Consumer>
		)
	}
}

export default SidebarMinifyBtn;