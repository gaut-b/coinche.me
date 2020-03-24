import { connect } from 'react-redux';
import { distribute, playCard } from '../redux/actions'
import Game from '../components/Game'

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    onDistribute: () => {
      dispatch(distribute())
    },
    onPlayCard: card =>{
      dispatch(playCard(card))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Game)