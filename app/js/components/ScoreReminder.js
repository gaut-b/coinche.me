import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectScore,
} from '../redux/selectors/game';

import '../../scss/components/ScoreReminder.scss';

const ScoreReminder = ({ score }) => {
	return (
		<div className="table-container score-reminder">
			<table className="table is-fullwidth">
				<thead>
					<tr>
						<td>NOUS</td>
						<td>EUX</td>
					</tr>
				</thead>
				<tbody>
					{score.map( ([us, others], index) =>
						<tr key={index}>
							<td>{us}</td>
							<td>{others}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = createStructuredSelector({
	score: selectScore,
});

export default connect(mapStateToProps)(ScoreReminder);