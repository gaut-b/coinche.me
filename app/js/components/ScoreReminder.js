import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTeams } from '../redux/selectors/game';

import '../../scss/components/ScoreReminder.scss';

const ScoreReminder = ({ teams }) => {
	return (
		<div className="table-container score-reminder">
			<table className="table is-fullwidth">
				<thead>
					<tr>
						{teams.map( team =>
							<td key={team.name}>{team.name}</td>
						)}
					</tr>
				</thead>
				<tbody>
					<tr>
						{teams.map( team =>
							<td key={team.name}>{team.totalScore || 0}</td>
						)}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = createStructuredSelector({
	teams: selectTeams,
});

export default connect(mapStateToProps)(ScoreReminder);