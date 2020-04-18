import React from 'react';
import { connect } from 'react-redux';
import { selectTeams } from '../redux/selectors';

import '../../scss/components/ScoreReminder.scss';

const ScoreReminder = ({ teams }) => {
	return (
		<div className="table-container score-reminder">
			<table className="table is-fullwidth">
				<thead>
					<tr>
						{teams.map( team =>
							<td>{team.name}</td>
						)}
					</tr>
				</thead>
				<tbody>
					<tr>
						{teams.map( team =>
							<td>{team.totalScore || 0}</td>
						)}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = (state) => ({
	teams: selectTeams(state),
});

export default connect(mapStateToProps)(ScoreReminder);