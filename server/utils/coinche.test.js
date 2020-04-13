import { countTrick, countPlayerScore } from './coinche';
import { DECK32 } from '../constants/decks';
import trumpTypes from '../../shared/constants/trumpTypes';

it('is counting a trick correctly', () => {
	const trick = ['JH', '9C', '10D', 'AS'];
	// console.log(DECK32)
	expect(countTrick(trick, trumpTypes.H)).toEqual(41);
	expect(countTrick(trick, trumpTypes.C)).toEqual(37);
	expect(countTrick(trick, trumpTypes.D)).toEqual(countTrick(trick, trumpTypes.S));
	expect(countTrick(trick, trumpTypes.NO_TRUMP)).toEqual(31);
	expect(countTrick(trick, trumpTypes.ALL_TRUMP)).toEqual(33);
	expect(countTrick(DECK32, trumpTypes.H)).toEqual(152);
});

it('is counting players score correctly', () => {
	const tricks = [
		{playerIndex: 0, cards: ['JH', '9C', 'KD', 'AS']},
		{playerIndex: 1, cards: ['JS', '9H', 'KC', 'AD']},
		{playerIndex: 2, cards: ['JD', '9S', 'KH', 'AC']},
		{playerIndex: 3, cards: ['JC', '9D', 'KS', 'AH']},
	];
	const lastDeclaration = {
		playerId: 'abcdef',
		content: {
			goal: 80,
			trumpType: trumpTypes.H,
		},
	};
	expect(countPlayerScore([], {})).toEqual({});
	expect(countPlayerScore([], lastDeclaration)).toEqual({});
	expect(countPlayerScore(tricks, {})).toEqual({});
	expect(countPlayerScore(tricks, lastDeclaration)).toEqual({
		0: 35,
		1: 31,
		2: 17,
		3: 17,
	});
});
