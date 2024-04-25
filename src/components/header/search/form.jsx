import React from 'react';

class SearchForm extends React.Component {
	render() {
		return (
			<div className="navbar-form">
				<form action="" method="POST" name="search_form">
					<div className="form-group">
						<input type="text" className="form-control" placeholder="Enter keyword" />
						<button type="submit" className="btn btn-search"><i className="fa fa-search"></i></button>
					</div>
				</form>
			</div>
		);
	}
};

export default SearchForm;
